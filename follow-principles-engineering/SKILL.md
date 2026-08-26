---
name: follow-principles-engineering
description: ตรวจสอบว่าไฟล์ match กับ software engineering principles ตาม file name
argument-hint: "[file]"
---

## Goal

ตรวจสอบว่าไฟล์ match กับ software engineering principles ที่ระบุจาก file name พร้อมรายงาน violations และ recommendations

## Scope

ใช้สำหรับตรวจสอบไฟล์ใน global_workflows และ workspace ว่า match กับ engineering principles — ไม่รวมการ implement หรือ refactor (ใช้ `/refactor`)

## Execute

### 1. Identify Principle From Filename

> Goal: ระบุ principle และ category จาก file name

1. ระบุ principle จาก file name (เช่น `single-responsibility.ts` → SRP)
2. ระบุ category ของ principle: SOLID, General, Architecture, Functional
3. วิเคราะห์ expected behavior ของ principle นั้น
4. ถ้าไม่ match กับ principle ใด → stop และ report

### 2. Check File Matches Principle

> Goal: อ่านไฟล์และตรวจสอบ structure, logic, และ naming

1. อ่านไฟล์เป้าหมายทั้งหมด
2. ตรวจสอบ structure, logic, และ naming match กับ principle หรือไม่
3. ทำ `/update-review-cli-and-run` สำหรับปรับปรุง naming ให้ match กับ principle

### 3. Analyze Violations

> Goal: ระบุและจัดลำดับ violations ตามความรุนแรง

1. ระบุ violations ของ principle ที่พบในไฟล์
2. จัดลำดับ severity: Critical (ทำลาย principle อย่างสิ้นเชิง), High (สำคัญแต่ยังทำงานได้), Medium (ควรแก้), Low (minor)
3. ระบุส่วนที่ match และไม่ match กับ principle

### 4. Provide Recommendations

> Goal: แนะนำการแก้ไขและ patterns ที่ match กับ principle

1. แนะนำการแก้ไข violations แต่ละข้อ
2. แนะนำ patterns ที่ match กับ principle
3. ระบุ examples ที่ดีใน codebase ถ้ามี
4. ทำ `/suggest-next-action` เพื่อแนะนำ workflow ถัดไป

## Rules

### 1. Common Principles

- SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- DRY: Don't Repeat Yourself
- KISS: Keep It Simple, Stupid
- YAGNI: You Aren't Gonna Need It
- Separation of Concerns: แยก concerns ตาม responsibilities
- Clean Architecture: Layer separation ตาม architecture
- Functional Programming: Pure functions, immutability
- Test-Driven Development: Test ก่อน implement

### 2. Filename Matching

- `single-responsibility.ts` → SRP
- `open-closed.ts` → OCP
- `dry-utils.ts` → DRY
- `simple-component.ts` → KISS
- `clean-architecture.ts` → Clean Architecture
- ใช้ kebab-case สำหรับ principle names ใน filename
- ตรวจสอบ keywords ใน filename เพื่อระบุ principle

### 3. File Checking Criteria

- SRP: ไฟล์และ functions ต้องมี single responsibility
- DRY: ไม่มี code duplication หรือ logic ที่ซ้ำกัน
- KISS: logic ต้องเรียบง่าย ไม่ซับซ้อน ไม่ over-engineering
- Clean Architecture: ต้องมี layer separation ชัดเจน และ dependencies ถูกต้อง
- Separation of Concerns: concerns ต้องแยกชัดเจน ทั้ง logic และ naming

### 4. Violation Severity

- Critical: ทำลาย principle อย่างสิ้นเชิง
- High: violations ที่สำคัญแต่ยังทำงานได้
- Medium: violations ที่ควรแก้แต่ไม่ critical
- Low: minor violations ที่ไม่ส่งผลต่อ functionality

## Expected Outcome

- Principle ที่ match กับ file name ถูกระบุ
- Violations ของ principle ถูกระบุและจัดลำดับตาม severity
- Recommendations สำหรับการแก้ไขถูกให้พร้อม actionable steps
- รายงานตาราง: Principle, Match Status, Violations (severity), Recommendations
