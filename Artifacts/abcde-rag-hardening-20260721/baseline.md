# Baseline ABCDE RAG trước production rollout

Thời điểm refresh: 2026-07-22, Asia/Bangkok.

Tài liệu này ghi trạng thái trước release. Mọi trạng thái production có thể thay đổi và phải được kiểm tra lại ngay trước thao tác Cấp độ 3.

## Routing evidence

| Trường | Giá trị |
| :--- | :--- |
| cwd | C:/tmp/dh4hn-abcde-rag-hardening-20260721 |
| resolved project | dh4hn-website |
| original path | C:/tmp/dh4hn-abcde-rag-hardening-20260721/Implementation Plan/260721-abcde-rag-production-hardening/plan.md |
| mirrored path | C:/tmp/dh4hn-abcde-rag-hardening-20260721/Artifacts/abcde-rag-hardening-20260721/baseline.md |
| mirror time | 2026-07-22 |
| reason | Lưu bằng chứng trước release trong branch cô lập, không ghi vào working tree main đang bẩn |

## Git và phạm vi

- VERIFIED: worktree cô lập tại C:/tmp/dh4hn-abcde-rag-hardening-20260721.
- VERIFIED: branch codex/abcde-rag-production-hardening-20260721.
- VERIFIED: base commit cd5554dc946ceec873804feb388cff70e834ca18.
- Không stage, commit, push hoặc sửa working tree main tại C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website.
- Chỉ tối đa hai commit và hai push trên branch ABCDE sau approval Cấp độ 3 ngay trước lệnh.

## Vercel production trước release

Refresh bằng vercel inspect ngày 2026-07-22:

- VERIFIED alias: https://delivering-happiness.vercel.app
- VERIFIED deployment ID: dpl_HsmfZ5e85f7gUeidDNqB8QTVGrSX
- VERIFIED deployment URL: https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app
- VERIFIED target/status: production / Ready
- VERIFIED function hiện hành:
  - api/chat-abcde: 6.35 KB
  - api/chat-abcde-rag: 363.74 KB
  - api/sepay-dh: 2.34 KB

URL deployment trên là đích rollback trước release. Không dùng alias production làm tham số rollback.

## Knowledge base trước release

Nguồn: data/artifacts/knowledge_base_abcde.json tại base branch.

| Chỉ số | Giá trị |
| :--- | :--- |
| Kích thước | 1,430,521 bytes |
| Tổng chunk | 22 |
| Vector dimensions | 3,072 |
| Case study | 18 |
| Legacy book chunks | 4 |
| Text payload | 15,131 ký tự |
| SHA-256 backup | 71B1ADF82820B14068CD7FDA6FF8A1BDC312AC5B964D2DCD1D92AF4CFE3FD08B |

Backup VERIFIED tại C:/tmp/abcde-kb-backup-20260721/knowledge_base_abcde.before.json.

Bốn legacy book chunks có citation trang Seligman chưa được xác minh, nên không được đưa vào KB mới.

## Corpus candidate đã review

Nguồn tạm: C:/tmp/abcde-kb-candidates-20260721.json.

- VERIFIED tổng 79 records.
- VERIFIED 61 chunk bài giảng mới đã ẩn danh.
- VERIFIED 18 case study được bảo toàn cùng vector cũ để trang practice-abcde không rỗng.
- VERIFIED 6 source IDs và 3 NotebookLM.
- VERIFIED candidate SHA-256: A1BDD72A3E41478659ECD12358FE5FA3B9175DDC10A67D2A690E233BD22F2DF3.
- VERIFIED raw NotebookLM transcript chỉ nằm tại C:/tmp/abcde-nlm-sources-20260721 và không thuộc commit scope.
- UNVERIFIED vector mới: 61 chunk bài giảng chưa được gửi tới Gemini Embedding API.

Notebook/source inventory đã đọc ngày 2026-07-21:

| Notebook | Notebook ID | Số source |
| :--- | :--- | :--- |
| DH7 | e9f7d3f6-036a-4c40-8580-66d688c7642f | 20 |
| DHM3 | 1601679f-ca32-40bb-bb8c-aaedc4e50906 | 15 |
| DHM4 | 83c60631-fcfc-4138-b96a-bc99826be158 | 16 |
| DH8 | 6a4d1fae-d0e6-4934-94f5-34d916c929f7 | 3 |

Ba audio DH8 bị rejected vì là nội dung họp chuẩn bị chương trình, không phải bài giảng ABCDE.

## Apps Script trước release

Refresh bằng clasp deployments ngày 2026-07-22:

- VERIFIED script target: 1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS.
- VERIFIED hiện có 8 deployments.
- VERIFIED version 69 đang được deployment AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA dùng cho Program Interest.
- VERIFIED bản clone read-only version 69 tại C:/tmp/dh4hn-gas-v69-inspect-20260721 có ABCDE_Data, ChatVersion và sendAbcdeEmailReport_.
- Release ABCDE phải tạo deployment mới từ version 69; không clasp push và không cập nhật deployment DHM8/DHM9.

## Biến môi trường

Các tên biến production dự kiến thay đổi hoặc đối chiếu:

- ABCDE_RAG_ENABLED
- DHM_PASSCODE
- ABCDE_APPS_SCRIPT_URL
- RAG_TOP_K
- RAG_MIN_SCORE
- GEMINI_API_KEY
- GEMINI_MODEL
- DHM8_APPS_SCRIPT_TOKEN
- UPSTASH_VECTOR_REST_URL
- UPSTASH_VECTOR_REST_TOKEN

Không ghi secret value trong artifact. Snapshot giá trị cũ phải lưu cục bộ ngoài repo ngay trước mutation; trạng thái giá trị hiện tại là UNVERIFIED trong baseline này.

## Rollback và cổng dừng

- Tắt Beta bằng ABCDE_RAG_ENABLED=false nếu Stable vẫn hoạt động.
- Rollback Vercel về https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app nếu release lỗi.
- Không xóa Apps Script deployment hoặc dòng UAT tự động.
- Dừng nếu target project, Script ID, version 69, alias production, corpus checksum hoặc file allowlist khác baseline.
- Commit, push, Apps Script deploy, env mutation, Vercel deploy, Sheet submit và Gmail send đều cần approval Cấp độ 3 cho lệnh cụ thể ngay trước khi chạy.
