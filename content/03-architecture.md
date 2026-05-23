# Kiến trúc kỹ thuật / Technical Architecture

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

## Quyết định kỹ thuật

| Quyết định | Lý do |
|---|---|
| **Riverpod v3** thay vì Provider | Compile-time safety, không cần BuildContext, test dễ hơn |
| **Freezed v3** (sealed class) | Immutable models + exhaustive pattern matching tại compile time |
| Tách `emotico_core` / `emotico_data` | Core = pure Dart, không phụ thuộc Supabase SDK — dễ swap backend |
| **go_router ShellRoute** | 5-tab nav + `/checkin` standalone route không có bottom bar |
| `--dart-define` cho credentials | Secrets không bao giờ vào code hoặc git |
| **`gen_random_uuid()`** | Tương thích Supabase Cloud PG15 (không cần extension) |

---

## Current State — Supabase MVP

Emotico currently runs on **Supabase** (PostgreSQL + Auth + Storage) with a single database instance, using Row Level Security (RLS) to partition data by `school_id`. The Flutter app communicates through abstract repository interfaces defined in `emotico_core`, implemented in `emotico_data`.

## Target State — AWS Multi-Tenant

When AWS sponsorship is activated, the system migrates to a **Decentralized Multi-Tenant** model on AWS Organizations. Each of the 30 schools gets its own AWS Sub-Account with an isolated VPC, RDS PostgreSQL instance, and Auto Scaling. A Central Hub Lambda job pulls only anonymized, aggregated data weekly for system-wide trend reports — no PII ever leaves the school's account.

## Backend Lifecycle

The abstraction layer in `emotico_core` (abstract repository interfaces) makes the Flutter app fully backend-agnostic. Swapping Supabase for AWS — or reverting back — requires only changing the `ProviderScope.overrides` in `main.dart`, with zero changes to business logic or UI code.

## School-to-Personal Migration

When students graduate or a school contract expires, the Data Migration API clones the full emotional history to the student's personal B2C account, then hard-deletes all PII from the school partition, leaving only anonymous statistics for historical school reports.

## Tech Decisions

| Decision | Reason |
|---|---|
| **Riverpod v3** over Provider | Compile-time safety, no BuildContext dependency, better testability |
| **Freezed v3** (sealed class) | Immutable models + compile-time exhaustive pattern matching |
| `emotico_core` / `emotico_data` split | Core is pure Dart — zero Supabase dependency, easy to swap |
| **go_router ShellRoute** | 5-tab navigation + standalone `/checkin` without bottom bar |
| `--dart-define` for credentials | Secrets never enter code or git history |
| **`gen_random_uuid()`** | Compatible with Supabase Cloud PG15 (no extension needed) |
