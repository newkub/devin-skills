---
name: follow-capacitor
description: แนวทางการพัฒนา Capacitor 8 cross-platform mobile apps ด้วย web technologies
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

พัฒนา cross-platform mobile applications ด้วย Capacitor 8 โดยใช้ web technologies ที่ทำงานบน iOS, Android และ PWA จาก codebase เดียว

## Scope

ใช้สำหรับพัฒนาและดูแล Capacitor 8 mobile apps ใน monorepo ครอบคลุม setup, configuration, plugins, build, deployment และ security

## Execute

### 1. Environment Setup

ตรวจสอบและเตรียม environment ก่อนเริ่มพัฒนา

1. ตรวจสอบ Node.js >= 22 (Capacitor 8 requirement)
2. ตรวจสอบ Android Studio Otter 2025.2.1 หรือใหม่กว่า
3. ตรวจสอบ Xcode สำหรับ iOS development
4. ตรวจสอบ JDK 21 หรือสูงกว่า
5. ตั้งค่า environment variables ถ้าจำเป็น: `CAPACITOR_ANDROID_STUDIO_PATH`, `CAPACITOR_COCOAPODS_PATH`
6. ทำ `/follow-bun` สำหรับ Bun runtime และ package manager
7. ทำ `/follow-config` สำหรับ configuration files

### 2. Project Configuration

ตั้งค่า Capacitor config อย่างถูกต้อง

1. สร้าง `capacitor.config.ts` ด้วย `CapacitorConfig` type จาก `@capacitor/cli`
2. กำหนด `appId` เป็น reverse domain name notation (เช่น `com.company.appname`)
3. กำหนด `appName` เป็นชื่อ app ที่ user-friendly
4. กำหนด `webDir` ให้ชี้ไปยัง compiled web assets ที่มี `index.html`
5. ตั้งค่า `server.androidScheme` เป็น `https` (default)
6. ตั้งค่า `server.iosScheme` เป็น `https` หรือ `capacitor` (default)
7. ตั้งค่า `server.cleartext` เป็น `false` ใน production
8. กำหนด `loggingBehavior` เป็น `debug` สำหรับ dev และ `none` สำหรับ production
9. กำหนด plugin configurations ใน `plugins` object ตามชื่อ class ของ plugin
10. ใช้ platform-specific overrides ใน `android` และ `ios` properties เมื่อจำเป็น

### 3. SPA Integration

เชื่อมต่อ web app เข้ากับ Capacitor native container

1. ทำ `/follow-vite` สำหรับ SPA build configuration
2. สร้าง SPA build config แยก (เช่น `vite.config.spa.ts`) ที่ตั้งค่า `ssr: false`
3. Build SPA ไปยัง directory ที่ `webDir` ชี้ (เช่น `dist-spa`)
4. ตรวจสอบว่า `index.html` อยู่ใน root ของ `webDir`
5. ใช้ `bun --filter website build:spa` สำหรับ build SPA
6. ตั้งค่า `cap:sync` script เป็น `bun run build && cap sync`
7. ตั้งค่า `cap:copy` script เป็น `bun run build && cap copy`

### 4. Plugin Management

จัดการ Capacitor plugins อย่างเป็นระบบ

1. ติดตั้ง plugins ด้วย `bun add @capacitor/<plugin-name>`
2. ติดตั้ง third-party plugins ด้วย `bun add @<vendor>/capacitor-<plugin-name>`
3. รัน `cap sync` หลังติดตั้งหรืออัพเดท plugins ทุกครั้ง
4. กำหนด plugin configuration ใน `capacitor.config.ts` ภายใต้ `plugins` object
5. ใช้ `includePlugins` สำหรับ allowlist plugins ใน `cap sync`
6. ตรวจสอบ plugin versions ให้เข้ากันกับ Capacitor major version
7. ใช้ Capacitor 8 compatible plugins เท่านั้น
8. ทำ `/learn-from-web` เมื่อต้องการค้นหา plugins ใหม่

### 5. Platform Development

พัฒนาและทดสอบบน native platforms

1. เพิ่ม platform ด้วย `cap add ios` หรือ `cap add android`
2. ใช้ `cap add ios` สำหรับ SPM template (default ใน Capacitor 8)
3. ใช้ `cap add ios --packagemanager CocoaPods` ถ้าต้องการ CocoaPods template
4. เปิด native IDE ด้วย `cap open ios` (Xcode) หรือ `cap open android` (Android Studio)
5. รันบน device/emulator ด้วย `cap run ios` หรือ `cap run android`
6. ใช้ `cap sync` ก่อนรันทุกครั้งเพื่อ copy web assets และ update dependencies
7. ตั้งค่า live reload สำหรับ development ด้วย `server.url`
8. ทดสอบบน real devices ก่อน production release

