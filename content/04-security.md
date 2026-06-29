# Bảo mật & Tuân thủ

## Khung pháp lý

Dữ liệu tâm lý học sinh là loại dữ liệu **cực kỳ nhạy cảm**. Một vết rò rỉ nhỏ có thể dẫn đến bạo lực học đường, dán nhãn tiêu cực, hoặc phá hủy sự tin tưởng của học sinh vào hệ thống.

Emotico tuân thủ nghiêm ngặt:

| Tiêu chuẩn | Phạm vi |
|---|---|
| **Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15** | Bảo vệ dữ liệu cá nhân tại Việt Nam (hiệu lực 01/01/2026) |
| **Thông tư 18/2025/TT-BGDĐT** | Quy định hoạt động tư vấn tâm lý trong trường học |
| **Nghị định 147/2024/NĐ-CP** | Quản lý, cung cấp và sử dụng dịch vụ internet |
| **Luật Trẻ em 2016** | Quy định đặc biệt cho người dùng dưới 18 tuổi |
| **Luật Khám bệnh, chữa bệnh 15/2023** | Giới hạn phạm vi hỗ trợ sức khỏe tâm thần |
| **ISO/IEC 27001** | Quản lý an toàn thông tin |
| **ISO/IEC 27701** | Mở rộng ISO 27001 cho bảo vệ dữ liệu cá nhân |

**Phân vai trách nhiệm:**
- **Trường học** quyết định mục đích và cách sử dụng dữ liệu (Data Controller)
- **Emotico** chỉ xử lý dữ liệu theo đúng chỉ định của trường (Data Processor)
- Với học sinh đăng ký cá nhân (B2C), Emotico đóng vai Data Controller và gánh trách nhiệm trực tiếp
- Hợp đồng triển khai bắt buộc có đánh giá tác động bảo vệ dữ liệu đính kèm

**Quy trình đồng ý theo độ tuổi:**
- **Dưới 7 tuổi:** Không cho phép sử dụng
- **7–15 tuổi:** Đồng ý kép — cần xác nhận từ cả phụ huynh lẫn học sinh
- **16–17 tuổi:** Học sinh tự đồng ý + thông báo đến phụ huynh

---

## Bảo vệ dữ liệu

| Điểm cần bảo vệ | Cách thức |
|---|---|
| **Dữ liệu truyền qua mạng** | Mã hóa toàn bộ, chống nghe lén |
| **Dữ liệu lưu trữ** | Mã hóa khi lưu tại máy chủ |
| **Khóa mã hóa** | Tự động thay mới mỗi 30 ngày |
| **Truy cập Dashboard trường** | Xác thực 2 lớp, chỉ cho phép từ mạng nội bộ trường |
| **Dữ liệu vị trí** | Chỉ dùng tức thời khi người dùng chủ động yêu cầu, không lưu lịch sử |
| **Nguy cơ từ nội bộ** | Ẩn danh hóa dữ liệu — xem phần dưới |

**Quyền của người dùng:**
- Toggle tự xóa lịch sử hội thoại và dữ liệu cá nhân bất kỳ lúc nào
- Dữ liệu được lưu theo mục đích cụ thể, không lưu vĩnh viễn
- Quyền yêu cầu xóa toàn bộ dữ liệu

---

## Ẩn danh hóa dữ liệu

Đây là lớp bảo vệ quan trọng nhất của Emotico:

- **Hệ thống Emotico** chỉ thấy mã số ẩn danh, không biết tên thật học sinh
- **Bảng tra cứu mã số → tên thật** được lưu riêng tại máy chủ cục bộ trong phòng Tham vấn học đường của trường — không kết nối internet
- Chỉ **tư vấn viên được ủy quyền** tại trường mới có thể tra cứu tên thật
- Chỉ kích hoạt khi có cảnh báo nguy cơ sức khỏe tâm thần nghiêm trọng (theo quy trình Thông tư 18)

**Kết quả:** Ngay cả khi hệ thống Emotico bị tấn công từ bên ngoài, không có tên thật nào của học sinh bị lộ.
