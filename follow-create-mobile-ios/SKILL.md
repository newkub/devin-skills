---
name: follow-create-mobile-ios
description: สร้าง native iOS mobile app ด้วย Swift และ SwiftUI
argument-hint: "[project-name]"
related:
  - follow-lang-swift
  - follow-create-mobile-ios-android
---

## Goal

สร้าง native iOS mobile app ด้วย Swift, SwiftUI, และ Swift Package Manager ตาม best practices

## Scope

- ใช้สร้าง iOS app ใหม่จาก scratch
- ครอบคลุม setup, project structure, SwiftUI, architecture, build, test และ deploy
- ใช้ Xcode เป็น primary IDE

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ scope ของ iOS app

1. รับ project name, bundle identifier (เช่น `com.example.app`), deployment target
2. ระบุ features, screens, navigation pattern
3. ระบุ architecture: Clean Architecture, MVVM, TCA
4. ระบุ DI/dependency จัดการ: Factory, Swinject หรือ manual
5. ถ้าไม่ชัด → ใช้ `/ask-me`

### 2. Verify Environment

> Goal: ตรวจสอบสภาพแวดล้อมก่อนสร้าง

1. ตรวจสอบ Xcode เวอร์ชันล่าสุด
2. ตรวจสอบ macOS รองรับ iOS development
3. ตรวจสอบ iOS Simulator หรือ real device พร้อมใช้
4. ตรวจสอบ Apple Developer account ถ้าจะ deploy ไป device/store

### 3. Create Project

> Goal: สร้าง iOS project ด้วย Xcode

1. เปิด Xcode > Create New Project > iOS > App
2. ตั้งชื่อ project, bundle identifier, interface เป็น SwiftUI
3. เลือก language เป็น Swift
4. ตั้งค่า target iOS >= 15
5. ใช้ SwiftUI เป็น lifecycle (ไม่ใช้ Storyboard)

### 4. Configure Project

> Goal: ตั้งค่า project ให้พร้อมสำหรับ scale

1. ตั้งค่า bundle identifier, version, build number
2. ตั้งค่า signing ด้วย Apple Developer team
3. ตั้งค่า capabilities ที่จำเป็น (push notifications, app groups, keychain sharing)
4. สร้าง `README.md` หรือ project note สำหรับ onboarding

### 5. Setup Architecture

> Goal: จัดโครงสร้างตาม Clean Architecture หรือ MVVM

1. สร้าง groups: `Application/`, `Core/`, `Data/`, `Domain/`, `Presentation/`, `Resources/`
2. `Application/` เก็บ `App.swift`, `AppDelegate`, `SceneDelegate`
3. `Core/` เก็บ DI, extensions, utilities
4. `Data/` เก็บ repositories, data sources, DTOs
5. `Domain/` เก็บ entities, protocols, use cases
6. `Presentation/` เก็บ Views, ViewModels
7. ใช้ `follow-lang-swift` สำหรับ conventions

### 6. Implement Core UI

> Goal: สร้าง UI ด้วย SwiftUI

1. สร้าง `ContentView.swift` หรือ `App` entry point
2. สร้าง theme ด้วย colors, fonts, images ใน `Assets.xcassets`
3. สร้าง screens และ reusable components
4. ใช้ `NavigationStack` หรือ `NavigationView` สำหรับ navigation

### 7. Add DI And State Management

> Goal: จัดการ dependency injection และ state

1. ถ้าใช้ Factory: เพิ่ม `Container` ด้วย registrations
2. ถ้าใช้ manual DI: สร้าง `AppContainer` หรือ `CompositionRoot`
3. ใช้ `@StateObject`, `@ObservedObject`, `@State` อย่างถูกต้อง
4. ใช้ `@MainActor` สำหรับ UI updates

### 8. Add SPM Dependencies

> Goal: ติดตั้ง dependencies ที่จำเป็น

1. ไปที่ `File > Add Package Dependencies`
2. เพิ่ม packages เช่น `Alamofire`, `Factory`, `KeychainAccess` ถ้าจำเป็น
3. หรือใช้ `Package.swift` สำหรับ pure SPM project
4. ตรวจสอบ version compatibility

### 9. Testing

> Goal: ตรวจสอบความถูกต้องของ app

1. เขียน unit tests สำหรับ UseCases และ ViewModels
2. เขียน UI tests ด้วย `XCTest` และ SwiftUI testing APIs
3. รัน `Cmd+U` หรือ `xcodebuild test -scheme <scheme>`

### 10. Build And Deploy

> Goal: สร้าง release build และเตรียม deploy

1. เลือก `Any iOS Device` หรือ real device
2. ใช้ `Product > Archive` สร้าง archive
3. ใช้ Xcode Organizer หรือ `xcodebuild -exportArchive` สร้าง `.ipa`
4. ใช้ App Store Connect หรือ TestFlight สำหรับ distribute

### 11. Validate And Ship

> Goal: ตรวจสอบคุณภาพก่อนส่งมอบ

1. ทำ `/review-frontend` เพื่อตรวจ UI/UX
2. ทำ `/run-test` สำหรับ test suite
3. ทำ `/follow-lang-swift` เพื่อ verify conventions
4. ทำ `/ship`

## Rules

### 1. Swift And SwiftUI

- ใช้ Swift 5.9 หรือใหม่กว่า
- ใช้ SwiftUI เป็น UI framework
- ตั้ง target iOS >= 15

### 2. Architecture

- ใช้ Clean Architecture หรือ MVVM
- ViewModel ไม่ควรรู้จัก UI details โดยตรง
- Repository pattern สำหรับ data layer

### 3. Security

- ไม่ hardcode secrets ใน source code
- ใช้ Keychain สำหรับ sensitive data
- ใช้ ATS (App Transport Security) คือ HTTPS โดย default

### 4. Build

- ใช้ Xcode project หรือ Package.swift ตาม context
- ตั้ง bundle identifier เป็น reverse domain
- ใช้ semantic versioning สำหรับ version และ build number

## Expected Outcome

- iOS project สร้างด้วย Swift + SwiftUI
- Clean Architecture หรือ MVVM ชัดเจน
- UI, navigation, DI, tests ครบถ้วน
- Release build สำเร็จ
- พร้อมสำหรับ App Store / TestFlight deploy
