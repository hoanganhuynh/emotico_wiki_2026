# Chức năng / Features

## 1. Check-in Cảm xúc

Chức năng cốt lõi của Emotico. Học sinh check-in tối thiểu 1 lần/ngày để ghi nhận trạng thái cảm xúc hiện tại. Toàn bộ luồng vận hành 100% không AI — sử dụng Deterministic Rule-Based Engine.

**Luồng check-in 3 tầng:**

**Tầng 1 — Chọn Cảm xúc Chủ đạo:**
- Hiển thị eMascot Hổ Gin (trạng thái Neutral) ở trung tâm
- 5 biểu tượng Icon cảm xúc cơ bản: **Vui · Buồn · Ghê tởm (Tôn trọng) · Sợ hãi (Can đảm) · Temper (Giận dữ/Nhiệt huyết)**

**Tầng 2 — Điều biến Cường độ & Phép cộng Dung hợp:**
- Slider 3 nấc: 1 (Nhẹ) – 2 (Cơ bản) – 3 (Cực độ)
- Khi kéo Slider, Frontend swap ảnh `.webp` của Gin tương ứng mức độ
- **Trường hợp Exact Match:** Cảm xúc đơn lẻ đã đúng → học sinh nhấn **[Check in]**
- **Trường hợp Blend Mode:** "Mình thấy phức tạp hơn..." → hiện 4 cảm xúc còn lại dưới dạng icon nhỏ để chọn cảm xúc phụ → Gin hiển thị trạng thái dung hợp (ma trận 15×15)

**Tầng 3 — Phân luồng Logic & Bản đồ Dấu ấn Cơ thể:**
- **Vibe Tiêu cực:** Gin hiện với 5 Chấm tròn (Dot) nhấp nháy trên cơ thể — 5 vùng cảm nhận: Đầu · Ngực · Bụng · Vai & Tay · Vùng xương chậu
- **Vibe An toàn/Tích cực:** Màn hình an ủi/chúc mừng tĩnh
- **Bối cảnh tùy chọn (Không bắt buộc):** Tag nhanh — Làm gì (What) · Với ai (Who) · Ở đâu (Where)

**Sau khi xác nhận — Giao diện Phản hồi của Gin:** Hiển thị 3 nút gợi ý hành động:
1. **Từ điển Cảm xúc** — Khám phá định nghĩa trạng thái vừa log
2. **Trắc nghiệm Tâm lý** — Định vị năng lượng Wellness (kích hoạt động khi đủ điều kiện)
3. **Bài tập CBT** — Thử thách 60 giây giải tỏa (kích hoạt động khi đủ điều kiện)

| Cảm xúc | Mô tả |
|---|---|
| 😄 **Vui** | Năng lượng tích cực, hứng khởi |
| 😢 **Buồn** | U sầu, cô đơn, mất mát |
| 😤 **Ghê tởm / Tôn trọng** | Phản ứng với ranh giới bị vi phạm |
| 😨 **Sợ hãi / Can đảm** | Lo lắng, bất an, đối mặt thử thách |
| 😠 **Temper / Nhiệt huyết** | Giận dữ hoặc năng lượng bùng phát |

---

## 2. Xem Lịch sử & Báo cáo (Report)

Phân tích xu hướng cảm xúc dựa trên dữ liệu check-in lịch sử.

**Bộ lọc thời gian:** 7 ngày · 30 ngày · 90 ngày

**Bộ lịch Gradient dòng chảy (Emotional Calendar):**
- Ô ngày trắng = chưa check-in (khuyến khích bổ sung, tối đa 2 lần/ngày)
- Ô ngày màu = cảm xúc chiếm chủ đạo (màu muted/pastel theo hệ vibe)
- Các ngày liên kề tự động render đường gradient mượt mà
- Late check-in: Tap vào ô ngày cũ → Pop-up bổ sung nhanh

**Khối Insights tĩnh (Không AI):**
- Cảm xúc chủ đạo + tác nhân kích hoạt nhiều nhất (what × where)
- Mẫu câu ghép chuỗi: *"Tâm trạng [EMOTION] của bạn có xu hướng xuất hiện nhiều nhất khi bạn đang [WHAT] tại [WHERE]."*

**Bản đồ Nhiệt phản ứng Cơ thể (Somatic Heatmap):**
- Hình bóng mờ của Gin với 5 vùng phát sáng theo tần suất body_markers được kích hoạt trong chu kỳ lọc

