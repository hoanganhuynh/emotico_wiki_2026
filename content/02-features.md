# Chức năng / Features

## Check-in Cảm xúc

Chức năng cốt lõi của Emotico. Học sinh check-in tối thiểu 1 lần/ngày để ghi nhận trạng thái cảm xúc hiện tại.

### Luồng check-in đầy đủ

1. Chọn **cảm xúc chính** từ 5 vibe
2. Chọn **cường độ** (3 nấc)
3. Chọn **cảm xúc phụ** (tùy chọn) → kích hoạt Blend Mode
4. Chọn **body markers** — vị trí cơ thể cảm nhận cảm xúc *(chỉ hiện khi vibe tiêu cực)*
5. Nhập **context**: Ở đâu · Làm gì · Với ai

**Quick check-in:** Bỏ qua bước 3–5, chỉ cần cảm xúc chính + cường độ.

---

### 5 Vibe Cảm xúc

> **Lưu ý thiết kế quan trọng**: Giao diện người dùng **không dùng tên nguyên tố Ngũ Hành** (Kim, Mộc, Thủy, Hỏa, Thổ). Thay vào đó, mỗi vibe được đặt tên theo cảm xúc trực quan để học sinh dễ nhận diện.

| Vibe | Tên hiển thị | Icon gợi ý | Màu |
|---|---|---|---|
| Mộc | Bực dọc & Giận dữ | Gai nhọn / Mầm cây | Xanh lá |
| Hỏa | Vui tươi & Hào hứng | Ngọn lửa sưởi ấm | Đỏ cam |
| Thổ | Bài xích & Trầm tư | Khối đất / Đất sét | Vàng nâu |
| Kim | Buồn bã & U sầu | Quặng đá / Kim loại mờ | Xám bạc |
| Thủy | Lo âu & Sợ hãi | Giọt nước / Khối băng | Xanh dương |

---

### Cường độ (3 nấc)

| Nấc | Nhãn |
|---|---|
| 1 | Nhẹ |
| 2 | Cơ bản |
| 3 | Cực độ |

---

### Blend Mode — Cảm xúc phái sinh

Sau khi chọn cảm xúc chính, người dùng có thể chọn thêm **1 cảm xúc phụ**. Hai vibe kết hợp tạo ra một **cảm xúc phái sinh** từ ma trận 5×5 (25 ô, trong đó 5 ô chính đường chéo + 10 ô phái sinh hai chiều = 15 tổ hợp có nghĩa).

**Ví dụ:**

| Cảm xúc chính | Cảm xúc phụ | Cảm xúc phái sinh |
|---|---|---|
| Mộc (Bực dọc) | Hỏa (Vui tươi) | 🌋 Núi lửa — Lạc quan tràn đầy |

Mỗi ô phái sinh có: tên riêng + mô tả ngắn + hình ảnh mascot Gin tương ứng.

---

### Body Markers

5 vùng cơ thể để người dùng đánh dấu nơi cảm nhận cảm xúc:

1. Đầu
2. Ngực
3. Bụng
4. Vai & Tay
5. Vùng xương chậu

> Body markers **chỉ xuất hiện khi vibe được chọn là tiêu cực** (Mộc / Kim / Thủy, hoặc Thổ ở nấc cao). Vibe tích cực (Hỏa) bỏ qua bước này.

---

### Post Check-in: 3 CTA Cards

Sau khi lưu check-in, hệ thống hiển thị tối đa 3 thẻ hành động:

| Thẻ | Icon | Điều kiện hiển thị |
|---|---|---|
| Từ điển | 📖 | Luôn hiện |
| Trắc nghiệm | 📝 | Kích hoạt khi overload ≥ 5 lần / 7 ngày |
| CBT 60 giây | ⚡ | Kích hoạt khi tiêu cực ≥ 4 lần / 7 ngày |

---

### Quick Template

Hệ thống tự động lưu **3–5 combo check-in gần nhất** để người dùng có thể re-check-in bằng one-tap mà không cần chọn lại từ đầu.

---

### Mascot Gin

Gin thay đổi hình ảnh theo trạng thái cảm xúc được check-in (swap file `.webp`).

- **Tốc độ swap**: < 100ms
- **Ví dụ file**: `gin_annoyed.webp`, `gin_volcano_optimistic.webp`
- Phản hồi text của Gin: Hardcoded text library + `Random()` — **không dùng AI** để đảm bảo tốc độ và kiểm soát nội dung