### 6. Platform-Specific Code

จัดการ platform-specific code อย่างถูกต้อง

1. ใช้ `Capacitor.platform` สำหรับตรวจจับ platform (`ios`, `android`, `web`)
2. ใช้ `Capacitor.isNativePlatform()` สำหรับตรวจจับ native environment
3. แยก platform-specific code ด้วย dynamic imports
4. ใช้ `@capacitor/core` APIs สำหรับ cross-platform access
5. หลีกเลี่ยง browser-specific APIs ที่ไม่รองรับใน WebView
6. ใช้ feature detection แทน platform detection เมื่อเป็นไปได้
7. จัดการ edge cases สำหรับแต่ละ platform (เช่น WKWebView process termination บน iOS)

### 7. Build And Deployment

Build และ deploy ไปยัง app stores

1. ทำ `/follow-deploy` สำหรับ deployment strategy
2. รัน `cap sync` ก่อน build ทุกครั้ง
3. Build iOS ผ่าน Xcode หรือ `cap run ios --configuration Release`
4. Build Android ผ่าน Android Studio หรือ Gradle
5. ตั้งค่า iOS signing ใน `ios.buildOptions`: `signingStyle`, `exportMethod`, `signingCertificate`, `provisioningProfile`
6. ตั้งค่า Android signing ใน `android.buildOptions`: `keystorePath`, `keystorePassword`, `keystoreAlias`, `keystoreAliasPassword`, `releaseType`, `signingType`
7. ใช้ Fastlane สำหรับ automate deployment: `fastlane supply` (Android), `fastlane deliver` (iOS)
8. ใช้ OTA updates ผ่าน `@capgo/capacitor-updater` สำหรับ hot fixes

### 8. OTA Updates

จัดการ over-the-air updates สำหรับ web bundle

1. ติดตั้ง `@capgo/capacitor-updater` สำหรับ OTA update support
2. กำหนด `CapacitorUpdater` config ใน `capacitor.config.ts`: `appId`, `autoUpdateUrl`, `notifyUpdate`, `resetWhenUpdate`
3. ใช้ channels สำหรับ staged rollouts (`production`, `staging`, `dev`)
4. ทดสอบ OTA updates บน real devices ก่อน production
5. มี rollback strategy สำหรับกรณี update มีปัญหา

### 9. Security

ทำตาม security best practices สำหรับ Capacitor apps

1. ไม่ embed secrets ใน app code ใช้ server-side สำหรับ sensitive operations
2. ใช้ PKCE สำหรับ OAuth2 authentication flows
3. ใช้ Universal Links แทน Custom URL Schemes สำหรับ deep links
4. ไม่ส่ง sensitive data ผ่าน Custom URL scheme deep links
5. ตั้งค่า Content Security Policy (CSP) ใน `<meta>` tag
6. ใช้ SSL/TLS สำหรับ network requests
7. ตั้งค่า `server.cleartext` เป็น `false` ใน production
8. ใช้ iOS Keychain หรือ Android Keystore สำหรับ store sensitive values
9. ใช้ `@capgo/capacitor-native-biometric` สำหรับ biometric authentication
10. ตั้งค่า `webContentsDebuggingEnabled: false` ใน production

### 10. Migration

ย้ายระหว่าง Capacitor major versions

1. ติดตั้ง latest CLI ด้วย `bun add -D @capacitor/cli@latest`
2. รัน `npx cap migrate` สำหรับ automated migration
3. ตรวจสอบ breaking changes ใน plugins ทุกตัว
4. อัพเดท iOS deployment target (Capacitor 8: 15)
5. อัพเดท Android minSdkVersion (Capacitor 8: 24), compileSdkVersion และ targetSdkVersion (36)
6. อัพเดท Gradle plugin (8.13.0) และ wrapper (8.14.3)
7. อัพเดท Kotlin version (2.2.20)
8. แทนที่ `android.adjustMarginsForEdgeToEdge` ด้วย System Bars plugin
9. ตรวจสอบ `appendUserAgent` whitespace bug fix บน iOS
10. ไม่ใช้ `cap migrate` ใน monorepo ให้ migrate ด้วยมือ

### 11. Testing

ทดสอบ Capacitor app อย่างครบถ้วน

1. ทดสอบบน real devices ทั้ง iOS และ Android
2. ทดสอบบน emulators/simulators หลายรุ่น
3. ทดสอบ plugin functionality บนทุก platform
4. ทดสอบ offline behavior และ network transitions
5. ทดสอบ push notifications และ local notifications
6. ทดสอบ deep links และ universal links
7. ทดสอบ OTA update flow และ rollback
8. ทดสอบ biometric authentication
9. ทดสอบ app lifecycle (background, foreground, termination)
10. ทดสอบ WebView edge cases (process termination, memory pressure)

