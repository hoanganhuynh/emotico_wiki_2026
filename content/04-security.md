# Bảo mật & Tuân thủ

## Khung pháp lý

Dữ liệu tâm lý học sinh là loại dữ liệu **cực kỳ nhạy cảm**. Một vết rò rỉ nhỏ có thể dẫn đến bạo lực học đường, dán nhãn tiêu cực, hoặc phá hủy sự tin tưởng của học sinh vào hệ thống.

Emotico tuân thủ nghiêm ngặt:

| Tiêu chuẩn | Phạm vi |
|---|---|
| **Nghị định 13/2023/NĐ-CP** | Bảo vệ dữ liệu cá nhân tại Việt Nam |
| **Luật Trẻ em Việt Nam** | Quy định đặc biệt cho người dùng dưới 18 tuổi |
| **ISO/IEC 27001** | Quản lý an toàn thông tin |
| **ISO/IEC 27701** | Mở rộng ISO 27001 cho bảo vệ dữ liệu cá nhân |

**Phân vai trách nhiệm:**
- **Trường học** quyết định mục đích và cách sử dụng dữ liệu
- **Emotico** chỉ xử lý dữ liệu theo đúng chỉ định của trường
- Hợp đồng triển khai bắt buộc có đánh giá tác động bảo vệ dữ liệu đính kèm

**Quy trình đồng ý:**
- Cần xác nhận từ cả **phụ huynh** lẫn **học sinh** trước khi sử dụng
- Học sinh dưới 18 tuổi bắt buộc có phụ huynh xác nhận

---

## Bảo vệ dữ liệu

| Điểm cần bảo vệ | Cách thức |
|---|---|
| **Dữ liệu truyền qua mạng** | Mã hóa toàn bộ, chống nghe lén |
| **Dữ liệu lưu trữ** | Mã hóa khi lưu tại máy chủ |
| **Khóa mã hóa** | Tự động thay mới mỗi 30 ngày |
| **Truy cập Dashboard trường** | Xác thực 2 lớp, chỉ cho phép từ mạng nội bộ trường |
| **Nguy cơ từ nội bộ** | Ẩn danh hóa dữ liệu — xem phần dưới |

---

## Ẩn danh hóa dữ liệu

Đây là lớp bảo vệ quan trọng nhất của Emotico:

- **Hệ thống Emotico** chỉ thấy mã số ẩn danh, không biết tên thật học sinh
- **Bảng tra cứu mã số → tên thật** được lưu riêng tại máy chủ cục bộ trong phòng Tham vấn học đường của trường — không kết nối internet
- Chỉ **tư vấn viên được ủy quyền** tại trường mới có thể tra cứu tên thật
- Chỉ kích hoạt khi có cảnh báo nguy cơ sức khỏe tâm thần nghiêm trọng

**Kết quả:** Ngay cả khi hệ thống Emotico bị tấn công từ bên ngoài, không có tên thật nào của học sinh bị lộ.
