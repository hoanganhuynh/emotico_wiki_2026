# Kiến trúc kỹ thuật

## Trạng thái hiện tại — Supabase MVP

Emotico hiện đang chạy trên **Supabase** (PostgreSQL + Auth + Storage) với một single database instance, sử dụng Row Level Security (RLS) để phân vùng dữ liệu theo `school_id`.

```
Flutter App (emotico_app)
    │
    ├── emotico_core     ← Domain models + abstract interfaces (pure Dart)
    ├── emotico_ui       ← Design system: colors, typography, widgets
    └── emotico_data     ← Supabase implementations
            │
            └── Supabase Cloud
                    ├── Auth (email/password)
                    ├── PostgreSQL
                    └── Storage (avatars)
```

**Schema chính:**

| Bảng | Mô tả |
|---|---|
| `profiles` | User data + school_id, subscription_tier, checkin_streak |
| `schools` | Tenant registry (tên trường, contract dates) |
| `emotions` | Emotion dictionary (seed: 10 emotions) |
| `emotion_entries` | Check-in records (owner-only RLS) |
| `quizzes` / `quiz_questions` / `quiz_results` | Quiz system |
| `quests` / `user_quests` | Quest/challenge system |

---

## Trạng thái mục tiêu — AWS Multi-Tenant

Khi AWS sponsorship được kích hoạt, hệ thống chuyển sang mô hình **Decentralized Multi-Tenant** trên AWS Organizations.

```
         ┌─────────────────────────────────┐
         │      EMOTICO CENTRAL HUB        │
         │  AWS Lambda + Core DB + KMS     │
         │  (Báo cáo ẩn danh toàn hệ thống)│
         └──────────────┬──────────────────┘
                        │ weekly anonymized pull
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ AWS: TRƯỜNG A│ │ AWS: TRƯỜNG B│ │ AWS: TRƯỜNG C│
│ Sub-Account  │ │ Sub-Account  │ │ Sub-Account  │
│ VPC + RDS PG │ │ VPC + RDS PG │ │ VPC + RDS PG │
│ Auto Scaling │ │ Auto Scaling │ │ Auto Scaling │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Mỗi trường = 1 AWS Sub-Account độc lập:**
- VPC riêng — không trường nào truy cập được data của trường khác
- RDS PostgreSQL (small) chứa toàn bộ data học sinh của trường
- EC2 Auto Scaling tự phình to khi học sinh check-in đồng loạt
- KMS key riêng, rotate tự động 30 ngày

**Central Hub (Emotico):**
- Lambda weekly job — lấy data ẩn danh từ các trường
- Core DB — tổng hợp xu hướng cảm xúc toàn hệ thống
- Không lưu PII (Personally Identifiable Information) tại Hub

---

## Vòng đời Backend

```
Supabase MVP (hiện tại — 2026)
    │
    │  AWS EdTech sponsorship approve
    ▼
AWS per-school (~2 năm tài trợ)
    │
    │  Sponsorship kết thúc
    ▼
Supabase hoặc self-hosted PostgreSQL
```

**Kiến trúc reversible:** Flutter app hoàn toàn không biết backend là gì. Swap backend = chỉ thay `ProviderScope.overrides` trong `main.dart`.

---

## School-to-Personal Migration

Khi học sinh tốt nghiệp hoặc hết hạn hợp đồng trường:

1. Học sinh đã liên kết email cá nhân trong thời gian học
2. Hệ thống chuyển status → `CONVERTED_TO_PERSONAL`
3. Data Migration API nhân bản toàn bộ lịch sử cảm xúc sang phân vùng B2C
4. Hard delete PII tại phân vùng trường (giữ anonymous stats cho báo cáo lịch sử)

---

## Web apps — Next.js (apps/landing, apps/admin)

Ngoài Flutter app cho học sinh, monorepo `emotico2026` còn có hai web app Next.js dùng chung Supabase project:

| App | Vai trò | Route đáng chú ý |
|---|---|---|
| `apps/landing` | Website công khai (marketing, chatbot cho GV/PH, Bách khoa Tâm lý học) | `/bach-khoa`, `/bach-khoa/[slug]`, `/bach-khoa/tac-gia`, `/bach-khoa/tac-gia/[slug]`, `/bach-khoa/chu-de/[domain]`, `/bach-khoa/phuong-phap` |
| `apps/admin` | Dashboard nội bộ (school admin + biên tập nội dung) | `/dashboard/encyclopedia` |

Cả hai deploy qua Vercel (`vercel.json` ở root mỗi app).

Chuẩn biên tập/kiến trúc nội dung đầy đủ cho Bách khoa (ma trận domain × entry-type, khung bài, nhãn bằng chứng A/B, và bảng đối chiếu tình trạng triển khai) xem [Bách khoa — Kiến trúc nội dung](/wiki-internal/12-bach-khoa-editorial).

### Schema Bách khoa (encyclopedia_*)

Bổ sung từ các migration `20260823000001_encyclopedia_foundation.sql` → `20260824012026_encyclopedia_admin_workflows.sql` (nhánh `update-landing-page`, chưa merge vào `main` tính đến 2026-08-24):

| Bảng | Mô tả |
|---|---|
| `encyclopedia_people` | Tác giả/thẩm định — `role` (author/reviewer/both), `is_public` |
| `encyclopedia_articles` | Bài viết — `status` (draft/in_review/published/retired), `domain_code`, `entry_type_code`, `sections` (jsonb, nhiều khối heading+body), `evidence_strength` (A1–A5), `author_id`/`reviewer_id`, `published_at`, `review_due_at` |
| `encyclopedia_article_aliases` | Slug cũ redirect sang slug hiện tại |
| `encyclopedia_citations` | Nguồn tham khảo — nay có thêm `doi`, `source_type`, `publication_year`, `is_verified` |
| `encyclopedia_change_log` | Audit trail nội bộ — nay có thêm `change_type`, `detail` (jsonb) |

CHECK constraint chặn `status = 'published'` nếu thiếu `author_id`/`reviewer_id`/`published_at`/`review_due_at`, hoặc `plain_summary` không nằm trong khoảng 80–120 từ.

RLS: public chỉ đọc được các bảng trên khi bài viết liên quan có `status = 'published'` (và người có `is_public = true`); `is_admin()` có full CRUD trên cả 5 bảng.

**Ghi chú kỹ thuật (2026-08-24):** `apps/landing/lib/encyclopedia/repository.ts` hiện chưa select các cột `doi`/`source_type`/`publication_year`/`is_verified` từ `encyclopedia_citations`. Vì vậy dù Admin đã nhập các trường này, dòng DOI và badge "Đã kiểm tra" trên trang public chưa hiển thị được — cần đối chiếu lại trước khi phát hành.

---

## Quyết định kỹ thuật

| Quyết định | Lý do |
|---|---|
| **Riverpod v3** thay vì Provider | Compile-time safety, không cần BuildContext, test dễ hơn |
| **Freezed v3** (sealed class) | Immutable models + exhaustive pattern matching tại compile time |
| Tách `emotico_core` / `emotico_data` | Core = pure Dart, không phụ thuộc Supabase SDK — dễ swap backend |
| **go_router ShellRoute** | 5-tab nav + `/checkin` standalone route không có bottom bar |
| `--dart-define` cho credentials | Secrets không bao giờ vào code hoặc git |
| **`gen_random_uuid()`** | Tương thích Supabase Cloud PG15 (không cần extension) |
