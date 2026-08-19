# School Dashboard & Quản trị Trường học

Tài liệu này mô tả toàn bộ spec dành cho quản trị viên trường học (School Admin) sử dụng Emotico theo mô hình B2B2C.

---

## Tổng quan

School Dashboard cho phép nhà trường:
- Nhập danh sách học sinh theo lô (Bulk Import)
- Theo dõi trạng thái kích hoạt tài khoản
- Xem báo cáo ẩn danh tổng hợp
- Quản lý vòng đời tài khoản học sinh (onboarding → offboarding)

---

## Bulk Import — Nhập học sinh theo lô

### 3 Bước thực hiện

```
Bước 1: Preview Buffer
  └─ Admin upload file (CSV/Excel)
  └─ Hệ thống parse và hiển thị preview toàn bộ danh sách
  └─ Highlight lỗi: trùng lặp, thiếu trường bắt buộc, sai định dạng

Bước 2: Admin Confirm
  └─ Admin review preview
  └─ Xác nhận để đẩy lên hệ thống

Bước 3: PENDING_ACTIVATION
  └─ Tài khoản được tạo với trạng thái PENDING_ACTIVATION
  └─ Học sinh chưa thể đăng nhập cho đến khi hoàn tất kích hoạt
```

---

## Kích hoạt Tài khoản Học sinh — 2 Kịch bản

### Kịch bản A — Email trường

1. Học sinh nhận email từ địa chỉ email trường (`@truong.edu.vn`)
2. Email chứa link kích hoạt một lần (token hết hạn sau 72 giờ)
3. Học sinh click link → đặt mật khẩu → tài khoản chuyển sang `ACTIVE`

### Kịch bản B — Số điện thoại hoặc Mã số học sinh (MSHS) + OTP

1. Học sinh nhập MSHS hoặc số điện thoại đã được admin đăng ký
2. Hệ thống gửi OTP về SĐT (SMS) hoặc hiển thị qua màn hình admin
3. Học sinh nhập OTP → đặt mật khẩu → tài khoản chuyển sang `ACTIVE`

> Trường có thể chọn một hoặc cả hai kịch bản tùy theo hạ tầng hiện có.

---

## Offboarding — Học sinh rời trường

Khi admin xóa hoặc chuyển trạng thái học sinh ra khỏi danh sách trường:

| Hạng mục | Xử lý |
|---|---|
| Trạng thái tài khoản | `CONVERTED_TO_PERSONAL` — chuyển sang tài khoản cá nhân miễn phí |
| Dữ liệu cá nhân | Gửi bản export về email học sinh (hoặc phụ huynh) |
| Dữ liệu ẩn danh | Giữ lại trong hệ thống để phục vụ báo cáo tổng hợp của trường |
| Quyền truy cập premium | Mất quyền premium do trường cấp; chuyển về gói Free |

---

## Slot Lock Rule — Quy tắc khóa slot

- **Slot** là đơn vị tài khoản học sinh mà trường đã mua theo gói.
- Một khi slot đã được gán cho học sinh và học kỳ đã bắt đầu:
  - **Không hoàn tiền** nếu admin xóa học sinh giữa kỳ
  - Slot được giải phóng lại vào đầu kỳ tiếp theo để gán cho học sinh mới

> Mục đích: ngăn việc xoay vòng tài khoản (account churning) và bảo đảm tính toàn vẹn dữ liệu theo kỳ học.

---

## Mandatory Audit Log — Nhật ký bắt buộc

Mọi thao tác **xóa tài khoản** học sinh đều phải được ghi nhật ký:

- **Bắt buộc**: Admin nhập lý do xóa (text field, tối thiểu 10 ký tự)
- Nhật ký lưu: timestamp · admin ID · học sinh ID (đã hash) · lý do
- Nhật ký không thể sửa hoặc xóa sau khi ghi
- Dữ liệu nhật ký có thể xuất theo yêu cầu kiểm toán

---

## Mass Deletion Friction — Giới hạn xóa hàng loạt

Để ngăn việc xóa nhầm hoặc xóa trái phép số lượng lớn:

| Số lượng | Cơ chế |
|---|---|
| ≤ 50 học sinh | Admin tự thực hiện trong Dashboard |
| > 50 học sinh | **Phải liên hệ đội hỗ trợ Emotico** để xử lý thủ công có kiểm tra |

> Giới hạn này áp dụng cho mỗi phiên thao tác (session), không phải mỗi ngày.

---

## Trạng thái tài khoản học sinh

```
PENDING_ACTIVATION  ←  Sau Bulk Import, chờ học sinh kích hoạt
       │
       ▼
    ACTIVE          ←  Đã kích hoạt, đang sử dụng
       │
       ▼
CONVERTED_TO_PERSONAL  ←  Rời trường (offboarding)
       │
       ▼
  DEACTIVATED       ←  Admin xóa tài khoản (có audit log bắt buộc)
```

---

## Quyền hạn Admin Trường

| Quyền | Mô tả |
|---|---|
| Bulk Import | Upload và xác nhận danh sách học sinh |
| Xem báo cáo | Xem báo cáo ẩn danh tổng hợp toàn trường |
| Kích hoạt / Vô hiệu hóa | Thay đổi trạng thái tài khoản từng học sinh |
| Xóa tài khoản | Kèm audit log bắt buộc |
| Export dữ liệu | Xuất báo cáo CSV cho mục đích nội bộ trường |

> Admin trường **không thể** xem dữ liệu check-in cá nhân của học sinh. Chỉ xem số liệu ẩn danh tổng hợp.

---

## School Dashboard (EN)

### Bulk Import — 3-Step Flow

1. **Preview Buffer**: Admin uploads CSV/Excel → system parses and previews the full list, highlighting errors (duplicates, missing fields, format issues)
2. **Admin Confirm**: Admin reviews preview and confirms submission
3. **PENDING_ACTIVATION**: Accounts are created but inactive until students complete activation

### Student Activation — 2 Scenarios

**Scenario A — School Email**: Student receives an activation link via school email address (expires in 72 hours).

**Scenario B — Phone / Student ID + OTP**: Student enters their registered student ID or phone number, receives OTP, sets password.

### Offboarding

When a student leaves the school:

| Data Type | Handling |
|---|---|
| Account status | Converted to `CONVERTED_TO_PERSONAL` (free tier) |
| Personal data | Exported and sent to student/guardian email |
| Anonymous data | Retained for school aggregate reporting |
| Premium access | Revoked; account downgraded to Free |

### Slot Lock Rule

Slots purchased by the school are **non-refundable** if a student is removed mid-semester. Slots are released at the start of the next term.

### Mandatory Audit Log

Every account deletion requires the admin to enter a reason (minimum 10 characters). Logs are immutable and exportable for auditing.

### Mass Deletion Friction

| Quantity | Mechanism |
|---|---|
| ≤ 50 students | Admin can act directly in Dashboard |
| > 50 students | Must contact Emotico support team for supervised processing |

### Student Account States

| State | Meaning |
|---|---|
| `PENDING_ACTIVATION` | Created via Bulk Import, awaiting student activation |
| `ACTIVE` | Activated and in use |
| `CONVERTED_TO_PERSONAL` | Student has left the school |
| `DEACTIVATED` | Deleted by admin (audit log required) |
