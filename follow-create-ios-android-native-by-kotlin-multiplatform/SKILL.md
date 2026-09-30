---
name: follow-create-ios-android-native-by-kotlin-multiplatform
description: สร้าง native iOS+Android app เดียวด้วย Kotlin Multiplatform และ Compose Multiplatform
argument-hint: "[project-name]"
related:
  - follow-create-web
  - follow-lang-kotlin
  - deep-review
  - follow-create-mobile
  - follow-create-mobile-cross-with-capacitor
  - ask-me
---

## Goal

สร้าง native mobile app สำหรับ iOS และ Android จาก codebase Kotlin เดียวด้วย Kotlin Multiplatform (KMP) และ Compose Multiplatform ตาม best practices — business logic, networking, storage และ UI แชร์ได้สูงสุดผ่าน `shared` module

## Scope

- ใช้สร้าง app iOS+Android ใหม่ที่ต้องการ native performance + shared Kotlin code (แทนการเขียน Swift+Kotlin แยกสองทีม)
- ครอบคลุม setup, project structure (KMP modules), Compose Multiplatform UI, expect/actual, build, test และ deploy ทั้งสอง store
- ใช้ Android Studio เป็น primary IDE (ต้องมี Xcode สำหรับ iOS target — macOS only)

- Packages: Kotlin, KMP plugin, Compose Multiplatform, AGP, Gradle — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชัน KMP, Compose Multiplatform, Kotlin, AGP และ breaking changes ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
2. บันทึกเหตุผลที่เลือก KMP แทน native แยกหรือ Capacitor สำหรับ reference ต่อไป

### 2. Gather Requirements

> Goal: เข้าใจ scope ของ app

1. รับ project name, package name (เช่น `com.example.app`), min SDK (Android) และ deployment target (iOS)
2. ระบุ features, screens, navigation pattern
3. ระบุ shared vs platform-specific code: networking (Ktor), storage (SQLDelight/DataStore), DI (Koin)
4. ตัดสินใจ shared UI (Compose Multiplatform ทั้งสอง platform) หรือ shared logic เท่านั้น (iOS ใช้ SwiftUI ห่อ `shared` module)
5. ถ้าไม่ชัด → ใช้ `/ask-me`

### 3. Verify Environment

> Goal: ตรวจสอบสภาพแวดล้อมก่อนสร้าง

1. ตรวจสอบ Android Studio เวอร์ชันล่าสุดที่รองรับ KMP (เช็คด้วย `/deep-research` — minimum Otter 2025.2.1)
2. ตรวจสอบ JDK 21 หรือสูงกว่า และ Kotlin Multiplatform plugin ใน Android Studio
3. สำหรับ iOS target: ตรวจสอบ Xcode >= 26.0 (macOS เท่านั้น — Windows build ได้เฉพาะ Android/desktop)
4. ตรวจสอบ `kdoctor` (`brew install kdoctor` หรือ `scoop install kdoctor`) — run `kdoctor` ยืนยัน env ครบ

### 4. Create Project

> Goal: สร้าง KMP project ด้วย template ที่เหมาะสม

1. ใช้ Kotlin Multiplatform Wizard (`kmp.jetbrains.com`) หรือ Android Studio > New Project > Kotlin Multiplatform App
2. เลือก shared UI (Compose Multiplatform) หรือ shared logic only ตามข้อ 2.4
3. ตั้ง package name และ minimum versions: Android minSdk >= 24, iOS >= 15
4. ตั้งค่า Gradle ให้ใช้ Kotlin DSL (`build.gradle.kts`) + version catalog (`libs.versions.toml`)

### 5. Configure Modules

> Goal: จัด module structure ตาม KMP conventions

1. โครงสร้างมาตรฐาน:
   ```text
   shared/          # KMP module — commonMain, androidMain, iosMain
   androidApp/      # Android entry (Jetpack Compose host)
   iosApp/          # Xcode project — SwiftUI host หรือ Compose Multiplatform view
   ```
2. `shared/build.gradle.kts`: ตั้ง `kotlin { androidTarget(); iosX64(); iosArm64(); iosSimulatorArm64() }` และ source sets `commonMain`/`androidMain`/`iosMain`
3. เปิด Compose Multiplatform plugin `org.jetbrains.compose` + `org.jetbrains.kotlin.plugin.compose` (Compose Compiler ผูกกับ Kotlin ตั้งแต่ 2.0 — ไม่ตั้ง extension version เอง)
4. ใช้ `libs.versions.toml` สำหรับ version catalog

### 6. Setup Shared Architecture

> Goal: จัดโครงสร้าง shared module ตาม Clean Architecture

