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
- **Trường học = Data Controller** — quyết định mục đích và cách xử lý data
- **Emotico = Data Processor** — xử lý data theo chỉ định của trường
- Hợp đồng triển khai bắt buộc đính kèm **DPIA** (Data Protection Impact Assessment)

**Quy trình đồng ý (Consent):**
- Đồng ý kép: **Parental Consent** (phụ huynh) + **Child Assent** (học sinh)
- Học sinh dưới 18 tuổi cần có phụ huynh xác nhận trước khi sử dụng

---

## Ma trận bảo mật

| Điểm nguy cơ | Giao thức phòng thủ |
|---|---|
| **Đường truyền App → Server** | TLS 1.3 bắt buộc + SSL Pinning (chống Man-in-the-Middle) |
| **Database tại trường** | AES-256 encryption at rest |
| **Quản lý khóa mã hóa** | AWS KMS — rotate tự động mỗi 30 ngày |
| **Truy cập Admin Dashboard** | MFA bắt buộc + IP Whitelist (chỉ mạng nội bộ trường) |
| **Nguy cơ nội bộ** | Pseudonymization — xem phần dưới |

---

## Giả danh hóa (Pseudonymization)

Đây là lớp bảo vệ quan trọng nhất của Emotico:

- **Server Emotico** chỉ thấy UUID ẩn danh (Ví dụ: `uuid_9999`)
- **Mapping UUID → Tên thật** được lưu tại máy chủ cục bộ trong **phòng Tham vấn học đường** của trường
- Chỉ **counselor được ủy quyền** tại trường mới có quyền giải mã UUID → tên thật
- Điều kiện kích hoạt: **Red Alert** (dấu hiệu nguy cơ sức khỏe tâm thần nghiêm trọng)

**Kết quả:** Ngay cả khi hệ thống Emotico bị tấn công, không có tên thật nào bị lộ.
