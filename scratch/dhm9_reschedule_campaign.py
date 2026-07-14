#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import os
import sys
import json
import re
import html
import time
from datetime import datetime
from pathlib import Path

# Cấu hình UTF-8 cho stdout/stderr để tránh lỗi Unicode trên Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Thêm đường dẫn thư viện WorkspaceMcp
WORKSPACE_GMAIL_SCRIPT_DIR = Path(r"C:\Users\vu.hoang\.codex\skills\workspace-mcp-gmail\scripts")
if str(WORKSPACE_GMAIL_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_GMAIL_SCRIPT_DIR))

try:
    from workspace_mcp_gmail import WorkspaceMcp
except ImportError:
    class WorkspaceMcp:
        def __init__(self, *args, **kwargs):
            pass
        def __enter__(self):
            return self
        def __exit__(self, *args):
            pass

ROOT = Path(r"c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website")
TEMPLATE_PATH = ROOT / "Artifacts" / "standardized_emails" / "dhm9_reschedule_email.html"
DATA_PATH = ROOT / "scratch" / "dhm9_data.json"
CONFIG_PATH = ROOT / "Artifacts" / "dh_cta_low_spam_campaign_20260708" / "batch_send" / "mcp_config_work_alias.json"

ACCOUNT = "culturecodeproject@gmail.com"
SUBJECT = "[Delivering Happiness Masterclass] Thông báo thay đổi lịch tổ chức sự kiện DHM9"

BTC_EMAILS = [
    "vuhoang2708@gmail.com",
    "chauhm71@gmail.com",
    "hoanhn.edu.vn@gmail.com"
]

def now_iso() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def render_email(template: str, name: str, status: str) -> str:
    body = template.replace("{TEN_NGUOI_NHAN}", html.escape(name, quote=False))
    if status == "PENDING":
        body = re.sub(r'<div class="notice-box">.*?</div>', '', body, flags=re.DOTALL)
    return body

