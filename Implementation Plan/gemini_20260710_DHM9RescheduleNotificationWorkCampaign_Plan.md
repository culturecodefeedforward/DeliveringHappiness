# Kế hoạch triển khai: Chiến dịch gửi Email thông báo dời lịch DHM9 Hà Nội (mcp-work)

Kế hoạch này chi tiết hóa việc thực hiện gửi email thông báo dời lịch học DHM9 Hà Nội cho toàn bộ 29 học viên đăng ký trong sheet `dhm9_data` thông qua tài khoản Google Work (`workspace-mcp-work`), phân nhánh nội dung theo trạng thái thanh toán và báo cáo kết quả về cho Ban tổ chức (BTC).

## User Review Required

> [!IMPORTANT]
> **Ranh giới phê duyệt (Approval Boundary)**:
> Đây là chiến dịch gửi email hàng loạt tới **người dùng thật (học viên đăng ký)**. Bắt buộc phải được sếp phê duyệt kế hoạch này bằng văn bản trước khi thực hiện.
> 
> Chiến dịch sẽ chạy qua tài khoản Google công việc của sếp (`vu.hoang@culturecode...` hoặc account được cấu hình trên `workspace-mcp-work`).

## Danh sách người nhận (bóc tách từ sheet `dhm9_data`)

Tổng số: **29 học viên** (không tính dòng tiêu đề đầu tiên và bỏ qua các dòng test trùng lặp không hợp lệ nếu có). Trong đó phân chia thành 2 nhóm nội dung:

### 🟢 Nhóm 1: Học viên đã thanh toán (PAID) - 17 người
*Nhận template đầy đủ (có Box hoàn phí màu vàng cam + Câu hẹn gặp)*:
1.  Nguyễn Thị Thu Hương (`thuhuongvp0331@gmail.com`)
2.  Nguyễn Thị Thanh Nga (`nga.nguyen@mht.masangroup.com`)
3.  Dương Thị Hậu (`hau.duong@mht.masangroup.com`)
4.  Nguyễn Hà Giang (`giangnguyenha0905@gmail.com`)
5.  Tạ Thị Hà Thu (`hathu@gofood.vn`)
6.  Hoàng Ngọc Vi Anh (`ngocanh92.ftu@gmail.com`)
7.  Võ Diệu Thu (`thu.vo@mht.masangroup.com`)
8.  Âu Thị Đồng (`audong.khtn@gmail.com`)
9.  Trần Khánh Linh (`trankhanhlinh.2808@gmail.com`)
10. Bàn Thị Hợp (`hopthuong2903@gmail.com`)
11. Vũ Thị Huê (`vuthihue27@gmail.com`)
12. Đỗ Bá Tuấn (`Tuan.do1@mht.masangroup.com`)
13. Bùi Phượng (`Phuong.btb@tamsonfashion.com`)
14. Nguyễn Hồng Minh (`nguyenhongminh.021@gmail.com`)
15. Hoàng Khánh Ly (`lyole96@gmail.com`)
16. Nguyễn Bích Thủy (`mamnonsea2023@gmail.com`)
17. Đoàn Thị Thanh Vân (`doanthanhvan1909@gmail.com`)

### 🟡 Nhóm 2: Học viên chưa thanh toán (PENDING) - 12 người
*Nhận template lược bỏ Box hoàn phí màu vàng cam + Giữ câu hẹn gặp*:
1.  Nguyễn Vân Anh (`nguyenvananh.sptak32@gmail.com`)
2.  Hoa Trần (`hoatran1183@gmail.com`)
3.  Ly Ngoc Anh (`lna.temp@gmail.com`)
4.  Hong Duong (`parentslearn2012@gmail.com`)
5.  Nguyen Kien (`ngayemradi_239@yahoo.com`)
6.  Vu test (`vuhoang2708@gmail.com`)
7.  Codex Live Test DHM9 20260707 (`vuhoang2708+codexdhm9test202607072249@gmail.com`)
8.  Vu tes (`vuhoang2708@gmail.com`)
9.  Pham Binh Ha (`ha.hapb@gmail.com`)
10. Trần Thị Ngọc (`ngoccgv@gmail.com`)
11. Nguyễn Văn Đại (`dai.nguyen@mht.masangroup.com`)
12. test (`vuhoang2708@gmail.com`)

## Chi tiết hai phiên bản email gửi đi

*   **Tiêu đề (Subject)**: `[Delivering Happiness Masterclass] Thông báo thay đổi lịch tổ chức sự kiện DHM9`
*   **Người gửi**: Tài khoản Google Work thông qua MCP (`workspace-mcp-work`).
*   **Chữ ký footer**: `Đội ngũ CultureCode` kèm logo.
*   **Cấu trúc nội dung**:
    *   **Mẫu PAID**: Có chứa Box màu vàng cam:
        `* Chúng tôi rất hy vọng sự thay đổi này không ảnh hưởng nhiều đến kế hoạch của Anh/Chị. (Trường hợp lịch học mới không phù hợp, Anh/Chị vui lòng phản hồi email này kèm số tài khoản để CultureCode hoàn trả lại 100% chi phí hậu cần).`
    *   **Mẫu PENDING**: Bỏ hoàn toàn Box màu vàng cam này.
    *   **Cả hai mẫu**: Đều có câu hẹn gặp ở cuối:
        `Hẹn gặp lại Anh/Chị tại Delivering Happiness Masterclass (DHM9) Hà Nội!`

## Kịch bản thực hiện & Báo cáo kết quả

1.  **Tạo Script tự động hóa chiến dịch**:
    *   Tạo file Python `scratch/dhm9_reschedule_campaign.py` thực hiện đọc dữ liệu trực tiếp từ sheet `dhm9_data`, tự động phân loại `PAID` và `PENDING` theo từng dòng, sinh nội dung email cá nhân hóa (thay `{TEN_NGUOI_NHAN}` tương ứng), và gửi qua API của `workspace-mcp-work`.
2.  **Chạy thử nghiệm nghiệm thu (UAT Run)**:
    *   Gửi 2 email UAT thực tế (1 PAID và 1 PENDING) cho sếp tại `vuhoang2708@gmail.com` trước khi chạy hàng loạt.
3.  **Chạy chiến dịch thật**:
    *   Gửi email cho 29 người dùng thực tế.
    *   Lưu lịch sử gửi và mã Message ID của từng người.
4.  **Báo cáo kết quả**:
    *   Gửi 1 email báo cáo tổng kết chi tiết (bao gồm danh sách những người đã gửi thành công và thất bại) cho 3 người BTC:
        - Vũ (`vuhoang2708@gmail.com`)
        - Châu (`chauhm71@gmail.com`)
        - Hoàn (`hoanhn.edu.vn@gmail.com`)

## Kế hoạch kiểm chứng (Verification Plan)

### Automated Tests
- Chạy script python gửi test UAT cục bộ cho sếp duyệt:
  `python scratch/dhm9_reschedule_campaign.py --dry-run` hoặc gửi trực tiếp 2 mẫu test.
