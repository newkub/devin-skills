---
name: follow-create-mobile-ios-android
description: สร้าง iOS/Android mobile app ด้วย Capacitor จาก web codebase
argument-hint: "[project-name]"
related:
  - follow-framework-capacitor
  - follow-create-website
  - follow-tool-bun
---

## Goal

สร้าง cross-platform iOS และ Android mobile app จาก web codebase เดียวด้วย Capacitor

## Scope

- ใช้สำหรับสร้าง mobile app ใหม่หรือเพิ่ม native platforms ให้ web project
- ครอบคลุม setup Capacitor, add iOS/Android, build SPA, sync, run, และ deploy
- เน้น workflow ที่ทำงานร่วมกับ monorepo และ Bun

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ scope ของ mobile app

1. รับ project name, target platforms (iOS, Android, หรือทั้งคู่)
2. ระบุ web workspace หรือ SPA path ที่จะใช้เป็น mobile base
3. ระบุ stack: SolidJS, React, Vue หรืออื่น
4. ระบุ features เช่น push notifications, camera, deep links
5. ถ้าไม่ชัด → ใช้ `/ask-me`

### 2. Prepare Web Base

> Goal: มี web app ที่พร้อมสำหรับ Capacitor

1. ถ้ายังไม่มี web app → ทำ `/follow-create-website` หรือ `/follow-framework-capacitor`
2. สร้าง SPA build config แยก (`vite.config.spa.ts`) โดยตั้ง `ssr: false`
3. ตั้งค่า build output ไปยัง `dist-spa` หรือ `dist-mobile`
4. รัน `bun run build:spa` เพื่อตรวจสอบว่า `index.html` อยู่ root ของ output

### 3. Initialize Capacitor

> Goal: ตั้งค่า Capacitor config ถูกต้อง

1. ติดตั้ง `@capacitor/core` และ `@capacitor/cli` ด้วย `bun add -D @capacitor/core @capacitor/cli`
2. รัน `bunx cap init <app-name> <app-id> --web-dir <dist-folder>`
3. ตรวจสอบ `capacitor.config.ts` ว่ามี `appId`, `appName`, `webDir`
4. ใช้ `/follow-framework-capacitor` เพื่อตั้งค่า advanced config

### 4. Add Native Platforms

> Goal: เพิ่ม iOS และ Android ใน project

1. รัน `bunx cap add ios`
2. รัน `bunx cap add android`
3. ตรวจสอบว่า `ios/` และ `android/` ถูกสร้าง
4. รัน `bunx cap sync` เพื่อ copy web assets และ update dependencies

### 5. Configure Platform Specifics

> Goal: จัดการ config เฉพาะ iOS/Android

1. ตั้งค่า iOS deployment target >= 15 ใน `ios/App/Podfile`
2. ตั้งค่า Android `minSdkVersion` >= 24, `compileSdkVersion` >= 36
3. เพิ่ม plugin configs ใน `capacitor.config.ts`
4. ใช้ `Capacitor.platform` หรือ `Capacitor.isNativePlatform()` ใน app code ถ้าจำเป็น

### 6. Add Plugins

> Goal: ติดตั้ง plugins ที่จำเป็น

1. ติดตั้ง plugins ด้วย `bun add @capacitor/<plugin>`
2. รัน `bunx cap sync` หลังติดตั้งทุกครั้ง
3. กำหนด plugin configuration ใน `capacitor.config.ts`
4. ตรวจสอบ Capacitor 8 compatibility

### 7. Run And Test

> Goal: ทดสอบบน device/emulator

1. รัน `bunx cap run ios` หรือ `bunx cap open ios` แล้วรันผ่าน Xcode
2. รัน `bunx cap run android` หรือ `bunx cap open android` แล้วรันผ่าน Android Studio
3. ทดสอบบน real device ก่อน production
4. ใช้ live reload ด้วย `server.url` ถ้าต้องการ

### 8. Build And Deploy

> Goal: สร้าง release build และเตรียม deploy

1. รัน `bun run build:spa` แล้ว `bunx cap sync`
2. Build iOS release ผ่าน Xcode (`Archive` หรือ `Product > Archive`)
3. Build Android release ผ่าน Android Studio หรือ `./gradlew assembleRelease`
4. ตั้งค่า signing, app icon, splash screen
5. ใช้ Fastlane หรือ upload ขึ้น App Store / Play Store

### 9. Validate

> Goal: ตรวจสอบคุณภาพก่อนส่งมอบ

1. ทำ `/run-test` สำหรับ web tests
2. ทำ `/review-frontend` เพื่อตรวจ UI/UX
3. ทำ `/follow-framework-capacitor` เพื่อ verify security และ production config
4. ทำ `/ship` หลังผ่าน validation

## Rules

### 1. SPA Build

- ต้องมี SPA build แยก (`ssr: false`)
- `webDir` ชี้ไปยัง output ที่มี `index.html`
- รัน build ก่อน `cap sync` เสมอ

### 2. Version Alignment

- Node.js >= 22
- Capacitor 8 compatible plugins เท่านั้น
- iOS deployment target >= 15
- Android compileSdk >= 36

### 3. Security

- ไม่ embed secrets ใน native app
- `server.cleartext` เป็น `false` ใน production
- ใช้ Universal Links แทน Custom URL Schemes สำหรับ deep links

### 4. Monorepo

- ใช้ `bun --filter <workspace>` สำหรับรัน scripts
- `webDir` ใช้ relative path จาก mobile workspace
- แยก dependencies ระหว่าง website และ mobile workspace

## Expected Outcome

- มี Capacitor iOS และ Android project ที่ทำงานได้
- SPA build พร้อม native platforms
- Plugins, signing, build config ถูกต้อง
- App รันบน emulator/device ได้
- พร้อมสำหรับ App Store / Play Store deploy