---

### Lịch sử Check-in

| Phạm vi | Nơi lưu |
|---|---|
| 90 ngày gần nhất | Hiển thị trên app |
| Toàn bộ lịch sử | Backend (lưu vĩnh viễn, ẩn danh) |

---

## Từ điển Cảm xúc

Kho từ vựng tâm lý được minh họa sinh động. Mỗi cảm xúc có: Định nghĩa · Nguồn gốc · Ví dụ từ văn học/điện ảnh · Hình ảnh chibi minh họa.

**Giao diện:**
- **Tab "Từ mới"**: Poster dạng swipe-up, admin có thể pin từ nổi bật
- **Tab "Tất cả"**: Grid/List view, sắp xếp theo alphabet
- **Tìm kiếm**: Theo tên cảm xúc hoặc định nghĩa
- **Bookmark**: Lưu từ vào danh sách cá nhân

---

## Trắc nghiệm & Hồ sơ eCV

### Radar 4 trục eCV

Kết quả trắc nghiệm được tổng hợp thành **biểu đồ radar 4 trục** (eCV — Emotional Competency Vector):

| Trục | Tên đầy đủ | Bộ test cấu thành |
|---|---|---|
| MWB | Mental Well-being Baseline | DASS-21, PHQ-A, GAD-7 |
| CRE | Cognitive Regulation & Execution | Wellness Trí tuệ, SDQ |
| SBM | Social Boundary Mastery | Wellness Xã hội, SCARED |
| CAFR | Future Readiness & Career Adaptability | Wellness Nghề nghiệp, Savickas *(trả phí)* |

---

### Cooldown các bộ test

| Bộ test | Cooldown |
|---|---|
| PHQ-A / GAD-7 / DASS-21 | 14 ngày |
| SDQ / SCARED | 30 ngày |
| Wellness (Trí tuệ / Xã hội / Nghề nghiệp) | 90 ngày |

---

### Anti-cheat

Nếu người dùng check-in tiêu cực **≥ 5 lần / tuần** nhưng kết quả bộ test ra "Bình thường":

1. Hệ thống đặt cờ `is_data_manipulated = TRUE`
2. eMonster bị khóa
3. Điểm 4 trục radar bị **cap xuống tối đa 40%**

---

### Hidden Quest

Khi học sinh rơi vào trạng thái **overload** (xác định từ chuỗi check-in), hệ thống tự động hiển thị Hidden Quest:

- Giao diện Gin lo lắng
- Quest xuất hiện không cần người dùng chủ động tìm

---

## CBT & Life Hacks

Chức năng hỗ trợ sức khỏe tâm thần qua bài tập nhận thức-hành vi và mẹo thực tế.

### 2 Tab

| Tab | Tên | Điều kiện |
|---|---|---|
| Bài tập | Bài tập CBT | Kích hoạt khi OVERLOAD |
| Bí kíp | Life Hacks | Luôn mở |

### Bài tập CBT

- Dạng **micro-step**: mỗi bước 60 giây – 3 phút
- Có **countdown timer** cho từng bước
- **Thanh tiến độ**: hình ảnh chiếc bình đang lấp đầy (từ trạng thái âm về 0 = Bình thường)

---

## Nhiệm vụ / Quest

Bài tập CBT (Liệu pháp Nhận thức Hành vi) được đóng gói dưới dạng thử thách thú vị.

**Tạo và tham gia thử thách:**
- Chọn từ thử thách mẫu của Emotico hoặc tự tạo mới
- Thời gian: 7 · 15 · 30 ngày
- Chia sẻ qua ID hoặc QR code
- Mức hoàn thành tối thiểu: 50–100%

**Hệ thống ePoints:**
- Hoàn thành quest → nhận ePoints
- Bỏ cuộc giữa chừng → mất ePoints
- ePoints dùng để unlock bài trắc nghiệm premium hoặc xóa cool-down

---

## Báo cáo Insight

Phân tích xu hướng cảm xúc dựa trên dữ liệu check-in lịch sử.

