# Walkthrough - Kết quả Lập trình & Kiểm thử Lọc Danh sách Học viên PENDING DHM9

Tài liệu này tổng hợp kết quả xây dựng và kiểm thử chạy thử (`dry-run`) cho công cụ lọc danh sách học viên PENDING nhận mail nhắc thanh toán phân chặng 3 đợt cho **DHM9 Hà Nội**.

## Các công việc đã hoàn tất

1. **Lập trình Script Lọc 3 Chặng (`filter_pending_recipients.py`)**:
   - Tệp tin: [filter_pending_recipients.py](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/scripts/filter_pending_recipients.py)
   - Tích hợp 3 quy tắc phân chặng chính xác theo chỉ đạo của Sếp:
     - **Chặng 1 (`REMINDER_1`)**: Đăng ký > 24 tiếng (`hours >= 24h`).
     - **Chặng 2 (`REMINDER_2`)**: Đăng ký > 3 ngày (`hours >= 72h`).
     - **Chặng 3 (`REMINDER_FINAL`)**: Kích hoạt khi còn **1 tuần trước sự kiện** (từ 05/09/2026) **HOẶC** khi số chỗ khả dụng còn **< 5 slot** (`paidCount >= 35 / 40`).
   - Tự động loại trừ các học viên đã có `Job Key` trong `DHM9_Email_Outbox` hoặc học viên đã chuyển trạng thái `PAID` / `CANCELED`.

2. **Khởi tạo File Báo cáo Kiểm toán (`Audit Trail Dispatch`)**:
   - File JSON lưu vết kiểm toán: [dhm9_pending_recipients_audit.json](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/email_dispatches/dhm9_pending_recipients_audit.json)

---

## Kết quả Kiểm thử Chạy thử (`Dry-run Verification Results`)

Kết quả phân loại mẫu kiểm thử trên 4 hồ sơ học viên:

```json
{
  "dhm9_capacity": 40,
  "paid_count": 1,
  "available_slots": 39,
  "stages": {
    "REMINDER_1": [
      {
        "uuid": "student-uuid-001",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "hours_since_registration": 52.0
      }
    ],
    "REMINDER_2": [
      {
        "uuid": "student-uuid-002",
        "name": "Trần Thị B",
        "email": "tranthib@example.com",
        "hours_since_registration": 100.0
      }
    ],
    "REMINDER_FINAL": []
  },
  "skipped": [
    {
      "uuid": "student-uuid-003",
      "reason": "NON_PENDING_STATUS (PAID)"
    },
    {
      "uuid": "student-uuid-004",
      "reason": "RECENTLY_REGISTERED (2.0h < 24h)"
    }
  ]
}
```

### Kết luận Kiểm chứng:
- ✅ **Phân chặng chính xác**: Học viên Nguyễn Văn A (đăng ký 52h) tự động xếp vào `REMINDER_1`; Học viên Trần Thị B (đăng ký 100h) tự động xếp vào `REMINDER_2`.
- ✅ **Chống gửi nhầm học viên đã trả tiền**: Học viên Lê Văn C (`PAID`) bị loại trừ hoàn toàn với lý do `NON_PENDING_STATUS (PAID)`.
- ✅ **Bảo vệ học viên mới đăng ký**: Học viên Phạm Thị D (mới đăng ký 2h) bị loại trừ với lý do `RECENTLY_REGISTERED (2.0h < 24h)`.