**Kịch bản điều tiết hành vi (Hardcoded CTAs):** Xuất hiện khi check-in tiêu cực vượt ngưỡng:
- Vibe U sầu ≥40%: Gin gợi ý bài tập CBT + trắc nghiệm PHQ-A
- Vibe Lo âu ≥5 lần/7 ngày: Gợi ý trắc nghiệm GAD-7
- Vibe Chán ngán ≥6 lần/7 ngày: Gợi ý trắc nghiệm SDQ

> **Lưu ý kỹ thuật:** Dữ liệu check-in chi tiết chỉ hiển thị trong 90 ngày trên app học sinh. Sau 90 ngày, dữ liệu thô được xóa sạch khỏi giao diện và tự động nén thành Chỉ số tổng quát ẩn danh lưu giữ 365 ngày phục vụ báo cáo B2B và nghiên cứu khoa học.

---

## 3. Từ điển Cảm xúc

Kho từ vựng tâm lý được minh họa sinh động, giúp học sinh chuyển từ những cảm giác bất ổn chưa gọi tên được thành các khái niệm tâm lý rõ ràng để tự điều tiết hành vi.

**Giao diện:**
- **Tab "Khám phá Tra cứu"**: Cards Grid dạng bong bóng, bộ lọc theo 5 nhóm Vibe năng lượng cốt lõi
- **Thanh tìm kiếm**: Theo tên từ vựng hoặc từ khóa định nghĩa
- **Màn hình Chi tiết Từ vựng**: Mỗi từ bắt buộc kết xuất đủ 5 khối thông tin:

| Khối | Tên hiển thị | Nội dung |
|---|---|---|
| 1 | **Giải nghĩa cảm xúc** | Định nghĩa ngắn, chuyên nghiệp, thấu cảm |
| 2 | **Nguồn gốc & Cơ chế** | Lý giải sinh học thần kinh / tâm lý học tiến hóa |
| 3 | **Ví dụ điển hình** | Câu chuyện từ đời sống học đường hoặc phim Pixar (Inside Out, Soul) |
| 4 | **Vibe tương đồng & Trái nghĩa** | Cảm xúc kế cận (🟢) và cảm xúc đối trọng (🔴) |
| 5 | **Thực thể liên kết** | Hình bóng mờ (Silhouette) eMonster tương ứng |

**Tính năng Nhật ký Kỷ niệm (Reflective Memory Vault):**
- Dưới màn hình Chi tiết, học sinh có thể nhấn **"Lưu vào Nhật ký Phản tư Đặc biệt"**
- Viết ghi chú cá nhân gắn với từ vựng đó
- Toàn bộ nội dung được **mã hóa AES-256 cục bộ** trước khi đồng bộ lên Cloud
- Truy cập Tab 2 "Nhật ký Kỷ niệm": Bắt buộc xác thực **FaceID/TouchID hoặc mã PIN** riêng

---

## 4. Trắc nghiệm Tâm lý & Hồ sơ eCV

Hệ thống đánh giá tâm lý khoa học, chuẩn hóa lâm sàng quốc tế, vận hành 100% không AI.

**Phân hệ Miễn phí (Lâm sàng):**

| Bài test | Đánh giá | Cooldown |
|---|---|---|
| PHQ-A | Trầm cảm / U sầu | 14 ngày |
| GAD-7 | Lo âu cực độ / Bất an sâu sắc | 14 ngày |
| DASS-21 | Trầm cảm + Lo âu + Căng thẳng | 14 ngày |
| SDQ | Hành vi & Tập trung | 30 ngày |
| SCARED | Lo âu xã hội / Sợ trường học | 30 ngày |

**Phân hệ Trả phí (Wellness nâng cao):**

| Bài test | Đánh giá | Cooldown |
|---|---|---|
| Wellness Nghề nghiệp | Định vị bản sắc nghề nghiệp | 90 ngày |
| Thích ứng nghề nghiệp (Savickas) | Sức bật & Định hướng tương lai | 90 ngày |

**Giao diện làm bài (Low-Pressure UI):**
- Mỗi câu hỏi hiển thị độc lập trên 1 viewport duy nhất (Single-Question Screen)
- Phương án trả lời dạng Bubble Cards bo góc mềm mại, haptic feedback <30ms
- Thanh tiến độ: Mascot Hổ Gin đi bộ từ trái sang phải ở góc trên màn hình

**Thuật toán chặn hành vi gian lận (Discrepancy Filter):**
- Nếu học sinh check-in tiêu cực cấp 3 liên tục 5 lần/tuần nhưng làm bài test trả về mức "Bình thường/An toàn" — Backend phát hiện lệch pha và kích hoạt cờ phạt `is_data_manipulated = TRUE`
- Hành động: Ép mức trần 4 trục Radar eCV xuống 40% vĩnh viễn + khóa toàn bộ bách khoa eMonster cho đến khi học sinh check-in trung thực 14 ngày liên tục

