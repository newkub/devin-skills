---
name: report-my-tech-stack-update
description: รายงานอัปเดต tech stack ที่ใช้ในการพัฒนารายสัปดาห์
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-table
  - suggest-next-action
  - report-ansi
  - follow-my-tech-stack
  - deep-research
---

## Goal

รวบรวมและสรุปข่าวสารและอัปเดตของ tech stack ที่ใช้ในการพัฒนา ประจำสัปดาห์ เพื่อให้ผู้ใช้ติดตามการเปลี่ยนแปลงและเทรนด์ที่สำคัญ

## Scope

ครอบคลุมการตรวจสอบและรวบรวมอัปเดตจาก:
- Runtime และ package managers (Bun, Cargo)
- Frameworks และ libraries (TanStack, Vue, SolidJS, Vite, etc.)
- Tools และ services (Biome, Drizzle, Supabase, Stripe, etc.)
- Infrastructure และ deployment (Cloudflare, Vercel, etc.)

## Execute

### 1. Identify Current Tech Stack

> Goal: ระบุ tech stack ปัจจุบัน
> Goal: รู้ dependencies ทั้งหมดพร้อมเวอร์ชันปัจจุบัน

1. ทำ `/follow-my-tech-stack` เพื่อระบุ tech stack ทั้งหมด
2. อ่าน `package.json`, `Cargo.toml`, `go.mod` เพื่อดู dependencies ปัจจุบัน
3. ระบุเวอร์ชันปัจจุบันของแต่ละ dependency
4. จัดกลุ่มตาม category: Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services

### 2. Check For Updates

> Goal: ตรวจสอบอัปเดตที่มีอยู่
> Goal: รู้ dependencies ที่มีอัปเดตพร้อมเวอร์ชันใหม่

1. รัน `bun outdated` เพื่อเช็ค npm packages ที่มีอัปเดต
2. รัน `cargo outdated` เพื่อเช็ค Rust crates ที่มีอัปเดต (ถ้ามี Rust project)
3. ใช้ `mcp7_list_releases` สำหรับ repositories ที่ติดตาม
4. ค้นหาด้วย `search_web` ใช้ query `<library-name> latest release <month> <year>`
5. รวบรวมรายการ dependencies ที่มีอัปเดตพร้อมเวอร์ชันใหม่

### 3. Research Release Notes

> Goal: ค้นหา release notes และ changelogs
> Goal: รู้ breaking changes และ migration guides ของ dependencies ที่มีอัปเดต

1. ทำ `/deep-research` สำหรับ libraries ที่มีอัปเดตสำคัญ
2. ใช้ `mcp7_list_releases` สำหรับ GitHub release tracking
3. ใช้ `read_url_content` สำหรับอ่าน changelogs ที่น่าสนใจ
4. ระบุ breaking changes และ features ใหม่ที่สำคัญ
5. ตรวจสอบ migration guides สำหรับ major version bumps

### 4. Categorize Updates

> Goal: จัดกลุ่มอัปเดตตามประเภท
> Goal: อัปเดตจัดกลุ่มและจัดลำดับตาม impact

1. จัดกลุ่มตาม category: Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services
2. จัดลำดับตาม impact: Breaking Changes, New Features, Bug Fixes, Security
3. ระบุ libraries ที่ต้องอัปเดตด่วน (security patches, breaking changes)
4. ระบุ libraries ที่มี major version bump และต้อง migration

### 5. Compile Report

> Goal: สร้างรายงานอัปเดตรายสัปดาห์
> Goal: รายงานพร้อมตารางและ executive summary

1. ทำ `/report-table` สร้างตารางอัปเดต
2. กำหนด columns: No., Library, Category, Current Version, Latest Version, Impact, Summary
3. จัดกลุ่มตาม category และจัดลำดับตาม impact
4. เพิ่ม summary สั้นๆ สำหรับแต่ละอัปเดต
5. ทำ `/report` สร้าง executive summary พร้อม top highlights

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Update Categories

- Breaking Changes: อัปเดตที่อาจกระทบการใช้งานปัจจุบัน ต้อง migration
- New Features: ฟีเจอร์ใหม่ที่น่าสนใจ
- Bug Fixes: แก้ไขบั๊กที่สำคัญ
- Security: แก้ไขช่องโหว่ด้านความปลอดภัย
- จัดลำดับความสำคัญ: Security > Breaking Changes > New Features > Bug Fixes

### 2. Source Selection

- ใช้ `bun outdated` สำหรับ npm packages
- ใช้ `cargo outdated` สำหรับ Rust crates
- ใช้ `mcp7_list_releases` สำหรับ GitHub release tracking
- ใช้ `search_web` สำหรับค้นหา release notes
- ใช้ `read_url_content` สำหรับอ่าน full changelogs
- ทำตาม `/follow-my-tech-stack` สำหรับ tech stack categories

### 3. Freshness Requirements

- ตรวจสอบเฉพาะอัปเดตที่เกิดขึ้นในสัปดาห์นี้หรือสัปดาห์ที่แล้ว
- ใช้ query ที่ระบุปีและสัปดาห์ เช่น `<library-name> release July 2026`
- ตรวจสอบ release dates ของทุก item
- ทำตาม `/deep-research` Rules ข้อ 6 Information Freshness

### 4. Report Format

- ใช้ `/report-table` สำหรับ structured output
- จัดกลุ่มตาม category และจัดลำดับตาม impact
- ใช้ `/report` สำหรับ executive summary
- สรุป top 5 highlights ของสัปดาห์

## Expected Outcome

- รายงานอัปเดต tech stack ประจำสัปดาห์
- ข่าวจัดกลุ่มตาม category และจัดลำดับตาม impact
- Breaking changes และ security updates ถูกระบุชัดเจน
- Migration guides สำหรับ major version bumps
- Executive summary พร้อม top highlights
- สามารถใช้เป็น weekly briefing สำหรับผู้ใช้
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
