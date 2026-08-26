---
name: follow-create-mobile-android
description: สร้าง native Android mobile app ด้วย Kotlin และ Jetpack Compose
argument-hint: "[project-name]"
related:
  - follow-lang-kotlin
  - follow-create-mobile-ios-android
---

## Goal

สร้าง native Android mobile app ด้วย Kotlin, Jetpack Compose, และ Gradle ตาม best practices

## Scope

- ใช้สำหรับสร้าง Android app ใหม่จาก scratch
- ครอบคลุม setup, project structure, Compose UI, architecture, build, test และ deploy
- ใช้ Android Studio เป็น primary IDE

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ scope ของ Android app

1. รับ project name, package name (เช่น `com.example.app`), min/target SDK
2. ระบุ features, screens, navigation pattern
3. ระบุ architecture: Clean Architecture, MVVM, MVI
4. ระบุ DI library: Koin หรือ Hilt
5. ถ้าไม่ชัด → ใช้ `/ask-me`

### 2. Verify Environment

> Goal: ตรวจสอบสภาพแวดล้อมก่อนสร้าง

1. ตรวจสอบ Android Studio Otter 2025.2.1 หรือใหม่กว่า
2. ตรวจสอบ JDK 21 หรือสูงกว่า
3. ตรวจสอบ Android SDK ที่ติดตั้ง (compileSdk >= 36)
4. ตรวจสอบ `adb` และ emulator ถ้าจะรันบน device

### 3. Create Project

> Goal: สร้าง Android project ด้วย template ที่เหมาะสม

1. เปิด Android Studio > New Project > Empty Compose Activity
2. ตั้งชื่อ project, package name, และ language เป็น Kotlin
3. เลือก minimum SDK เป็น API 24 หรือสูงกว่า
4. ตั้งค่า Gradle ให้ใช้ Kotlin DSL (`build.gradle.kts`)

### 4. Configure Gradle

> Goal: ตั้งค่า build และ dependencies ที่จำเป็น

1. ตั้งค่า `build.gradle.kts` (project level):
   - `plugins { alias(libs.plugins.android.application) alias(libs.plugins.kotlin.android) ... }`
2. ตั้งค่า `build.gradle.kts` (app level):
   - `compileSdk = 36`
   - `defaultConfig { minSdk = 24; targetSdk = 36 }`
   - `buildFeatures { compose = true }`
   - `composeOptions { kotlinCompilerExtensionVersion = "..." }`
3. ใช้ `libs.versions.toml` สำหรับ version catalog
4. เพิ่ม dependencies: Compose BOM, ViewModel, Navigation, Koin/Hilt, Coroutines

### 5. Setup Architecture

> Goal: จัดโครงสร้างตาม Clean Architecture หรือ MVVM

1. สร้าง packages: `data/`, `domain/`, `presentation/`, `di/`
2. `data/` เก็บ repositories, data sources, DTOs
3. `domain/` เก็บ use cases, models, repository interfaces
4. `presentation/` เก็บ screens, ViewModels, components
5. ใช้ `follow-lang-kotlin` สำหรับ conventions

### 6. Implement Core UI

> Goal: สร้าง UI ด้วย Jetpack Compose

1. สร้าง `MainActivity.kt` พร้อม `setContent { App() }`
2. สร้าง theme ด้วย Material 3
3. สร้าง screens และ reusable components
4. ใช้ `Navigation Compose` สำหรับ navigation graph

### 7. Add DI And State Management

> Goal: จัดการ dependency injection และ state

1. ถ้าใช้ Koin: สร้าง `KoinApplication.kt` ด้วย `startKoin { modules(appModule) }`
2. ถ้าใช้ Hilt: ใช้ `@HiltAndroidApp`, `@HiltViewModel`, `@Inject`
3. ใช้ `ViewModel` สำหรับ screen state
4. ใช้ `StateFlow` หรือ `MutableState` สำหรับ UI state

### 8. Testing

> Goal: ตรวจสอบความถูกต้องของ app

1. เขียน unit tests สำหรับ use cases และ ViewModels
2. เขียน UI tests ด้วย Compose Testing
3. รัน `./gradlew test` และ `./gradlew connectedCheck` ถ้ามี emulator

### 9. Build And Deploy

> Goal: สร้าง release build และเตรียม deploy

1. ตั้งค่า signing config (keystore, password) ผ่าน environment variables
2. รัน `./gradlew assembleRelease`
3. ตรวจสอบ `app-release.apk` หรือ `app-release.aab`
4. ใช้ Play Console หรือ `fastlane supply` สำหรับ publish

### 10. Validate And Ship

> Goal: ตรวจสอบคุณภาพก่อนส่งมอบ

1. ทำ `/review-frontend` เพื่อตรวจ UI/UX
2. ทำ `/run-test` สำหรับ test suite
3. ทำ `/follow-lang-kotlin` เพื่อ verify conventions
4. ทำ `/ship`

## Rules

### 1. Kotlin And Compose

- ใช้ Kotlin 2.0 หรือใหม่กว่า
- ใช้ Jetpack Compose สำหรับ UI
- ใช้ Material 3 เป็น default design system

### 2. Architecture

- ใช้ Clean Architecture หรือ MVVM
- ViewModel ไม่ควรรู้จัก Android framework โดยตรง
- Repository pattern สำหรับ data layer

### 3. Security

- ไม่ commit keystore หรือ secrets ลง repository
- ใช้ `EncryptedSharedPreferences` หรือ Keystore สำหรับ sensitive data
- ใช้ HTTPS สำหรับ network

### 4. Build

- compileSdk >= 36, targetSdk >= 36, minSdk >= 24
- ใช้ version catalog (`libs.versions.toml`)
- ใช้ Gradle 8.13 หรือใหม่กว่า

## Expected Outcome

- Android project สร้างด้วย Kotlin + Jetpack Compose
- Clean Architecture หรือ MVVM ชัดเจน
- UI, navigation, DI, tests ครบถ้วน
- Release build สำเร็จ
- พร้อมสำหรับ Play Store deploy
