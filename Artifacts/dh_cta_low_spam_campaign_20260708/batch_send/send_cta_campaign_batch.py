#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import sys
import time
from datetime import datetime
from pathlib import Path

WORKSPACE_GMAIL_SCRIPT_DIR = Path(r"C:\Users\vu.hoang\.codex\skills\workspace-mcp-gmail\scripts")
sys.path.insert(0, str(WORKSPACE_GMAIL_SCRIPT_DIR))

from workspace_mcp_gmail import MESSAGE_ID_RE, WorkspaceMcp  # noqa: E402


ROOT = Path(r"C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website")
ARTIFACT_DIR = ROOT / "Artifacts" / "dh_cta_low_spam_campaign_20260708"
BATCH_DIR = ARTIFACT_DIR / "batch_send"
BODY_DIR = BATCH_DIR / "bodies"
CONFIG_PATH = BATCH_DIR / "mcp_config_work_alias.json"
CSV_PATH = ARTIFACT_DIR / "eligible_recipients_after_dhm8_dhm9_suppression.csv"
HTML_TEMPLATE_PATH = ARTIFACT_DIR / "email_cta_dhm_interest.html"
RESULTS_CSV = BATCH_DIR / "send_results.csv"
RESULTS_MD = BATCH_DIR / "send_results.md"
STATE_JSON = BATCH_DIR / "send_state.json"

ACCOUNT = "culturecodeproject@gmail.com"
SUBJECT = "Cơ hội tham gia Delivering Happiness Masterclass"

FORBIDDEN_STRINGS = [
    "CultureCode gửi Anh/Chị thông tin này vì Anh/Chị từng để lại quan tâm",
    "Điểm học phía Nam",
    "Điểm học phía Bắc",
    "Chọn lớp",
    "chọn điểm học",
    "CultureCode Community",
    "Quà tặng",
    "Hà Minh Châu",
    "Hình thức: Học trực tiếp",
    "không nhận",
    "Email này được gửi",
    "hạn chót",
    "10/08/2026",
]


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def write_state(**kwargs: object) -> None:
    state = {"updated_at": now_iso(), **kwargs}
    STATE_JSON.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def load_existing_verified() -> set[str]:
    if not RESULTS_CSV.is_file():
        return set()
    verified: set[str] = set()
    with RESULTS_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            if row.get("status") == "VERIFIED_DELIVERY":
                verified.add((row.get("email") or "").strip().lower())
    return verified


