# Bảo mật & Tuân thủ / Security & Compliance

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

---

## Legal Framework

Student psychological data is **extremely sensitive**. A single leak can lead to school bullying, negative labeling, or destroying students' trust in the system.

Emotico complies with:

| Standard | Scope |
|---|---|
| **Decree 13/2023/NĐ-CP** | Personal data protection in Vietnam |
| **Vietnam Children's Law** | Special rules for users under 18 |
| **ISO/IEC 27001** | Information security management |
| **ISO/IEC 27701** | Extension of ISO 27001 for personal data protection |

**Responsibility split:**
- **School = Data Controller** — decides the purpose and manner of processing
- **Emotico = Data Processor** — processes data as instructed by the school
- Deployment contract must include a **DPIA** (Data Protection Impact Assessment)

**Consent flow:** Dual consent — Parental Consent + Child Assent — required for users under 18.

## Security Matrix

| Risk point | Defense protocol |
|---|---|
| **App → Server transit** | Mandatory TLS 1.3 + SSL Pinning (anti-MitM) |
| **Database at school** | AES-256 encryption at rest |
| **Key management** | AWS KMS — automatic rotation every 30 days |
| **Admin Dashboard access** | Mandatory MFA + IP Whitelist (school intranet only) |
| **Insider threat** | Pseudonymization — see below |

## Pseudonymization

- **Emotico's server** only sees anonymous UUIDs (e.g., `uuid_9999`)
- **UUID → Real name mapping** stored on a local server in the school's **counseling room**
- Only the **authorized counselor** at the school can decrypt UUID → real name
- Trigger: **Red Alert** (signs of serious mental health risk)

**Result:** Even if Emotico's system is breached, no real names are exposed.
