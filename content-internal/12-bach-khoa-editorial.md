# Bách khoa Tâm lý học — Kiến trúc nội dung & Chuẩn xuất bản (v2)

> Tóm tắt spec **"BÁCH KHOA EMOTICO — KIẾN TRÚC NỘI DUNG & CHUẨN XUẤT BẢN v2"** do sếp gửi 2026-08-23, thay thế định vị "Từ điển v1". Trang này giữ các bảng tham chiếu chính cho đội biên tập/dev, kèm **tình trạng triển khai thực tế** đối chiếu với code tại 2026-08-24.

---

## Thay đổi định vị (v1 → v2)

| Hạng mục | v1 (Từ điển) | v2 (Bách khoa) |
|---|---|---|
| Bề mặt chính | Trong ứng dụng | Web công khai, ứng dụng là bề mặt phụ |
| Người đọc chính | Học sinh dùng app | Người tìm kiếm Google + mô hình AI khi dẫn nguồn |
| Văn phong | Bốn chế độ theo tuổi | Một chuẩn khoa học duy nhất + khối "Tóm tắt" 80–120 từ thay cho phân tầng tuổi |
| Đơn vị nội dung | Mục từ tra cứu | Bài bách khoa có tác giả, có tham chiếu, có phiên bản |
| Thước đo thành công | Lượt tra cứu trong app | Thứ hạng thực thể + tần suất được AI trích dẫn |

Ba nguyên tắc cứng đi kèm: (1) không quay lại phân tầng tuổi — dùng khối Tóm tắt; (2) được giải thích khái niệm lâm sàng ở cấp bách khoa nhưng cấm mọi hình thức tự chẩn đoán; (3) đây là chủ đề YMYL (Google) — bắt buộc tác giả/thẩm định có tên thật + bằng cấp công khai, và cấm sản xuất hàng loạt bằng AI cho bản xuất bản cuối.

---

## Ma trận Lĩnh vực × Loại mục từ

### Trục 1 — 10 lĩnh vực (domain_code)

`COG` Nhận thức & phán đoán · `AFF` Cảm xúc & điều tiết · `MOT` Động lực & ý chí · `BEH` Hành vi & học tập · `NEU` Thần kinh & sinh lý · `DEV` Phát triển qua vòng đời · `SOC` Xã hội & liên cá nhân · `PER` Nhân cách & bản sắc · `CUL` Văn hoá & xã hội học · `APP` Ứng dụng & lâm sàng

### Trục 2 — 10 loại mục từ (entry_type_code)

`CNC` Khái niệm nền tảng (Khung A) · `BIA` Thiên kiến nhận thức (Khung A) · `EFF` Hiệu ứng & hiện tượng (Khung A) · `STA` Trạng thái & cảm xúc (Khung A rút gọn) · `THR` Mô hình & lý thuyết (Khung B) · `EXP` Nghiên cứu kinh điển (Khung C) · `MTH` Phương pháp & can thiệp (Khung D) · `INS` Công cụ đo lường (Khung D rút gọn) · `PER` Nhân vật & trường phái (Khung E) · `NEO` Thuật ngữ mới/thuật ngữ mạng (Khung F)

Mỗi bài mang đúng một domain chính + một entry type; domain phụ chỉ dùng cho liên kết chéo, không tạo URL riêng. Ma trận 10×10 = 100 ô, dùng để lập kế hoạch biên tập, không phải giao diện người dùng.

### Cấu trúc phân tầng trang

Trang trụ (10, một/lĩnh vực, 2.500–4.000 từ) → Trang chùm (40–60, chủ đề trung gian) → Bài mục từ (kho mở, 900–1.800 từ) → Trang thực thể (thí nghiệm/công cụ/nhân vật). Một khái niệm = một URL chuẩn; tên khác/từ đồng nghĩa là alias trỏ về, không tạo trang riêng.

---

## Khung bài chuẩn — Khung A (≈70% số bài: CNC/BIA/EFF/STA)

12 khối bắt buộc theo thứ tự: (1) Định nghĩa chuẩn — một câu 25–40 từ · (2) Tóm tắt — 80–120 từ, không thuật ngữ chưa giải thích · (3) Tên gọi & xuất xứ thuật ngữ · (4) Cơ chế (ghi rõ "được đề xuất" hay "đã xác lập") · (5) Bằng chứng thực nghiệm (≥1 nghiên cứu gốc, có độ lớn hiệu ứng, bắt buộc nêu kết quả lặp lại thất bại nếu có) · (6) Biểu hiện & ví dụ minh hoạ (≥2, có bối cảnh Việt Nam) · (7) Bối cảnh xuất hiện (chỉ ghi khi có dẫn chứng) · (8) Can thiệp có bằng chứng (mỗi biện pháp kèm Nhãn B + nguồn) · (9) Giới hạn & tranh luận · (10) Khái niệm liên quan (Liên quan/Dễ nhầm/Đối lập) · (11) Tài liệu tham khảo (APA 7, ≥4 nguồn, ≥2 nguồn sơ cấp) · (12) Thông tin biên tập (tác giả, thẩm định, ngày xuất bản/cập nhật, kỳ rà soát, nhật ký thay đổi).