def append_result(row: dict[str, str]) -> None:
    exists = RESULTS_CSV.is_file()
    fieldnames = [
        "sent_at",
        "status",
        "full_name",
        "email",
        "source_row_number",
        "message_id",
        "verification_query",
        "error",
    ]
    with RESULTS_CSV.open("a", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        if not exists:
            writer.writeheader()
        writer.writerow(row)


def render_report(rows: list[dict[str, str]], total: int) -> None:
    verified = [row for row in rows if row["status"] == "VERIFIED_DELIVERY"]
    failed = [row for row in rows if row["status"] != "VERIFIED_DELIVERY"]
    lines = [
        "# DH CTA campaign send results",
        "",
        f"- Account: `{ACCOUNT}`",
        f"- Subject: `{SUBJECT}`",
        f"- Intended recipients: {total}",
        f"- VERIFIED sent: {len(verified)}",
        f"- Failed/skipped: {len(failed)}",
        f"- Updated at: {now_iso()}",
        "",
        "## Results",
        "",
        "| # | Status | Name | Email | Message ID |",
        "|---:|---|---|---|---|",
    ]
    for idx, row in enumerate(rows, 1):
        lines.append(
            f"| {idx} | {row['status']} | {row['full_name']} | {row['email']} | {row['message_id']} |"
        )
    RESULTS_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    BODY_DIR.mkdir(parents=True, exist_ok=True)

    if not CONFIG_PATH.is_file():
        raise SystemExit(f"Missing MCP config alias: {CONFIG_PATH}")
    if not CSV_PATH.is_file():
        raise SystemExit(f"Missing eligible CSV: {CSV_PATH}")
    if not HTML_TEMPLATE_PATH.is_file():
        raise SystemExit(f"Missing HTML template: {HTML_TEMPLATE_PATH}")

    template = HTML_TEMPLATE_PATH.read_text(encoding="utf-8")
    if "{TEN_NGUOI_NHAN}" not in template:
        raise SystemExit("Template placeholder {TEN_NGUOI_NHAN} not found")
    forbidden_hits = [value for value in FORBIDDEN_STRINGS if value in template]
    if forbidden_hits:
        raise SystemExit("Forbidden strings still present: " + "; ".join(forbidden_hits))

    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        recipients = [
            row
            for row in csv.DictReader(handle)
            if (row.get("Decision") or "").strip().upper() == "ELIGIBLE"
        ]

    verified_before = load_existing_verified()
    all_results: list[dict[str, str]] = []
    if RESULTS_CSV.is_file():
        with RESULTS_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
            all_results.extend(csv.DictReader(handle))

    write_state(status="STARTING", intended_recipients=len(recipients), already_verified=len(verified_before))
    print(f"START intended_recipients={len(recipients)} already_verified={len(verified_before)}", flush=True)

    with WorkspaceMcp(CONFIG_PATH, ACCOUNT, None) as client:
        tools = {tool.get("name") for tool in client.list_tools()}
        required = {"send_gmail_message", "search_gmail_messages"}
        missing = sorted(required - tools)
        if missing:
            raise SystemExit("Missing required MCP tools: " + ", ".join(missing))

        for index, recipient in enumerate(recipients, 1):
            email = (recipient.get("Email") or "").strip()
            email_key = email.lower()
            full_name = (recipient.get("FullName") or "").strip() or "Anh/Chị"
            source_row = (recipient.get("SourceRowNumber") or "").strip()

            if email_key in verified_before:
                print(f"SKIP already_verified {index}/{len(recipients)} {email}", flush=True)
                continue

            body = template.replace("{TEN_NGUOI_NHAN}", html.escape(full_name, quote=False))
            if "{TEN_NGUOI_NHAN}" in body:
                raise SystemExit(f"Placeholder remained for {email}")
            body_path = BODY_DIR / f"{index:02d}_{email_key.replace('@', '_at_').replace('.', '_')}.html"
            body_path.write_text(body, encoding="utf-8")

            write_state(status="SENDING", current_index=index, total=len(recipients), email=email, full_name=full_name)
            print(f"SENDING {index}/{len(recipients)} {full_name} <{email}>", flush=True)

            try:
                message, send_text = client.call_tool(
                    "send_gmail_message",
                    {
                        "user_google_email": ACCOUNT,
                        "to": email,
                        "subject": SUBJECT,
                        "body": body,
                        "body_format": "html",
                        "include_signature": False,
                    },
                    timeout=180,
                )
                if (message.get("result") or {}).get("isError"):
                    raise RuntimeError(send_text[:2000])
                match = MESSAGE_ID_RE.search(send_text)
                if not match:
                    raise RuntimeError("Send returned no Message ID: " + send_text[:2000])
                message_id = match.group(1)

                escaped_subject = SUBJECT.replace('"', '\\"')
                query = f'in:sent to:{email} subject:"{escaped_subject}" newer_than:1d'
                search_message, search_text = client.call_tool(
                    "search_gmail_messages",
                    {
                        "user_google_email": ACCOUNT,
                        "query": query,
                        "page_size": 10,
                    },
                    timeout=120,
                )
                search_error = bool((search_message.get("result") or {}).get("isError"))
                verified = not search_error and message_id in search_text
                status = "VERIFIED_DELIVERY" if verified else "UNVERIFIED_DELIVERY"
                result = {
                    "sent_at": now_iso(),
                    "status": status,
                    "full_name": full_name,
                    "email": email,
                    "source_row_number": source_row,
                    "message_id": message_id,
                    "verification_query": query,
                    "error": "" if verified else search_text[:500],
                }
                append_result(result)
                all_results.append(result)
                print(f"{status} {index}/{len(recipients)} {email} MESSAGE_ID={message_id}", flush=True)
                if not verified:
                    render_report(all_results, len(recipients))
                    write_state(status="FAILED", failed_email=email, reason="search did not confirm Message ID")
                    return 8
            except Exception as exc:
                result = {
                    "sent_at": now_iso(),
                    "status": "FAILED",
                    "full_name": full_name,
                    "email": email,
                    "source_row_number": source_row,
                    "message_id": "",
                    "verification_query": "",
                    "error": str(exc)[:1000],
                }
                append_result(result)
                all_results.append(result)
                render_report(all_results, len(recipients))
                write_state(status="FAILED", failed_email=email, reason=str(exc)[:1000])
                print(f"FAILED {index}/{len(recipients)} {email}: {exc}", flush=True)
                return 1

            time.sleep(0.8)

    render_report(all_results, len(recipients))
    sent_verified = sum(1 for row in all_results if row["status"] == "VERIFIED_DELIVERY")
    write_state(status="DONE", intended_recipients=len(recipients), verified_sent=sent_verified)
    print(f"DONE verified_sent={sent_verified}/{len(recipients)} results={RESULTS_CSV}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