**Radar eCV — 4 trục Hồ sơ năng lực số:**

| Trục | Tên | Nguồn dữ liệu |
|---|---|---|
| MWB | Ổn định Nội tại (Mental Well-being Baseline) | WHO-5, DASS-21, PHQ-A |
| CRE | Ý chí & Điều tiết Nhận thức (Cognitive Regulation & Execution) | Wellness Trí tuệ, SDQ |
| SBM | Bản lĩnh & Ranh giới Xã hội (Social Boundary Mastery) | Wellness Xã hội, SCARED |
| CAFR | Sức bật & Định hướng Tương lai (Future Readiness & Career Adaptability) | Wellness Nghề nghiệp, Savickas (Trả phí) |

> Điểm Radar eCV = **Trung bình cộng** của các bài test tương ứng trong chu kỳ 90 ngày gần nhất (Date-Only). Không bị tác động bởi số xu Ví Tự Chủ hay số lượng bài tập CBT.

---

## 5. Bài tập CBT & Sổ tay Bí kíp (Life Hacks)

Hệ thống bài tập cá nhân hóa được kích hoạt tự động dựa trên `user_health_status`:

**Tab 1 — Bài tập (Active CBT Workouts)** — kích hoạt khi `user_health_status == OVERLOAD`:
- Khóa danh sách eMonster, chỉ hiển thị 01 thực thể tiêu cực đang ký sinh
- **Thanh Tiến trình Phục hồi (Baseline Restoration Bar):** Hiển thị % số buổi tập còn lại
- Bài tập dạng Micro-steps 60 giây – 3 phút, tích hợp đồng hồ đếm ngược ở trung tâm
- Ba nhóm bài tập điều tiết nhanh:
  - **Somatic Release:** Thở, giãn cơ (cho Vibe U sầu nhẹ, Bực dọc)
  - **Box Breathing:** Hít 4s – Giữ 4s – Thở ra 4s (cho Vibe hưng cảm ảo, Mất tập trung)
  - **Chiến dịch 30 giây:** Uống nước ấm, vươn vai, dọn 3 món (cho Vibe Chán ngán, Trì hoãn)

**Tab 2 — Life Hack (Bí kíp Tâm lý Chủ động)** — kích hoạt khi `user_health_status == NORMAL`:
- Mở 100% bách khoa eMonster để học sinh tự do khám phá
- **Thẻ Bí kíp (Catchy Cards):** Tiêu đề hiện đại, thấu cảm, gần gũi (Ví dụ: *"Bí kíp JOMO — Làm chủ niềm vui bỏ lỡ"*, *"Hack Dopamine lành mạnh sau giờ học"*)
- Mỗi thẻ gồm: Nguyên lý khoa học thần kinh (văn xuôi ngắn) + Hướng dẫn ứng dụng 2 dòng

**Cơ chế chặn gian lận (Anti-Exploit):**
- Thời gian tối thiểu bắt buộc `min_duration` (tính bằng giây) cho mỗi bước — nút "Hoàn tất" bị vô hiệu hóa cho đến khi đồng hồ về 0
- Trần tích lũy hằng ngày: Tối đa **50 điểm Tự Chủ/ngày** (Daily Velocity Cap)

---

## 6. Hồ sơ năng lực, Sổ tay Địa bàn & Cài đặt

**Phân vùng 1 — Hồ sơ Căn tính & Đồ thị Radar eCV:**
- Identity Avatar: Ảnh `.webp` của Gin ứng với cấp độ thăng tiến kỹ năng
- Đồ thị Radar 4 trục (MWB · CRE · SBM · CAFR) hiển thị trực quan
- Ví Tự Chủ (điểm thưởng từ bài tập CBT) + trạng thái Hồ sơ eCV
- Lối dẫn vào kho Từ vựng đã lưu và Nhật ký Kỷ niệm

**Phân vùng 2 — Sổ tay Địa bàn (Clinic Directory View):**
- Bộ lọc địa bàn: Tỉnh/Thành phố (mặc định theo vị trí tài khoản học đường)
- Danh sách phòng khám/bệnh viện tâm thần nhi uy tín, gồm: Tên cơ sở · Địa chỉ · Hotline gọi nhanh · Mức chi phí dự kiến

**Phân vùng 3 — Cài đặt Hệ thống:**
- Khóa bảo mật Sinh học Không gian Phản tư (FaceID/TouchID/PIN)
- Nhắc nhở nhẹ từ Gin (tần suất thông báo)
- Xuất tệp Hồ sơ Năng lực eCV (PDF chuẩn hóa)

---

## 7. Báo cáo Định kỳ

