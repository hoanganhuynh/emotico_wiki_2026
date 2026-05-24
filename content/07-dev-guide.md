# Developer Guide

> Tài liệu này dành cho developer mới join dự án Emotico. Đọc từ đầu đến cuối mất khoảng 15 phút.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Mobile framework | Flutter | 3.44.0 |
| Language | Dart | 3.12.0 |
| State management | flutter_riverpod | ^3.3.1 |
| Models | freezed | ^3.0.0 |
| Serialization | json_serializable | latest |
| Navigation | go_router | ^17.2.3 |
| Backend | supabase_flutter | ^2.9.1 |
| Monorepo tool | Melos | 7.7.0 |

---

## Cấu trúc Monorepo

```
emotico-2026/                 ← private repo: github.com/hoanganhuynh/emotico2026
├── packages/
│   ├── emotico_core/         ← Domain models + abstract repo interfaces (pure Dart)
│   ├── emotico_ui/           ← Design system: colors, typography, shared widgets
│   ├── emotico_data/         ← Supabase implementations of emotico_core interfaces
│   └── emotico_sdk/          ← Future: SSO OAuth2 bridge for school apps (skeleton)
├── apps/
│   ├── emotico_app/          ← Main student app
│   ├── design_system/        ← Flutter web catalog (source → builds to emotico.wiki/design-system)
│   └── white_label_template/ ← Future: school white-label (skeleton)
├── supabase/
│   └── migrations/           ← SQL migration files
└── docs/
    └── superpowers/          ← Internal specs and implementation plans

emotico_wiki_2026/            ← public repo: github.com/hoanganhuynh/emotico_wiki_2026
                              ← deployed to emotico.wiki via Vercel
```

**Nguyên tắc phân tách:**
- `emotico_core` — không import bất kỳ Flutter/Supabase package nào. Pure Dart.
- `emotico_data` — implement các interface từ `emotico_core` bằng Supabase
- `apps/emotico_app` — inject implementations qua `ProviderScope.overrides`

---

## Setup

### 1. Flutter SDK

```bash
# Flutter SDK được pin tại path cố định trên máy dev
export PATH="$PATH:/Volumes/My Passport/Claude Pro/.flutter-sdk/flutter-stable/bin"
flutter --version
# Flutter 3.44.0 • Dart 3.12.0
```

### 2. Melos (monorepo tool)

```bash
dart pub global activate melos
melos bootstrap
# Installs all dependencies và links local packages với nhau
```

### 3. Code generation

```bash
melos run generate
# Chạy build_runner trên tất cả packages (freezed + json_serializable)
```

---

## Chạy App

Credentials được inject qua `--dart-define`. **Không bao giờ** hardcode vào code.

```bash
flutter run \
  --dart-define=SUPABASE_URL=https://<project-ref>.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=<anon-key>
```

Xin credentials từ lead dev. Không có credentials thì app crash khi khởi động.

---

## Key Patterns

### 1. Freezed Models ��� dùng `sealed class`

```dart
// ✅ ĐÚNG — Freezed v3 yêu cầu 'sealed class'
@freezed
sealed class User with _$User {
  const factory User({
    required String id,
    required String email,
    @Default('student') String role,
    @Default('vi') String languagePref,
  }) = _User;
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

// ❌ SAI — compile error với Freezed v3
class User with _$User { ... }
```

### 2. Repository Pattern

```dart
// emotico_core — chỉ định nghĩa interface, không import Supabase
abstract interface class AuthRepository {
  User? get currentUser;
  Future<User> signIn({required String email, required String password});
  Future<void> signOut();
}

// emotico_data — implement với Supabase
class SupabaseAuthRepository implements AuthRepository {
  final SupabaseClient _client;
  SupabaseAuthRepository(this._client);

  @override
  Future<User> signIn({required String email, required String password}) async {
    final res = await _client.auth.signInWithPassword(email: email, password: password);
    return _fetchProfile(res.user!.id, email);
  }
}

// apps/emotico_app/lib/main.dart — inject
ProviderScope(
  overrides: [
    authRepositoryProvider.overrideWithValue(
      SupabaseAuthRepository(Supabase.instance.client),
    ),
  ],
  child: const EmoticoApp(),
)
```

### 3. Snake-to-Camel cho Enums từ DB

```dart
// packages/emotico_data/lib/src/util/snake_to_camel.dart
String snakeToCamel(String snake) {
  final parts = snake.split('_');
  return parts.first +
      parts.skip(1).map((p) => p[0].toUpperCase() + p.substring(1)).join();
}

// Dùng khi parse DB enum string:
// 'single_choice' → 'singleChoice' → QuizQuestionType.singleChoice
final type = QuizQuestionType.values.byName(snakeToCamel(row['question_type']));
```