1. `commonMain` เก็บ: `data/` (repositories, DTOs, Ktor client), `domain/` (use cases, models, repository interfaces), `presentation/` (ViewModels, screens)
2. `androidMain`/`iosMain` เก็บเฉพาะ platform implementations ผ่าน `expect`/`actual` (เช่น `expect fun platform(): String`)
3. ใช้ `follow-lang-kotlin` สำหรับ conventions
4. Networking → `io.ktor:ktor-client-*` (engine: `darwin` iOS, `okhttp`/`cio` Android)
5. Storage → `app.cash.sqldelight` (SQL) หรือ `androidx.datastore` via multiplatform adapter
6. DI → `io.insert-koin:koin-core` (KMP-ready)

### 7. Implement Shared UI

> Goal: สร้าง UI ด้วย Compose Multiplatform ใน commonMain

1. สร้าง `App.kt` ใน `commonMain` — shared composable entry
2. ใช้ Material 3 components จาก `org.jetbrains.compose.material3` (KMP)
3. Navigation → `org.jetbrains.androidx.navigation:navigation-compose` (Navigation 3 multiplatform)
4. Resources → `compose-multiplatform` resources API (`Res.drawable`, `Res.string`) ใน `commonMain/composeResources`
5. Android host: `MainActivity` เรียก `setContent { App() }`; iOS host: `ComposeViewController()` หรือ SwiftUI + shared ViewModels

### 8. Platform-Specific Wiring

> Goal: เชื่อมต่อ shared module เข้า host apps อย่างถูกต้อง

1. iOS: ใช้ `ComposeUIViewController { App() }` ใน `MainViewController.kt` (iosMain) หรือ export `shared` เป็น framework ให้ SwiftUI เรียกผ่าน `SharedModuleKt`/`skie`
2. Android: `MainActivity` ใน `androidApp` เรียก `App()` จาก `shared` ตรงๆ
3. ใช้ `expect`/`actual` สำหรับ platform APIs: file system, keychain/keystore, notifications, permissions
4. iOS capabilities/signing ตั้งใน Xcode project (push, app groups, keychain sharing)

### 9. Testing And Build

> Goal: ตรวจสอบความถูกต้องและสร้าง release builds

1. Unit tests ใน `commonTest` ด้วย `kotlin.test`; platform tests ใน `androidTest`/`iosTest`
2. รัน `./gradlew :shared:testDebugUnitTest` (Android side) และ iOS tests ผ่าน Xcode
3. Android release: `./gradlew :androidApp:assembleRelease` → AAB → Play Console/`fastlane supply`
4. iOS release: archive ผ่าน Xcode → App Store Connect/TestFlight (Xcode >= 26 เท่านั้นตั้งแต่ เม.ย. 2026)
5. ไม่ commit keystore/provisioning secrets — ใช้ env vars

### 10. Validate And Ship

> Goal: ตรวจสอบคุณภาพก่อนส่งมอบ

1. ทำ `/deep-review` เพื่อตรวจ UI/UX และ architecture
2. ทำ `/run-test` สำหรับ test suite
3. ทำ `/follow-lang-kotlin` เพื่อ verify conventions
4. ทำ `/ship-to-dev-branch`

## Rules

### 1. Kotlin Multiplatform

- Shared code อยู่ใน `commonMain` เท่านั้น — platform code ผ่าน `expect`/`actual` เท่าที่จำเป็น
- ใช้ KMP-compatible libraries เท่านั้น (Ktor, SQLDelight, Koin, Kotlinx.*) — JVM-only lib ห้ามอยู่ใน `commonMain`
- Compose Multiplatform สำหรับ shared UI — ถ้า iOS ต้องการ SwiftUI ให้ share เฉพาะ `domain`/`data` + ViewModels

### 2. Architecture

- ใช้ Clean Architecture — `domain` ไม่พึ่ง platform/framework
- ViewModel ใช้ `androidx.lifecycle` multiplatform (KMP-ready)
- Repository pattern สำหรับ data layer

### 3. Security

- ไม่ hardcode secrets — iOS ใช้ Keychain, Android ใช้ Keystore/EncryptedSharedPreferences ผ่าน `expect`/`actual`
- HTTPS เท่านั้น; ATS compliance บน iOS, `usesCleartextTraffic="false"` บน Android

### 4. Build

- Android: minSdk >= 24, targetSdk/compileSdk >= 36
- iOS: deployment target >= 15; Xcode >= 26 (App Store Connect requirement)
- ใช้ version catalog; Gradle wrapper ล่าสุดที่ AGP/Kotlin รองรับ (เช็ค matrix ด้วย `/deep-research`)

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-mobile-cross-with-capacitor ถ้า requirement เหมาะกับ web stack มากกว่า native

## Expected Outcome

- KMP project รันได้ทั้ง iOS และ Android จาก shared Kotlin codebase
- Clean Architecture ชัดเจน; shared logic/UI สูงสุด, platform code แยกถูกที่
- Tests, navigation, DI, storage, networking ครบถ้วน
- Release builds พร้อมส่ง Play Store และ App Store
