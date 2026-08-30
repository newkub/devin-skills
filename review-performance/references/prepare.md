---
name: prepare
description: Prepare and scan before performance review
---

# Prepare And Scan

## Goal

เข้าใจ project structure, tech stack และ performance setup

## Scope

ใช้สำหรับเตรียมข้อมูลก่อน review performance เช่น project structure, tech stack, build tools, performance tools

## Execute

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, build tools
2. ระบุ performance tools ที่มี: `lighthouse`, `react-scan`, `unlighthouse`, `bun profile`, `Chrome DevTools`
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/run-review` เพื่อดึง review metrics ล่าสุด
5. ถ้าต้องการ runtime profile ลึก ให้ทำตาม `references/performance-profile.md`

## Rules

- บันทึก tech stack, build tools, และ performance tools ที่พบ
- ระบุ dimensions ที่อาจถูก skip ตาม project type
- ห้าม optimize ก่อนมี evidence

## Expected Outcome

- สรุป project structure, tech stack, build tools
- รายชื่อ performance tools ที่พร้อมใช้
- ข้อมูลพื้นฐานสำหรับเลือก review steps ถัดไป