### 4. JsonEnum cho Enum Serialization

```dart
@JsonEnum(fieldRename: FieldRename.snake)
enum EmotionElement { wood, fire, earth, metal, water }
// DB 'wood' → EmotionElement.wood, serialize ngược lại đúng tự động
```

---

## Test Commands

```bash
# Core models + providers (pure Dart, nhanh)
dart test packages/emotico_core

# Data layer (cần flutter runner vì supabase_flutter có Flutter deps)
flutter test packages/emotico_data

# Widget tests cho app
flutter test apps/emotico_app

# Analyze toàn bộ monorepo
melos run analyze
```

---

## Database & Migrations

```bash
# Apply migrations lên Supabase cloud
supabase db push --project-ref <project-ref>

# Migration files:
supabase/migrations/
  20260523000001_initial_schema.sql     ← profiles, emotions, emotion_entries, quizzes, quests
  20260523000002_seed_emotions.sql      ← 10 sample emotions (5 positive, 5 negative)
  20260523000003_add_schools_and_tenant_fields.sql  ← multi-tenancy fields
```

**Lưu ý quan trọng khi viết migrations:**
- Dùng `gen_random_uuid()` — **không** dùng `uuid_generate_v4()` (không tương thích PG15)
- Mọi bảng đều có RLS enabled — luôn test với authenticated user
- `emotion_entries` chỉ owner mới đọc/ghi được (owner-only RLS)

---

## Design System

Xem đầy đủ tại [emotico.wiki/design-system](https://emotico.wiki/design-system).

```dart
// packages/emotico_ui/lib/src/theme/colors.dart — canonical names
EmoticoColors.primary         // #FFB223 (cam vàng — brand)
EmoticoColors.background      // #FAFAF9 (nền sáng)
EmoticoColors.surface         // #F5F5F4
EmoticoColors.textPrimary     // #1C1917
EmoticoColors.textSecondary   // #57534E
EmoticoColors.success         // #22C55E
EmoticoColors.error           // #E53E3E
EmoticoColors.warning         // #EAB308

// Five Elements — Ngũ Hành (mỗi element có 3 shade: Light / base / Dark)
EmoticoColors.elementWood     // #22C55E  — Mộc
EmoticoColors.elementFire     // #F97316  — Hỏa
EmoticoColors.elementEarth    // #EAB308  — Thổ
EmoticoColors.elementMetal    // #94A3B8  — Kim
EmoticoColors.elementWater    // #3B82F6  — Thủy

// packages/emotico_ui/lib/src/theme/typography.dart
// MomoTrustDisplay  — displayLarge (36px), displayMedium (28px), headlineLarge (22px)
// PlusJakartaSans   — headlineMedium (18px), bodyLarge (16px), bodyMedium (14px),
//                     labelLarge (14px w600), labelMedium (12px w600), caption (11px)
```

---

## Navigation Map

```
/                     → redirect based on auth state
/onboarding           → OnboardingScreen (first launch)
/login                → LoginScreen
/signup               → SignupScreen
/forgot-password      → ForgotPasswordScreen
/checkin              → CheckinScreen (standalone, no bottom nav)
/shell                → MainShell (5-tab bottom nav)
  /home               → HomeScreen
  /dictionary         → DictionaryListScreen
    /dictionary/:id   → DictionaryDetailScreen
  /quiz               → QuizListScreen
    /quiz/:id         → QuizPlayScreen
    /quiz/:id/result  → QuizResultScreen
  /quest              → QuestScreen
  /profile            → ProfileScreen
    /profile/edit     → EditProfileScreen
```

---

## Onboarding Checklist

- [ ] Clone repo và setup Flutter SDK path (xem mục Setup)
- [ ] Chạy `melos bootstrap`
- [ ] Xin Supabase credentials từ lead dev
- [ ] Chạy app: `flutter run --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...`
- [ ] Đọc `packages/emotico_core/lib/src/` — models + repository interfaces
- [ ] Đọc `apps/emotico_app/lib/app/router.dart` — navigation map
- [ ] Chạy full test suite và đảm bảo pass:
  ```bash
  dart test packages/emotico_core
  flutter test packages/emotico_data
  flutter test apps/emotico_app
  ```
- [ ] Đọc spec liên quan tại `docs/superpowers/specs/` trước khi build tính năng mới