def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in ["--dry-run", "--run"]:
        print("Usage: python scratch/dhm9_reschedule_campaign.py --dry-run | --run")
        return 1
        
    mode = sys.argv[1]
    
    if not TEMPLATE_PATH.is_file():
        print(f"Error: Missing HTML template: {TEMPLATE_PATH}")
        return 1
    if not DATA_PATH.is_file():
        print(f"Error: Missing data file: {DATA_PATH}")
        return 1
    if not CONFIG_PATH.is_file():
        print(f"Error: Missing MCP config: {CONFIG_PATH}")
        return 1
        
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    
    with DATA_PATH.open("r", encoding="utf-8") as f:
        students = json.load(f)
        
    print(f"[{now_iso()}] Campaign mode: {mode}")
    print(f"Loaded {len(students)} student records.")
    
    results = []
    
    with WorkspaceMcp(CONFIG_PATH, ACCOUNT, None) as client:
        if mode == "--dry-run":
            test_recipients = [
                {"name": "Sếp Dzũ (PAID UAT)", "email": "vuhoang2708@gmail.com", "status": "PAID"},
                {"name": "Sếp Dzũ (PENDING UAT)", "email": "vuhoang2708@gmail.com", "status": "PENDING"}
            ]
            print("\n--- RUNNING DRY-RUN TEST ---")
            for idx, r in enumerate(test_recipients, 1):
                body = render_email(template, r["name"], r["status"])
                subject = f"[UAT Test - {r['status']}] {SUBJECT}"
                print(f"Sending UAT email {idx}/2 to {r['email']} ({r['status']})...")
                
                try:
                    _, send_text = client.call_tool(
                        "send_gmail_message",
                        {
                            "user_google_email": ACCOUNT,
                            "to": r["email"],
                            "subject": subject,
                            "body": body,
                            "body_format": "html",
                            "include_signature": False,
                        },
                        timeout=180
                    )
                    print(f"Sent successfully! Response: {send_text.strip()[:100]}")
                except Exception as e:
                    print(f"Error sending to {r['email']}: {e}")
            print("--- DRY-RUN COMPLETED ---\n")
            return 0

        print("\n--- STARTING LIVE CAMPAIGN ---")
        for idx, student in enumerate(students, 1):
            name = student["name"]
            email = student["email"]
            status = student["status"]
            
            print(f"[{idx}/{len(students)}] Preparing email for {name} <{email}> ({status})...")
            body = render_email(template, name, status)
            
            retries = 3
            success = False
            msg_id = ""
            err_msg = ""
            
            while retries > 0 and not success:
                try:
                    _, send_text = client.call_tool(
                        "send_gmail_message",
                        {
                            "user_google_email": ACCOUNT,
                            "to": email,
                            "subject": SUBJECT,
                            "body": body,
                            "body_format": "html",
                            "include_signature": False,
                        },
                        timeout=180
                    )
                    success = True
                    match = re.search(r"Message ID:\s*([a-zA-Z0-9]+)", send_text)
                    if match:
                        msg_id = match.group(1)
                    else:
                        msg_id = "SUCCESS_NO_ID"
                    print(f" -> Sent successfully. MsgID: {msg_id}")
                except Exception as e:
                    retries -= 1
                    err_msg = str(e)
                    print(f" -> Error (retries left {retries}): {e}")
                    if retries > 0:
                        time.sleep(2)
                        
            results.append({
                "name": name,
                "email": email,
                "status": status,
                "sent_status": "SUCCESS" if success else "FAILED",
                "message_id": msg_id,
                "error": err_msg if not success else ""
            })
            
            time.sleep(1.0)
            
        print("--- LIVE CAMPAIGN COMPLETED ---\n")
        
        success_count = sum(1 for r in results if r["sent_status"] == "SUCCESS")
        fail_count = sum(1 for r in results if r["sent_status"] == "FAILED")
        
        report_html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; }}
    .container {{ max-width: 700px; margin: 20px auto; border: 1px solid #d1c9bd; padding: 25px; border-radius: 8px; }}
    h2 {{ color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; }}
    .summary {{ background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
    th, td {{ border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 13.5px; }}
    th {{ background-color: #f9fafb; font-weight: bold; }}
    .status-success {{ color: #16a34a; font-weight: bold; }}
    .status-failed {{ color: #dc2626; font-weight: bold; }}
  </style>
</head>
<body>
  <div class="container">
    <h2>Báo cáo kết quả gửi email dời lịch DHM9 Hà Nội</h2>
    <div class="summary">
      <p><strong>Thời gian thực hiện:</strong> {now_iso()}</p>
      <p><strong>Tài khoản gửi:</strong> {ACCOUNT}</p>
      <p><strong>Tổng số học viên gửi:</strong> {len(students)}</p>
      <p><strong>Gửi thành công:</strong> <span class="status-success">{success_count}</span></p>
      <p><strong>Gửi thất bại:</strong> <span class="status-failed">{fail_count}</span></p>
    </div>
    
    <h3>Chi tiết kết quả gửi</h3>
    <table>
      <thead>
        <tr>
          <th>Họ và tên</th>
          <th>Email</th>
          <th>Trạng thái</th>
          <th>Trạng thái gửi</th>
          <th>Message ID / Lỗi</th>
        </tr>
      </thead>
      <tbody>
"""
        for r in results:
            sent_cls = "status-success" if r["sent_status"] == "SUCCESS" else "status-failed"
            val = r["message_id"] if r["sent_status"] == "SUCCESS" else r["error"]
            report_html += f"""        <tr>
          <td>{r['name']}</td>
          <td>{r['email']}</td>
          <td>{r['status']}</td>
          <td><span class="{sent_cls}">{r['sent_status']}</span></td>
          <td>{val}</td>
        </tr>\n"""
        
        report_html += """      </tbody>
    </table>
  </div>
</body>
</html>"""
        
        print("Sending campaign report to BTC...")
        btc_subject = f"[Báo Cáo Chiến Dịch] Kết quả gửi email dời lịch DHM9 Hà Nội ({success_count}/{len(students)} thành công)"
        
        for btc_email in BTC_EMAILS:
            try:
                client.call_tool(
                    "send_gmail_message",
                    {
                        "user_google_email": ACCOUNT,
                        "to": btc_email,
                        "subject": btc_subject,
                        "body": report_html,
                        "body_format": "html",
                        "include_signature": False,
                    },
                    timeout=180
                )
                print(f" -> Report sent to {btc_email}")
            except Exception as e:
                print(f" -> Failed to send report to {btc_email}: {e}")
                
    return 0

if __name__ == "__main__":
    sys.exit(main())
