---
name: run-watch-build
description: รัน build แบบ watch mode เพื่อตรวจสอบ build errors อย่างต่อเนื่อง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

รัน build แบบ watch mode เพื่อตรวจสอบ build errors อย่างต่อเนื่อง

## Scope

ใช้สำหรับ project ที่ต้องการรัน build แบบ watch mode ขณะพัฒนา

## Prompt

ใช้ workflow นี้เมื่อต้องการรัน build แบบ watch mode เพื่อตรวจสอบ build errors และ optimization อย่างต่อเนื่องขณะพัฒนา

## Execute

1. ตรวจสอบ Build Setup

- ตรวจสอบว่าโปรเจกต์มี build tool ที่เหมาะสม (Vite, Rollup, Webpack, ฯลฯ)
- ตรวจสอบ build configuration files
- ยืนยันว่า build script ถูกกำหนดใน main config
- ตรวจสอบว่า dependencies ที่จำเป็นถูกติดตั้งแล้ว

2. รัน Build Watch Mode

- รัน build ด้วย watch mode (vite build --watch, webpack --watch, ฯลฯ)
- กำหนด files ที่จะ monitor ตาม project structure
- ตั้งค่า ignore patterns สำหรับ files ที่ไม่ต้อง build
- ติดตาม build output และ errors

3. ติดตามและแก้ไข Build Errors

- ตรวจสอบ build errors ที่เกิดขึ้นทันที
- แก้ไข build errors ตาม priority
- ตรวจสอบ dependency issues
- รัน `/resolve-errors` สำหรับ errors ที่ซับซ้อน หรือ `/deep-debug` สำหรับ errors ที่ต้องวางแผนแก้

4. ตรวจสอบ Build Output

- ตรวจสอบว่า build output ถูกต้อง
- ตรวจสอบ bundle sizes
- ตรวจสอบ asset optimization
- ทดสอบ build output ใน local environment

5. ปรับปรุง Build Performance

- ตรวจสอบ build time
- ปรับปรุง build configuration
- ใช้ caching เมื่อเป็นไปได้
- Optimize dependencies

6. ตรวจสอบ Production Readiness

- ตรวจสอบ environment variables
- ตรวจสอบ API endpoints
- ทดสอบ build output ใน production-like environment
- ตรวจสอบ deployment readiness

## Rules

1. Build Integrity

- ไม่ ignore build errors
- ตรวจสอบ build output อย่างละเอียด
- ทดสอบ build ก่อน deploy
- รัน build ใน CI/CD

2. Real-time Monitoring

- ตรวจสอบ build errors ทันทีที่เกิด
- แก้ไข errors ก่อนทำงานต่อ
- ไม่ commit code ที่ break build
- รัน build ก่อน merge

3. Performance

- ตรวจสอบ build time อย่างสม่ำเสมอ
- Optimize bundle sizes
- ใช้ code splitting
- Minimize dependencies

4. Production Ready

- ตรวจสอบ environment configuration
- ทดสอบใน production-like environment
- ตรวจสอบ security settings
- Validate API endpoints

## Expected Outcome

- Build ทำงานแบบ watch mode อย่างต่อเนื่อง
- Build errors ถูกตรวจสอบและแก้ไขทันที
- Build output มีคุณภาพและ optimized
- Build performance เหมาะสม
- Production ready builds
