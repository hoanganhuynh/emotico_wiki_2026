# Tổng quan sản phẩm / Product Overview

## Bài toán

Sức khỏe tâm thần học sinh đang trong tình trạng báo động tại Việt Nam. Áp lực học tập, thi cử và môi trường xã hội khiến nhiều học sinh không có không gian an toàn để nhận diện và xử lý cảm xúc. Hầu hết các giải pháp hiện tại hoặc quá lâm sàng (tâm lý trị liệu), hoặc quá hời hợt (app thiền định), hoặc yêu cầu học sinh tự mô tả cảm xúc bằng ngôn ngữ mà các em chưa có.

## Giải pháp

Emotico sử dụng hệ thống **5 cảm xúc cơ bản** — Vui, Buồn, Ghê tởm (Tôn trọng), Sợ hãi (Can đảm), Temper (Giận dữ hoặc Sự nhiệt huyết) — với 3 cấp độ cường độ để học sinh gọi tên cảm xúc mà không cần từ vựng tâm lý học phức tạp. Hệ thống cho phép pha trộn 2 cảm xúc cơ bản (Blend Mode) tạo ra ma trận 15×15 trạng thái cảm xúc phong phú.

**Triết lý cốt lõi:**
- ❌ Không sử dụng AI để tư vấn hoặc tương tác trực tiếp với học sinh
- ✅ AI chỉ được dùng ở Back-office — tối ưu hóa phân tích dữ liệu hành vi và tự động hóa xuất báo cáo Insight cho nhà trường
- ✅ Rule-based Deterministic Engine — xử lý <50ms, không có chi phí token LLM
- ✅ Dữ liệu tâm lý ≠ dữ liệu thương mại — không bán, không dùng cho quảng cáo
- ✅ Học sinh là chủ sở hữu dữ liệu cảm xúc của mình
- ✅ Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân trẻ em

## Bảo chứng khoa học

Nền tảng học thuật của Emotico được bảo chứng bởi:
- **Luận án Tiến sĩ**: *"Hành vi tìm kiếm sự trợ giúp về sức khỏe tâm thần của học sinh trung học"*
- **Đề tài nghiên cứu khoa học cấp Bộ**: *"Tìm kiếm sự hỗ trợ tâm lý trên internet trong bối cảnh chuyển đổi số của học sinh trung học"*

## Đối tượng người dùng

| Loại | Mô tả | Kênh |
|---|---|---|
| **Học sinh (B2C)** | Tự đăng ký, dùng cá nhân — miễn phí tính năng cốt lõi | App Store / Google Play |
| **Học sinh (B2B2C)** | Đăng ký qua trường học, tài khoản học đường | App chính |
| **Trường học** | Mua license, nhận Dashboard báo cáo insight học kỳ | Hợp đồng B2B |

## Mô hình kinh doanh

**B2C (In-app Purchase):** Người dùng trả phí để mở khóa bài trắc nghiệm nâng cao (Wellness Nghề nghiệp, Thích ứng nghề nghiệp) và nhận Báo cáo Insight cá nhân sâu sắc. Đây là nền tảng cho Hồ sơ sức khỏe tâm thần số (eCV) phục vụ hướng nghiệp và săn học bổng.

**B2B2C (Trường học):** Hợp tác trực tiếp với Ban Giám hiệu và Hội Phụ huynh. Nhà trường nhận báo cáo tổng quan ẩn danh về tình trạng học sinh và đề xuất phương án can thiệp tâm lý kịp thời. Thu phí định kỳ 2 lần/năm theo đầu học sinh đăng ký.

## Mascot — eMascot Hổ Gin & eMonster

**eMascot Hổ Gin** là người bạn đồng hành trung tâm trong suốt hành trình cảm xúc. Gin phản chiếu trực quan trạng thái cảm xúc của học sinh qua thư viện ảnh `.webp` — khi học sinh dịch chuyển Slider cường độ hoặc pha trộn cảm xúc, Frontend chỉ thực hiện lệnh tráo đổi (swap) ID ảnh tương ứng với tốc độ <100ms.

**eMonster** là đối trọng của eMascot — hình tượng hóa các vấn đề sức khỏe tâm thần thường gặp thành các "Quái vật". Học sinh làm trắc nghiệm, thực hiện các nhiệm vụ EQ để "thu phục" eMonster — chuyển hóa thành eMascot. Đây là cơ chế Gamification cốt lõi thúc đẩy Retention.

---

## The Problem

Student mental health is at a critical level in Vietnam. Academic pressure, exams, and social environments leave many students without a safe space to identify and process their emotions. Most existing solutions are either too clinical (therapy), too shallow (meditation apps), or require students to describe emotions in vocabulary they don't yet have.

## The Solution

Emotico uses a system of **5 core emotions** — Joy, Sadness, Disgust (Respect), Fear (Courage), Temper (Anger or Passion) — with 3 intensity levels, allowing students to name their emotional state without complex psychological vocabulary. The system supports blending 2 base emotions (Blend Mode) to create a rich 15×15 emotional state matrix.

**Core philosophy:**
- ❌ No AI for direct counseling or student-facing interaction
- ✅ AI is only used in Back-office — to optimize behavioral data analysis and automate school insight reports
- ✅ Rule-based Deterministic Engine — <50ms processing, zero LLM token cost
- ✅ Psychological data ≠ commercial data — never sold, never used for ads
- ✅ Students own their emotional data
- ✅ Compliant with Decree 13/2023/NĐ-CP on personal data protection for minors

## Scientific Backing

Emotico's academic foundation is backed by:
- **PhD Thesis**: *"Help-seeking behavior for mental health among high school students"*
- **Ministry-level Research**: *"Seeking psychological support online in the context of high school students' digital transition"*

## Target Users

| Type | Description | Channel |
|---|---|---|
| **Students (B2C)** | Self-registered, personal use — core features free | App Store / Google Play |
| **Students (B2B2C)** | School-enrolled, school account | Main app |
| **Schools** | License buyer, receives semester insight dashboard | B2B contract |

## Business Model

**B2C (In-app Purchase):** Users pay to unlock advanced assessments (Career Wellness, Career Adaptability) and receive in-depth personal Insight Reports. This feeds the digital mental health portfolio (eCV) for career counseling and scholarship applications.

**B2B2C (Schools):** Direct partnership with school leadership and parent associations. Schools receive anonymized overview reports on student wellbeing and timely intervention proposals. Billed twice per year per enrolled student.

## Mascot — eMascot Tiger Gin & eMonsters

**eMascot Tiger Gin** is the central companion throughout the emotional journey. Gin visually reflects the student's emotional state through a `.webp` image library — when students move the intensity slider or blend emotions, the Frontend executes an image ID swap at <100ms.

**eMonsters** are Gin's counterparts — personifications of common mental health challenges as "creatures." Students take quizzes and complete EQ tasks to "tame" eMonsters — converting them into eMascots. This is the core Gamification mechanism driving Retention.
