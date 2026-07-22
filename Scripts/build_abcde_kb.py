#!/usr/bin/env python3
"""Build the reviewed ABCDE knowledge base from temporary NotebookLM exports."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict, deque
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


RELEVANCE_TERMS = (
    "abcde",
    "lạc quan",
    "nghịch cảnh",
    "niềm tin",
    "hậu quả",
    "hệ quả",
    "phản biện",
    "tranh biện",
    "bằng chứng",
    "suy diễn",
    "hành động",
    "năng lượng",
    "tỉnh thức",
    "cảm xúc",
    "cạm bẫy",
    "cơ hội",
    "tự chủ",
)

UUID_LINE = re.compile(r"^[0-9a-f]{8}-[0-9a-f-]{27,}$", re.IGNORECASE)
URL_LINE = re.compile(r"^https?://", re.IGNORECASE)
EMAIL = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
PHONE = re.compile(r"(?<!\d)(?:\+?84|0)\d{8,10}(?!\d)")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    value = value.replace("đ", "d").replace("Đ", "D").lower()
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def clean_line(
    line: str,
    redactions: list[str],
    case_insensitive_redactions: list[str],
) -> str:
    value = re.sub(r"\s+", " ", line).strip()
    if not value or UUID_LINE.match(value) or URL_LINE.match(value):
        return ""
    if value.lower() in {"arial", "times new roman"} or re.fullmatch(r"\d+", value):
        return ""
    value = EMAIL.sub("[email đã ẩn]", value)
    value = PHONE.sub("[số điện thoại đã ẩn]", value)
    for name in redactions:
        value = re.sub(
            rf"(?<!\w){re.escape(name)}(?!\w)",
            "người tham gia",
            value,
        )
    for name in case_insensitive_redactions:
        value = re.sub(
            rf"(?<!\w){re.escape(name)}(?!\w)",
            "người tham gia",
            value,
            flags=re.IGNORECASE,
        )
    return re.sub(r"\s+", " ", value).strip()


def split_long_piece(piece: str, max_chars: int) -> list[str]:
    if len(piece) <= max_chars:
        return [piece]
    clauses = [item.strip() for item in re.split(r"(?<=[,;:])\s+", piece) if item.strip()]
    if len(clauses) > 1:
        output: list[str] = []
        current = ""
        for clause in clauses:
            candidate = f"{current} {clause}".strip()
            if current and len(candidate) > max_chars:
                output.append(current)
                current = clause
            else:
                current = candidate
        if current:
            output.append(current)
        return [part for item in output for part in split_long_piece(item, max_chars)]

    words = piece.split()
    output = []
    current_words: list[str] = []
    for word in words:
        candidate = " ".join(current_words + [word])
        if current_words and len(candidate) > max_chars:
            output.append(" ".join(current_words))
            current_words = [word]
        else:
            current_words.append(word)
    if current_words:
        output.append(" ".join(current_words))
    return output


def semantic_chunks(text: str, min_chars: int, max_chars: int) -> list[str]:
    raw_sentences = [
        item.strip()
        for item in re.split(r"(?<=[.!?])\s+|\n+", text)
        if item.strip()
    ]
    pieces = [part for sentence in raw_sentences for part in split_long_piece(sentence, max_chars)]
    chunks: list[str] = []
    current = ""
    for piece in pieces:
        candidate = f"{current} {piece}".strip()
        if current and len(candidate) > max_chars:
            chunks.append(current)
            current = piece
        else:
            current = candidate
    if current:
        if chunks and len(current) < min_chars:
            chunks[-1] = f"{chunks[-1]} {current}".strip()
        else:
            chunks.append(current)
    return [chunk for chunk in chunks if len(chunk) >= min_chars]


def is_relevant(text: str) -> bool:
    value = text.lower()
    return any(term in value for term in RELEVANCE_TERMS)


def near_duplicate(candidate: str, accepted: list[str], threshold: float = 0.94) -> bool:
    candidate_norm = normalized(candidate)
    for existing in accepted:
        existing_norm = normalized(existing)
        if candidate_norm == existing_norm:
            return True
        if min(len(candidate_norm), len(existing_norm)) < 180:
            continue
        if SequenceMatcher(None, candidate_norm, existing_norm).ratio() >= threshold:
            return True
    return False


def extract_candidates(
    manifest: dict[str, Any],
    source_dir: Path,
    min_chars: int,
    max_chars: int,
) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    accepted_texts: list[str] = []
    redactions = [str(value) for value in manifest.get("redactions", [])]
    case_insensitive_redactions = [
        str(value) for value in manifest.get("case_insensitive_redactions", [])
    ]

    for source in manifest["sources"]:
        if source.get("decision") != "approved":
            continue
        if source.get("ingest_mode") == "preserve_case_studies":
            continue
        source_path = source_dir / source["temp_filename"]
        if not source_path.exists():
            raise RuntimeError(f"SOURCE_FILE_MISSING:{source['temp_filename']}")
        if sha256_file(source_path) != source["sha256"].upper():
            raise RuntimeError(f"SOURCE_CHECKSUM_MISMATCH:{source['temp_filename']}")
        lines = source_path.read_text(encoding="utf-8").splitlines()

        for section in source.get("sections", []):
            start = int(section["start_line"])
            end = int(section["end_line"])
            selected = [
                clean_line(line, redactions, case_insensitive_redactions)
                for line in lines[start - 1 : end]
            ]
            section_text = "\n".join(line for line in selected if line)
            for chunk_text in semantic_chunks(section_text, min_chars, max_chars):
                if not is_relevant(chunk_text) or near_duplicate(chunk_text, accepted_texts):
                    continue
                accepted_texts.append(chunk_text)
                output.append(
                    {
                        "text": chunk_text,
                        "source": source,
                        "section": section,
                        "location": f"lines {start}-{end}",
                    }
                )
    return output


def balanced_limit(candidates: list[dict[str, Any]], max_chunks: int) -> list[dict[str, Any]]:
    if len(candidates) <= max_chunks:
        return candidates
    queues: dict[str, deque[dict[str, Any]]] = defaultdict(deque)
    for candidate in candidates:
        queues[candidate["source"]["source_id"]].append(candidate)
    selected: list[dict[str, Any]] = []
    source_ids = list(queues)
    while len(selected) < max_chunks and any(queues.values()):
        for source_id in source_ids:
            if queues[source_id] and len(selected) < max_chunks:
                selected.append(queues[source_id].popleft())
    return selected


def build_candidate_records(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    per_source_counter: dict[str, int] = defaultdict(int)
    records = []
    for candidate in candidates:
        source = candidate["source"]
        section = candidate["section"]
        source_id = source["source_id"]
        per_source_counter[source_id] += 1
        chunk_id = f"{source_id[:8]}-{per_source_counter[source_id]:03d}"
        records.append(
            {
                "id": chunk_id,
                "metadata": {
                    "notebook_id": source["notebook_id"],
                    "source_id": source_id,
                    "source_title": source["source_title"],
                    "source_type": source["source_type"],
                    "title": section["title"],
                    "location": candidate["location"],
                    "abcde_step": section["abcde_step"],
                    "concept": section["concept"],
                    "chunk_id": chunk_id,
                    "citation": f"{source['source_title']} — {candidate['location']}",
                    "review_status": "approved",
                    "text": candidate["text"],
                },
            }
        )
    return records


def load_preserved_case_studies(
    legacy_kb_path: Path,
    case_library_path: Path,
    source_manifest: dict[str, Any],
) -> list[dict[str, Any]]:
    source = next(
        (
            item
            for item in source_manifest["sources"]
            if item.get("ingest_mode") == "preserve_case_studies"
            and item.get("decision") == "approved"
        ),
        None,
    )
    if not source:
        raise RuntimeError("CASE_STUDY_SOURCE_MANIFEST_MISSING")
    if not case_library_path.exists():
        raise RuntimeError("CASE_STUDY_LIBRARY_MISSING")
    if sha256_file(case_library_path) != source["sha256"].upper():
        raise RuntimeError("CASE_STUDY_LIBRARY_CHECKSUM_MISMATCH")
    if not legacy_kb_path.exists():
        raise RuntimeError("LEGACY_KB_MISSING_FOR_CASE_STUDIES")

    legacy_records = json.loads(legacy_kb_path.read_text(encoding="utf-8"))
    preserved = []
    for item in legacy_records if isinstance(legacy_records, list) else []:
        metadata = item.get("metadata") or {}
        if metadata.get("source_type") != "case_study":
            continue
        text = str(metadata.get("text") or "").strip()
        case_id = str(item.get("id") or metadata.get("source_id") or "").strip()
        if not case_id or not text:
            raise RuntimeError("CASE_STUDY_RECORD_INVALID")
        preserved.append(
            {
                "id": case_id,
                "metadata": {
                    "notebook_id": source["notebook_id"],
                    "source_id": source["source_id"],
                    "source_title": source["source_title"],
                    "source_type": "case_study",
                    "title": str(metadata.get("title") or case_id),
                    "location": case_id,
                    "abcde_step": "ABCDE",
                    "concept": "case_study",
                    "chunk_id": case_id,
                    "citation": f"{source['source_title']} - {case_id}",
                    "review_status": "approved",
                    "text": text,
                    "tier": metadata.get("tier", ""),
                },
            }
        )
    if len(preserved) != 18:
        raise RuntimeError(f"CASE_STUDY_COUNT_MISMATCH:{len(preserved)}!=18")
    return preserved


def duplicate_rate(records: list[dict[str, Any]]) -> float:
    duplicates = 0
    texts = [item["metadata"]["text"] for item in records]
    for index, text in enumerate(texts):
        if near_duplicate(text, texts[:index], threshold=0.92):
            duplicates += 1
    return duplicates / len(records) if records else 0.0


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temp_path.replace(path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, default=Path("data/sources/abcde_source_manifest.json"))
    parser.add_argument("--output", type=Path, default=Path("data/artifacts/knowledge_base_abcde.json"))
    parser.add_argument(
        "--output-manifest",
        type=Path,
        default=Path("data/artifacts/knowledge_base_abcde_manifest.json"),
    )
    parser.add_argument(
        "--preserve-case-studies-from",
        type=Path,
        default=Path("data/artifacts/knowledge_base_abcde.json"),
    )
    parser.add_argument(
        "--case-library",
        type=Path,
        default=Path("data/abcde_cases_library.md"),
    )
    parser.add_argument("--min-chunks", type=int, default=60)
    parser.add_argument("--max-chunks", type=int, default=120)
    parser.add_argument("--min-chars", type=int, default=220)
    parser.add_argument("--max-chars", type=int, default=620)
    parser.add_argument("--candidate-output", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    preserved_cases = load_preserved_case_studies(
        args.preserve_case_studies_from,
        args.case_library,
        manifest,
    )
    new_chunk_limit = args.max_chunks - len(preserved_cases)
    if new_chunk_limit < 1:
        raise RuntimeError(
            f"QUALITY_GATE_MAX_CHUNKS:{args.max_chunks}<={len(preserved_cases)}"
        )
    candidates = extract_candidates(manifest, args.source_dir, args.min_chars, args.max_chars)
    candidates = balanced_limit(candidates, new_chunk_limit)
    candidate_records = build_candidate_records(candidates)
    combined_candidates = candidate_records + preserved_cases
    source_ids = {
        item["metadata"]["source_id"]
        for item in combined_candidates
    }
    notebook_ids = {
        item["metadata"]["notebook_id"]
        for item in combined_candidates
        if item["metadata"]["notebook_id"] != "repo-local"
    }
    summary = {
        "candidate_chunks": len(combined_candidates),
        "new_notebook_chunks": len(candidates),
        "preserved_case_studies": len(preserved_cases),
        "source_ids": len(source_ids),
        "notebook_ids": len(notebook_ids),
    }
    print(json.dumps(summary, ensure_ascii=False))

    if len(combined_candidates) < args.min_chunks:
        raise RuntimeError(
            f"QUALITY_GATE_MIN_CHUNKS:{len(combined_candidates)}<{args.min_chunks}"
        )
    if len(combined_candidates) > args.max_chunks:
        raise RuntimeError(
            f"QUALITY_GATE_MAX_CHUNKS:{len(combined_candidates)}>{args.max_chunks}"
        )
    if len(source_ids) < 4:
        raise RuntimeError(f"QUALITY_GATE_SOURCE_DIVERSITY:{len(source_ids)}<4")
    if len(notebook_ids) < 3:
        raise RuntimeError(f"QUALITY_GATE_NOTEBOOK_DIVERSITY:{len(notebook_ids)}<3")
    if args.candidate_output:
        write_json(args.candidate_output, combined_candidates)
    if args.dry_run:
        return 0

    records = combined_candidates
    rate = duplicate_rate(records)
    if rate >= 0.05:
        raise RuntimeError(f"QUALITY_GATE_DUPLICATE_RATE:{rate:.4f}")

    write_json(args.output, records)
    kb_hash = sha256_file(args.output)
    artifact_manifest = {
        "version": "abcde-kb-20260721-v3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "retrieval_model": "local-tfidf-ngram-v1",
        "embedding_model": "none",
        "vector_dimensions": 0,
        "top_k": 3,
        "min_tfidf_score": 0.075,
        "min_corpus_coverage": 0.82,
        "chunk_count": len(records),
        "approved_chunk_count": len(records),
        "new_notebook_chunk_count": len(candidates),
        "preserved_case_study_count": len(preserved_cases),
        "source_count": len({item["metadata"]["source_id"] for item in records}),
        "notebook_count": len(
            {
                item["metadata"]["notebook_id"]
                for item in records
                if item["metadata"]["notebook_id"] != "repo-local"
            }
        ),
        "duplicate_rate": rate,
        "knowledge_base_sha256": kb_hash,
        "source_manifest_version": manifest["version"],
        "source_manifest_sha256": sha256_file(args.manifest),
        "raw_sources_committed": False,
        "external_corpus_exported": False,
        "unverified_legacy_book_chunks_included": False,
    }
    write_json(args.output_manifest, artifact_manifest)
    print(json.dumps(artifact_manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
