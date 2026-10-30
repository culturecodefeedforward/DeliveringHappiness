# DHM9 Pending Email Campaign Walkthrough

## Tổng quan (Overview)
Hoàn tất việc triển khai và gửi tự động thành công **10 email nhắc nợ (PENDING)** cho học viên khóa DHM9 Hà Nội. 

Toàn bộ thông tin được cập nhật theo nguồn dữ liệu LIVE thời gian thực trên CRM Google Sheet, áp dụng mẫu Email cao cấp (chuẩn CultureCode Team) và hệ thống tạo mã thanh toán cá nhân hoá tự động.

## Cập nhật dữ liệu Live (Live Data Synchronization)
Dữ liệu được trích xuất hoàn toàn tự động trực tiếp từ:
- Nguồn: **DH4HN CRM Leads - Landing Page** (Google Sheet)
- Cập nhật Real-time:
  - 1 học viên từ danh sách 7 người cũ đã đóng tiền và được tự động gạch tên (Nguyễn Vân Anh).
  - Bổ sung 4 học viên đăng ký mới chưa thanh toán.
  - Tổng số học viên chốt gửi: **10 Học viên**.

## Thay thế thương hiệu (Rebranding)
- Cập nhật toàn bộ các từ khóa: `Ban Tổ chức (BTC)`, `BTC`, `Ban tổ chức` thành **`CultureCode Team`** trên 3 mẫu email:
  - `dhm8_paid_email.html`
  - `dhm8_pending_email.html`
  - `dhm9_pending_email.html`

## Kết quả gửi Email (Live Dispatch Results)
Tất cả 10 học viên đã được gửi email thành công với mã thanh toán chuẩn (DHM9 + 9 số cuối SĐT):

| STT | Họ và Tên | Mã Thanh Toán | Trạng thái |
|---|---|---|---|
| 1 | Hoa Trần | DHM9985557923 | [x] SUCCESS (MsgID: 19fa6f05b1537d52) |
| 2 | Ly Ngoc Anh | DHM9983081176 | [x] SUCCESS (MsgID: 19fa6f062694169b) |
| 3 | Hong Duong | DHM9912254650 | [x] SUCCESS (MsgID: 19fa6f06c0edd74f) |
| 4 | Nguyen Kien | DHM9987115600 | [x] SUCCESS (MsgID: 19fa6f0755a6f7ac) |
| 5 | Trần Thị Ngọc | DHM9904522485 | [x] SUCCESS (MsgID: 19fa6f07e552548d) |
| 6 | Nguyễn Văn Đại | DHM9987566984 | [x] SUCCESS (MsgID: 19fa6f08749d0e49) |
| 7 | Ngọc Anh Đinh | DHM9983725791 | [x] SUCCESS (MsgID: 19fa6f08ef392553) |
| 8 | Nguyễn Thị Thanh Huyền | DHM9988079798 | [x] SUCCESS (MsgID: 19fa6f098c695237) |
| 9 | Nguyễn Thanh Xuân | DHM9967369742 | [x] SUCCESS (MsgID: 19fa6f0a2dc63d12) |
| 10 | Nguyễn Quý Khoa | DHM9961695771 | [x] SUCCESS (MsgID: 19fa6f0aa0a554f0) |

> [!NOTE]
> Báo cáo tổng kết chi tiết chiến dịch đã được tạo dưới định dạng HTML sang trọng và gửi về hòm thư của 3 thành viên Ban tổ chức: `vuhoang2708@gmail.com`, `chauhm71@gmail.com`, và `hoanhn.edu.vn@gmail.com`.

## Cấu hình MCP & Sender Account
- **Tài khoản Sender thực tế**: `vuhoang2708@gmail.com`
- Bỏ qua cấu hình alias MCP cũ bị lỗi và áp dụng module chuẩn `WorkspaceMcp` từ bộ core skills, giúp tương tác thẳng với MCP server qua giao thức JSON-RPC, đảm bảo ổn định đường truyền 100%.

## Kết luận (Conclusion)
Chiến dịch hoàn tất xuất sắc theo đúng Rule 6 (Sử dụng dữ liệu thực) và Rule 2 (Chuẩn Format).
Đóng quy trình PENDING DHM9.