**Báo cáo Cá nhân (In-app User Report):**
- Chu kỳ: Mỗi 30 ngày
- Phạm vi dữ liệu: Tối đa 90 ngày gần nhất
- Nội dung: Cảm xúc chủ đạo × Tác nhân kích hoạt · Radar eCV 4 trục · Bản đồ Nhiệt cơ thể

**Báo cáo Trường học (B2B SaaS School Report):**
- Chu kỳ: Giữa học kỳ hoặc Cuối học kỳ (2–5 tháng/lần)
- Phạm vi dữ liệu: Toàn trường hoặc phân rã theo Khối (10/11/12) — **KHÔNG phân rã theo Lớp học** (bảo vệ quyền riêng tư học sinh)
- Nội dung: Chỉ số Đề kháng Cảm xúc Học đường (SERI) · Phân bố Tâm trạng Thế hệ · Bản đồ Nhiệt Tác nhân Rủi ro theo bối cảnh
- Bảo vệ dữ liệu: Chỉ xuất khi tổng số tài khoản hoạt động trong chu kỳ ≥ **30 học sinh/Khối** (Minimum Active Users Constraint)

---

## Emotion Check-in

The core feature of Emotico. Students check in at least once per day. Fully rule-based, zero AI.

**3-layer check-in flow:**

**Layer 1 — Select Primary Emotion:**
- 5 core emotion icons: **Joy · Sadness · Disgust (Respect) · Fear (Courage) · Temper (Anger/Passion)**

**Layer 2 — Intensity & Blend Mode:**
- 3-notch slider: 1 (Mild) – 2 (Moderate) – 3 (Intense)
- Frontend swaps Gin's `.webp` image at <100ms
- **Exact Match:** Single emotion confirmed → tap [Check in]
- **Blend Mode:** "It's more complex..." → pick secondary emotion → Gin shows blended state (15×15 matrix)

**Layer 3 — Logic Routing & Somatic Body Map:**
- **Negative Vibe:** 5 pulsing body touch dots: Head · Chest · Belly · Shoulders & Hands · Pelvis
- **Positive Vibe:** Calm/celebratory static screen
- **Optional context tags:** What · Who · Where

**Post-check-in — Gin's Response Panel:**
1. Emotion Dictionary — explore the current state's definition
2. Wellness Quiz — assess energy levels (conditional)
3. CBT Exercise — 60-second challenge (conditional)

## Emotion Dictionary

Illustrated psychological vocabulary to help students convert unnamed feelings into clear concepts for self-regulation. Each entry includes 5 mandatory information blocks: Definition · Origin & Mechanism · Real-life Example · Related/Opposite Vibes · Linked eMonster Silhouette.

**Reflective Memory Vault:** Students can save personal journal notes tied to a vocabulary entry. All text is encrypted AES-256 locally before cloud sync. Access requires biometric or PIN authentication.

## Psychological Assessments & eCV Portfolio

Clinically standardized assessment system, 100% rule-based (no AI).

**Free (Clinical) tier:** PHQ-A, GAD-7, DASS-21 (14-day cooldown) · SDQ, SCARED (30-day cooldown)

**Paid (Wellness) tier:** Career Wellness, Savickas Career Adaptability (90-day cooldown)

**eCV Radar — 4-axis digital capability portfolio:**
- **MWB** (Mental Well-being Baseline) · **CRE** (Cognitive Regulation & Execution) · **SBM** (Social Boundary Mastery) · **CAFR** (Future Readiness & Career Adaptability)

Score = rolling 90-day average of corresponding validated assessments.

## CBT Exercises & Life Hacks

**Tab 1 — Exercises (OVERLOAD mode):** Baseline restoration workouts — somatic release, box breathing, 30-second action sprints. Progress bar counts down to recovery. eMonster catalog locked until baseline restored.

**Tab 2 — Life Hacks (NORMAL mode):** Proactive mental health tips as catchy science-backed cards. Full eMonster encyclopedia unlocked. Daily velocity cap: 50 Autonomy Points/day.

## Profile, Clinic Directory & Settings

- **eCV Radar Profile:** 4-axis chart + Autonomy Wallet + eCV export
- **Clinic Directory:** Location-filtered list of trusted child psychiatry clinics with contact info and cost estimates
- **Settings:** Biometric journal lock · Gin reminder frequency · eCV PDF export

## Periodic Reports

**Personal Report (monthly):** Top emotions × triggers · eCV Radar · Body Somatic Heatmap · 90-day data window

**School Report (per semester):** School Emotional Resilience Index (SERI) · Generational mood distribution · Contextual risk heatmap — requires ≥30 active accounts per grade to render (privacy protection)
