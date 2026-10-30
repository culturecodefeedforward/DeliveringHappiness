# Báo cáo go-live và UAT ABCDE RAG Beta - 2026-07-21

## Kết luận

`VERIFIED Live done` cho phạm vi Vercel production và luồng chat ABCDE RAG Beta không ghi dữ liệu.

- Production URL: `https://delivering-happiness.vercel.app`
- Deployment mới: `dpl_HsmfZ5e85f7gUeidDNqB8QTVGrSX`
- Deployment URL: `https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app`
- Deployment trước để quay lui: `https://delivering-happiness-3k18cjz44-vuhoang2708s-projects.vercel.app`
- Thời điểm triển khai: 2026-07-21 14:09 +07:00

## Sự cố phát hiện và xử lý

- `VERIFIED FAILED` trước triển khai: endpoint RAG tồn tại nhưng STEP_D trả `citations=[]`.
- `VERIFIED` nguyên nhân: Vercel runtime log ghi `Local knowledge base file not found`; function cũ chỉ 6,67 KB.
- `VERIFIED` cách xử lý: triển khai từ gói sạch 56 file runtime, không có `node_modules` hoặc `package.json`; thêm `includeFiles: data/artifacts/knowledge_base_abcde.json` trong `vercel.json` của gói tạm.
- `VERIFIED` sau triển khai: function RAG có kích thước 363,74 KB theo Vercel inspect; log có `[RAG Audit] Citations used...` và không còn cảnh báo thiếu KB.

Gói tạm: `C:\Users\vu.hoang\.gemini\antigravity\scratch\_deploy_tmp\dh4hn_abcde_rag_20260721_140844`

## Ma trận kiểm chứng bề mặt

| Bề mặt kiểm chứng | Phương pháp | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| Local files | `node --check`; đọc KB | API hợp lệ; KB có vector | `VERIFIED`: 22 chunk, 1.430.521 byte, vector 3.072 chiều |
| Vercel deployment | `vercel deploy`, `vercel inspect` | Deployment READY và giữ alias production | `VERIFIED`: READY, alias đúng |
| Apps Script deployment | Không thực hiện `clasp push` | Không thay đổi GAS/Sheet trong lượt này | `UNVERIFIED / OUT OF SCOPE` |
| Public frontend URLs | HTTP GET theo redirect | Sáu URL cốt lõi và Program Interest trả 200 | `VERIFIED`: 7/7 HTTP 200 |
| Stable API | POST `verify_passcode` | `200 {"success":true}` | `VERIFIED` |
| RAG API | POST STEP_D với câu tự nhiên | Có reply, giữ STEP_D, citation không rỗng | `VERIFIED`: 200, 2 citation |
| Browser desktop | Agent-browser 1440x900 | Chọn Beta, gửi chat qua endpoint RAG, không lỗi UI/console | `VERIFIED` |
| Browser mobile | Agent-browser 390x844 | Modal và hai thẻ phiên bản không tràn/che, chọn Beta được | `VERIFIED` |
| Kết luận | Đối chiếu các bề mặt trong phạm vi | Không còn lỗi đóng gói KB; Stable và Beta hoạt động | `VERIFIED completed` |

## HTTP probe production

| URL yêu cầu | URL hiệu lực | Kết quả |
|---|---|---|
| `/` | `/` | 200, 16.514 byte |
| `/assessment.html` | `/assessment` | 200, 5.171 byte |
| `/register.html` | `/register` | 200, 23.759 byte |
| `/register_direct.html` | `/register_direct` | 200, 29.746 byte |
| `/register-test.html` | `/register-test` | 200, 31.978 byte |
| `/dh8/` | `/dh8/` | 200, 33.937 byte |
| `/program-interest.html` | `/program-interest` | 200, 32.974 byte |

## API RAG production

Test case: STEP_D với câu `Sếp bất công và cố tình làm hỏng cuối tuần của tôi`.

