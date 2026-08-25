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
