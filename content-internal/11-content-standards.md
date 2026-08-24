# Chuẩn nội dung & tài nguyên

## Trước khi xuất bản

Mỗi hướng dẫn dành cho người dùng cần trả lời: nội dung này giúp ích gì, dùng như thế nào, điều gì xảy ra tiếp theo và có thể tìm hỗ trợ ở đâu.

## Hình minh họa

* Dùng ảnh màn hình cho thao tác thực tế; dùng infographic cho khái niệm hoặc hành trình hỗ trợ.
* Mọi hình đều cần alt text và chú thích ngắn giải thích người xem cần chú ý điều gì.
* Không đưa dữ liệu cá nhân, thông tin nhạy cảm hoặc chi tiết kỹ thuật lên ảnh public.

## Bằng chứng và cập nhật

Mọi khẳng định khoa học hoặc pháp lý cần dẫn tới nguồn đã được đội ngũ kiểm tra. Khi lưu một phiên bản, ghi chú thay đổi tối đa 200 ký tự và viết theo điều người đọc cần biết.

**Ví dụ áp dụng — Bách khoa Tâm lý học:** đây là chuẩn đang được thực thi ở cấp database cho `encyclopedia_articles` — mỗi bài có `evidence_strength` (A1–A5), ít nhất một nguồn trong `encyclopedia_citations` (loại nguồn, năm xuất bản, đã kiểm tra hay chưa), người biên soạn và người thẩm định riêng biệt, cùng `review_due_at` để nhắc rà soát định kỳ. Mọi thay đổi được ghi vào `encyclopedia_change_log`. Xem chi tiết schema tại [Kiến trúc kỹ thuật](03-architecture.md#schema-bách-khoa-encyclopedia_).