- Timestamp: `2026-07-21T14:15:45.8024490+07:00`
- Status: `200`
- `success`: `true`
- `nextState`: `STEP_D`
- Citation count: `2`
- Citations: `Slide Thực tế`; `Thực tế — Thực tế`
- Observed: phản hồi hỏi lại liệu có bằng chứng sếp cố tình nhắm vào người học hay có thể là áp lực bất khả kháng từ cấp trên.

## Bằng chứng trình duyệt

### Desktop 1440x900

- URL: `https://delivering-happiness.vercel.app/`
- Thời gian: 2026-07-21, khoảng 14:12-14:13 +07:00
- Test case: mở chat, nhập `DHM8`, xác minh hai phiên bản, chọn RAG Beta, bắt đầu, gửi một mô tả STEP_A.
- Expected: radio Beta được chọn; request đi tới `/api/chat-abcde-rag`; có phản hồi; không lỗi console/page.
- Observed: radio Beta chuyển đúng; network ghi `POST /api/chat-abcde-rag 200`; có phản hồi; console và page errors trống.
- Screenshots:
  - `UAT/abcde_rag_live_20260721_desktop_version_selector.png`
  - `UAT/abcde_rag_live_20260721_desktop_beta_selected.png`
  - `UAT/abcde_rag_live_20260721_desktop_beta_reply.png`

### Mobile 390x844

- URL: `https://delivering-happiness.vercel.app/`
- Thời gian: 2026-07-21, khoảng 14:14 +07:00
- Test case: mở chat, nhập `DHM8`, xem bộ chọn phiên bản, chọn RAG Beta.
- Expected: nội dung không tràn/che; hai thẻ và nút bắt đầu dùng được.
- Observed: nội dung nằm trong viewport; chữ xuống dòng hợp lý; radio Beta đổi sang checked; console và page errors trống.
- Screenshots:
  - `UAT/abcde_rag_live_20260721_mobile_version_selector.png`
  - `UAT/abcde_rag_live_20260721_mobile_beta_selected.png`

## Phạm vi không kiểm tra

- Không submit biểu mẫu nhận báo cáo; không ghi Google Sheet; không kiểm tra email tự động của chatbox.
- Không `clasp push`; không triển khai Google Apps Script; không kiểm tra cột `ChatVersion` trên CRM.
- Không chuyển kill switch sang `false` trên production vì thao tác đó sẽ cố ý làm gián đoạn Beta.

## Quay lui

Nếu phát sinh lỗi: đặt `ABCDE_RAG_ENABLED=false` hoặc chạy `vercel rollback https://delivering-happiness-3k18cjz44-vuhoang2708s-projects.vercel.app`.

## Tác động tài liệu và Git

- Docs impact: không đổi tài liệu runtime vì không sửa code nghiệp vụ trong repo; bổ sung phụ lục thực thi và báo cáo UAT.
- Không commit, không push Git trong lượt này.
- Working tree đã bẩn từ nhiều luồng khác; chỉ các artifact có tiền tố `abcde_rag_live_20260721` và hai file báo cáo/kế hoạch trong lượt này thuộc phạm vi Codex.

## Gmail báo cáo

- Thời điểm gửi: 2026-07-21 14:33 +07:00.
- Tài khoản gửi: `vuhoang2708@gmail.com`.
- Người nhận: `vuhoang2708@gmail.com`.
- Tiêu đề: `[DH4HN] Báo cáo go-live ABCDE RAG Beta - 2026-07-21`.
- File đính kèm: báo cáo UAT, ảnh desktop Beta reply, ảnh mobile Beta selected.
- Message ID: `19f8397c1061320b`.
- Verification query: `to:vuhoang2708@gmail.com subject:"[DH4HN] Báo cáo go-live ABCDE RAG Beta - 2026-07-21" newer_than:1d`.
- Trạng thái: `VERIFIED delivery`.