**Điều kiện mở khóa (7-Day Savoring Trigger):**
1. Hoàn thành tối thiểu **7 ngày check-in liên tục** với đầy đủ context
2. Ngày thứ 8: báo cáo Insight được mở khóa lần đầu miễn phí
3. Sau đó: 2 lần/tháng cho dữ liệu 30 ngày gần nhất (tính năng premium)

**Nội dung báo cáo:**
- Xu hướng dịch chuyển cảm xúc theo thời gian
- Pattern: vibe nào xuất hiện nhiều ở thời điểm nào / bối cảnh nào
- Gợi ý liên kết cảm xúc với context

**Nudge premium:** Khi tích tụ cảm xúc tiêu cực liên tục, Gin hiển thị eMonster bị bóng mờ → kích hoạt tâm lý sợ mất mát để chuyển đổi free → premium.

---

## Hồ sơ

- **eCV Radar**: Biểu đồ 4 trục tổng hợp từ kết quả trắc nghiệm
- **Tổng quan cảm xúc**: Timeline check-in, phân bố vibe
- **Streak**: Chuỗi ngày check-in liên tục
- **Cài đặt**: Ngôn ngữ (VI/EN), thông báo, sinh trắc học
- **Liên kết trường học**: Kết nối tài khoản B2C với tài khoản trường (B2B2C)
- **Nâng cấp hội viên**: Free → Premium

---

## Emotion Check-in (EN)

The core feature of Emotico. Students check in at least once per day to record their current emotional state.

**Full check-in flow:**
1. Select **primary vibe** from 5 emotion categories
2. Select **intensity** (3 levels: Light / Moderate / Extreme)
3. Select **secondary vibe** (optional) → triggers Blend Mode
4. Select **body markers** *(only shown for negative vibes)*
5. Enter **context**: Where · Doing what · With whom

**Quick check-in:** Skip steps 3–5, just vibe + intensity.

### 5 Emotion Vibes

> **UI note**: The interface does **not** use the Five Elements names (Kim/Mộc/Thủy/Hỏa/Thổ). Each vibe is labeled with descriptive emotion language for easy student recognition.

| Vibe | Display Name | Icon |
|---|---|---|
| Wood | Frustration & Anger | Thorns / Sprout |
| Fire | Joy & Excitement | Warming flame |
| Earth | Rejection & Brooding | Clay / Earth block |
| Metal | Sadness & Melancholy | Ore / Dull metal |
| Water | Anxiety & Fear | Water drop / Ice |

### Blend Mode

After choosing a primary vibe, users may select one secondary vibe. The combination produces a **derived emotion** from a 5×5 matrix (15 meaningful combinations). Each derived emotion has its own name, short description, and Gin mascot image.

### Post Check-in CTA Cards

| Card | Icon | Trigger |
|---|---|---|
| Dictionary | 📖 | Always shown |
| Quiz | 📝 | Overload ≥ 5 times / 7 days |
| 60-sec CBT | ⚡ | Negative ≥ 4 times / 7 days |

## Quiz & eCV Profile (EN)

### eCV Radar — 4 Axes

| Axis | Full Name | Assessments |
|---|---|---|
| MWB | Mental Well-being Baseline | DASS-21, PHQ-A, GAD-7 |
| CRE | Cognitive Regulation & Execution | Intellectual Wellness, SDQ |
| SBM | Social Boundary Mastery | Social Wellness, SCARED |
| CAFR | Future Readiness & Career Adaptability | Career Wellness, Savickas *(paid)* |

**Cooldowns:** PHQ-A/GAD-7/DASS-21 = 14 days · SDQ/SCARED = 30 days · Wellness/Career = 90 days

**Anti-cheat:** Negative check-in ≥ 5/week + "Normal" test result → `is_data_manipulated = TRUE` → eMonster locked, all 4 axes capped at 40%.

## CBT & Life Hacks (EN)

Two tabs:
- **Exercises** (activated on OVERLOAD): micro-step CBT tasks, 60s–3min each, with countdown timer and a jar-filling progress bar (from negative state back to Neutral)
- **Tips** (always open): practical life hack library

## Profile (EN)

- **eCV Radar**: 4-axis composite from quiz results
- **Emotion Overview**: Check-in timeline, vibe distribution
- **Streak**: Consecutive check-in days
- **Settings**: Language (VI/EN), notifications, biometrics
- **School Link**: Connect B2C account with school (B2B2C)
- **Membership Upgrade**: Free → Premium