Khung B (`THR`), C (`EXP`), D (`MTH`/`INS`), E (`PER`), F (`NEO`) thay thế khối 4–8 bằng bộ khối riêng phù hợp loại mục từ — xem bản gốc PDF/MD sếp gửi để biết chi tiết từng khung.

---

## Hai nhãn bằng chứng (bắt buộc, độc lập, hiển thị công khai)

**Nhãn A — Độ vững của hiện tượng** (`evidence_strength`, 1/bài): A1 Đã xác lập · A2 Có ủng hộ · A3 Còn tranh luận · A4 Bằng chứng yếu · A5 Đã bị phản bác (vẫn xuất bản, đổi cấu trúc thành "điều thường được kể → nghiên cứu gốc → chuyện gì khi lặp lại → phần nào còn đúng → vì sao vẫn lan truyền").

**Nhãn B — Mức bằng chứng của biện pháp can thiệp** (1/biện pháp trong khối 8, KHÔNG phải 1/bài): B1 Phân tích tổng hợp/tổng quan hệ thống · B2 RCT chất lượng tốt · B3 Có đối chứng không ngẫu nhiên · B4 Nghiên cứu đơn lẻ/cỡ mẫu nhỏ · B5 Suy luận lý thuyết (bắt buộc ghi "chưa được kiểm chứng trực tiếp"). Không nhãn B → không được xuất bản biện pháp đó. Không trình bày biện pháp như phương pháp điều trị ("liên quan đến giảm Y", không phải "hãy làm X để chữa Y").

---

## Hai làn cập nhật nội dung

| Làn | Nội dung | Nhịp | Thời gian phát hiện → xuất bản |
|---|---|---|---|
| Làn nền | Bài theo kế hoạch ma trận 10×10 | 5–6 bài/tuần | Theo lịch biên tập |
| Làn nhanh | Thuật ngữ lan truyền, nghiên cứu mới, khái niệm mới | 1–3 bài/tuần | ≤ 72 giờ |

Khung F (`NEO`) bắt buộc có trường phân loại "Đây có phải khái niệm khoa học không" (Có, là thuật ngữ chuyên ngành / Là cách gọi đại chúng của khái niệm có thật / Chưa tương ứng khái niệm nào) — đây là câu AI sẽ trích khi người dùng hỏi kiểu "brain rot có thật không".

Vòng đời: xuất bản → rà soát định kỳ (`CUL`/`NEO`/`APP`: 12 tháng · lĩnh vực khác: 24 tháng) → cập nhật có nhật ký công khai → nếu bị bác bỏ, chuyển cấu trúc A5, **không xoá URL**.

---

## Chuẩn SEO / trích dẫn AI bắt buộc mỗi bài

URL `/bach-khoa/{slug}` cố định · câu định nghĩa đứng đầu bài, không có câu dẫn nhập trước · H2 theo đúng thứ tự khối · JSON-LD `DefinedTerm` trong `DefinedTermSet` + `Article`/`author`/`reviewedBy`/`datePublished`/`dateModified`/`citation`/`FAQPage` khi phù hợp (không dùng schema y tế) · `sameAs` trỏ Wikidata QID + APA Dictionary · ≥5 liên kết ra, ≥3 liên kết vào, luôn liên kết lên trang chùm/trụ · trích dẫn dạng văn bản thuần có DOI · render phía server (AI crawler không đọc được nội dung client-rendered).

Ranh giới nội dung công khai: được giải thích khái niệm lâm sàng ở cấp bách khoa + nêu tiêu chuẩn chẩn đoán như dữ kiện học thuật (ghi rõ chỉ chuyên gia áp dụng); **không** được liệt kê "dấu hiệu bạn đang bị X", không trắc nghiệm tự chấm điểm, không khuyến nghị điều trị cá nhân, không đăng nguyên văn thang đo có bản quyền. Bài `APP` và bài chạm chủ đề nhạy cảm: khối liên hệ hỗ trợ ở **đầu bài**; cấm eMascot/gamification và mọi nút dẫn vào luồng đánh giá.

---

## Tình trạng triển khai thực tế (đối chiếu code, 2026-08-24)