## Rules

### 1. Version Requirements

Capacitor 8 requirements:

- Node.js >= 22 (latest LTS recommended)
- iOS deployment target >= 15
- Android minSdkVersion >= 24, compileSdkVersion >= 36, targetSdkVersion >= 36
- JDK >= 21
- Android Studio Otter 2025.2.1 หรือใหม่กว่า
- Kotlin >= 2.2.20
- Gradle plugin >= 8.13.0, wrapper >= 8.14.3

### 2. Configuration Rules

กฎสำหรับ `capacitor.config.ts`:

- ใช้ `capacitor.config.ts` (TypeScript) ไม่ใช้ `.json`
- ใช้ `CapacitorConfig` type จาก `@capacitor/cli`
- `appId` เป็น reverse domain name notation เสมอ
- `webDir` ต้องชี้ไปยัง directory ที่มี `index.html`
- `server.cleartext` เป็น `false` ใน production
- `loggingBehavior` เป็น `none` ใน production
- ใช้ platform-specific overrides ใน `android` และ `ios` properties
- กำหนด plugin config ใน `plugins` object ตาม class name

### 3. Plugin Rules

กฎสำหรับ plugin management:

- ใช้ Capacitor 8 compatible plugins เท่านั้น
- รัน `cap sync` หลังติดตั้ง/อัพเดท plugins ทุกครั้ง
- ใช้ `includePlugins` สำหรับ allowlist ใน monorepo
- ตรวจสอบ plugin breaking changes ก่อน upgrade
- ใช้ SPM (default) สำหรับ iOS plugins ใน Capacitor 8
- ใช้ CocoaPods ด้วย `--packagemanager CocoaPods` ถ้าจำเป็น
- ไม่ใช้ Cordova plugins ถ้ามี Capacitor equivalent

### 4. SPA Build Rules

กฎสำหรับ SPA integration:

- ใช้ separate Vite config สำหรับ SPA build (`vite.config.spa.ts`)
- ตั้งค่า `ssr: false` ใน SPA build config
- Build ไปยัง `webDir` directory (เช่น `dist-spa`)
- ตรวจสอบว่า `index.html` อยู่ใน root ของ `webDir`
- ใช้ `cap:sync` script ที่ build ก่อนแล้ว sync
- ไม่ใช้ server-side rendering ใน SPA build

### 5. Security Rules

กฎด้าน security:

- ไม่ embed secrets ใน app code
- ใช้ PKCE สำหรับ OAuth2
- ใช้ Universal Links แทน Custom URL Schemes
- ตั้งค่า CSP ใน `<meta>` tag
- ใช้ SSL/TLS สำหรับ network requests
- `server.cleartext` เป็น `false` ใน production
- ใช้ Keychain/Keystore สำหรับ sensitive values
- `webContentsDebuggingEnabled: false` ใน production

### 6. Monorepo Rules

กฎสำหรับ monorepo integration:

- ใช้ `bun --filter <workspace>` สำหรับรัน scripts ใน workspace เฉพาะ
- `webDir` ใช้ relative path จาก mobile workspace (เช่น `../website/dist-spa`)
- `cap:sync` script build SPA ก่อนแล้ว sync
- ไม่ใช้ `cap migrate` ใน monorepo ให้ migrate ด้วยมือ
- ใช้ `includePlugins` สำหรับ allowlist plugins ใน monorepo
- แยก dependencies ระหว่าง website และ mobile workspace

### 7. CLI Commands

คำสั่ง Capacitor CLI ที่ใช้บ่อย:

- `cap init` - initialize Capacitor config
- `cap add [platform]` - เพิ่ม native platform
- `cap sync [platform]` - copy web assets และ update dependencies
- `cap copy [platform]` - copy web assets เท่านั้น
- `cap update [platform]` - update native dependencies เท่านั้น
- `cap open [platform]` - เปิด native IDE
- `cap run [platform]` - build และ deploy ไปยัง device/emulator
- `cap migrate` - migrate ไปยัง major version ใหม่

## Expected Outcome

- Capacitor 8 app ทำงานได้บน iOS, Android และ PWA
- Configuration ถูกต้องตาม best practices
- Plugins จัดการอย่างเป็นระบบ
- SPA integration ราบรื่นกับ monorepo
- Security best practices ถูกต้อง
- Build และ deploy ได้สำเร็จ
- เป็นไปตาม Capacitor 8 official documentation
