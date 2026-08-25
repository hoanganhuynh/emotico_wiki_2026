# Chuẩn nội dung & tài nguyên

## Trước khi xuất bản

Mỗi hướng dẫn dành cho người dùng cần trả lời: nội dung này giúp ích gì, dùng như thế nào, điều gì xảy ra tiếp theo và có thể tìm hỗ trợ ở đâu.

## Hình minh họa

* Dùng ảnh màn hình cho thao tác thực tế; dùng infographic cho khái niệm hoặc hành trình hỗ trợ.
* Mọi hình đều cần alt text và chú thích ngắn giải thích người xem cần chú ý điều gì.
* Không đưa dữ liệu cá nhân, thông tin nhạy cảm hoặc chi tiết kỹ thuật lên ảnh public.

## Bằng chứng và cập nhật

Mọi khẳng định khoa học hoặc pháp lý cần dẫn tới nguồn đã được đội ngũ kiểm tra. Khi lưu một phiên bản, ghi chú thay đổi tối đa 200 ký tự và viết theo điều người đọc cần biết.

**Ví dụ áp dụng — Bách khoa Tâm lý học:** đây là chuẩn đang được thực thi một phần ở cấp database cho `encyclopedia_articles` — mỗi bài có `evidence_strength` (Nhãn A, A1–A5), ít nhất một nguồn trong `encyclopedia_citations` (loại nguồn, năm xuất bản, đã kiểm tra hay chưa), người biên soạn và người thẩm định riêng biệt, cùng `review_due_at` để nhắc rà soát định kỳ. Mọi thay đổi được ghi vào `encyclopedia_change_log`.

Spec biên tập đầy đủ v2 (ma trận domain × entry-type, khung bài 12 khối, Nhãn B cho biện pháp can thiệp — **hiện chưa có field trong DB**, chuẩn SEO/AI-citation) đã được tóm tắt tại [Bách khoa — Kiến trúc nội dung](/wiki-internal/12-bach-khoa-editorial), kèm bảng đối chiếu phần nào đã/chưa triển khai so với code thực tế.

## Danh bạ cơ sở hỗ trợ (phòng khám/cơ sở tư vấn)

Danh sách cơ sở trên trang `/clinics` (bảng `clinics`) được **rà soát và cập nhật mỗi 3 tháng một lần**:

* **Rà soát cơ sở hiện có** — kiểm tra từng dòng còn hoạt động, đã giải thể, hay đã chuyển đổi địa chỉ/số điện thoại; sửa hoặc gỡ (`is_active = false`) những cơ sở không còn chính xác.
* **Tìm và bổ sung cơ sở mới** — cơ sở mới thành lập, hoặc cơ sở hiện có mới mở thêm chi nhánh, được thêm vào danh bạ qua `/dashboard/clinics`.

**Khác với** rà soát giấy phép hoạt động (`licence_verified_at`/`licence_expires_at`, chu kỳ tối đa 6 tháng, ràng buộc 1 & 7 của đặc tả Wellness §6.1.2 — cơ sở hết hạn giấy phép tự động biến mất khỏi danh bạ công khai ở tầng dữ liệu). Rà soát 3 tháng ở đây là kiểm tra **thông tin cơ sở** (còn tồn tại, đúng địa chỉ, đủ danh sách); rà soát 6 tháng là kiểm tra **giấy phép**. Hai chu kỳ độc lập, không thay thế nhau — một cơ sở có thể còn giấy phép hợp lệ nhưng đã đổi địa chỉ, hoặc còn đúng địa chỉ nhưng giấy phép sắp hết hạn.