Đội đã dựa vào bản spec này để xây trang Bách khoa hiện tại (nhánh `update-landing-page`, chưa merge `main`). Đối chiếu trực tiếp với code:

| # | Hạng mục spec | Tình trạng | Bằng chứng |
|---|---|---|---|
| 1 | Ma trận domain × entry-type (10×10, đúng mã) | ✅ Đã có | CHECK constraint liệt kê đúng cả 10+10 mã trong `20260823000001_encyclopedia_foundation.sql` |
| 2 | Nhãn B (B1–B5) cho từng biện pháp can thiệp | ❌ Chưa có | Không có cột nào trong schema; chỉ có câu mô tả trên `/bach-khoa/phuong-phap` ("bài phải có nhãn B và nguồn phù hợp") — chưa có field thật đứng sau |
| 3 | Khung A — 12 khối cố định | ❌ Chưa có | `sections` là danh sách heading+body tự do, chỉ có gợi ý chung chung trong admin, không có template/validation theo 12 khối |
| 4 | Khung B/C/D/E/F riêng theo `entry_type_code` | ❌ Chưa có | Admin hiển thị đúng một bộ field cho mọi loại mục từ; trang public chỉ hiển thị `entry_type` như badge, không đổi cấu trúc hiển thị |
| 5 | Trang trụ / trang chùm / trang thực thể | 🟡 Một phần | `/bach-khoa/chu-de/[domain]` tồn tại nhưng là danh sách lọc + một câu tĩnh, chưa phải bài trụ 2.500–4.000 từ; chưa có trang chùm hay trang thực thể cho `EXP`/`INS`/`PER` (ngoài hồ sơ tác giả) |
| 6 | Trang "Phương pháp biên soạn" (P0) | ✅ Đã có | `/bach-khoa/phuong-phap` — trang đầy đủ 185 dòng, có quy trình 3 bước, 4 nguyên tắc, giải thích nhãn A–B |
| 7 | Kỳ rà soát mặc định theo domain (12/24 tháng) | ❌ Chưa có | `review_due_at` chỉ là ô chọn ngày tự do, không có logic auto-fill theo domain |
| 8 | Schema.org đầy đủ (`DefinedTermSet`, `FAQPage`, `sameAs`/Wikidata) | 🟡 Một phần | Đã có `DefinedTerm`, `Article` + `author`/`reviewedBy`/`datePublished`/`dateModified`/`citation`; thiếu `DefinedTermSet`, `FAQPage`, `sameAs` |
| 9 | `llms.txt` / sitemap riêng / RSS làn nhanh | 🟡 Một phần | Có `llms.txt` và bài Bách khoa đã nằm trong sitemap chung; chưa có sitemap riêng hay RSS |
| 10 | Alias/redirect URL chuẩn | ✅ Đã có | `encyclopedia_article_aliases` + `permanentRedirect` khi truy cập alias |

**Đọc nhanh:** phần hạ tầng nền (schema phân loại, alias, trang phương pháp, JSON-LD cơ bản) đã bám khá sát spec. Phần biên tập sâu — nhãn B, khung 12 khối, khung riêng theo loại mục từ, kỳ rà soát tự động, trang trụ thật — **chưa triển khai**, cần quyết định có làm tiếp ở đợt sau hay tạm chấp nhận phiên bản rút gọn.

---

## Bảy việc cần quyết (từ spec sếp, chưa có cập nhật quyết định)

1. 🔴 Chốt hai người thẩm định chuyên môn có học vị, đồng ý ký tên công khai — chặn toàn bộ giai đoạn P1
2. 🔴 Duyệt ranh giới nội dung lâm sàng trên bề mặt công khai (mục "Ranh giới nội dung" ở trên)
3. 🔴 Duyệt hai hệ nhãn bằng chứng A/B là trường bắt buộc, hiển thị công khai
4. 🔴 Xác nhận trang bách khoa render phía máy chủ, không phụ thuộc JavaScript
5. 🟡 Quyết định khối "Tóm tắt" thay cho bốn biến thể theo tuổi
6. 🟡 Chọn tên miền chủ cho bách khoa và cách phân vai với domain nội dung còn lại
7. 🟡 Chốt quy tắc dùng AI trong quy trình biên soạn, ghi minh bạch trên trang Phương pháp

---

*Nguồn: "BÁCH KHOA EMOTICO — KIẾN TRÚC NỘI DUNG & CHUẨN XUẤT BẢN v2", sếp gửi 2026-08-23. Xem thêm [Kiến trúc kỹ thuật](/wiki-internal/03-architecture#schema-bch-khoa-encyclopedia_) và [Chuẩn nội dung](/wiki-internal/11-content-standards).*
