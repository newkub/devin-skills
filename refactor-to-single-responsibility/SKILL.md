---
name: refactor-to-single-responsibility
description: Refactor code ให้เป็น SRP โดยวิเคราะห์ structure และอัปเดท references
---

## Goal

Refactor code ให้ทุก unit มี single responsibility (SRP) โดยเริ่มจากการวิเคราะห์ structure แล้วแก้ไขพร้อมอัปเดท references ครบถ้วน

## Scope

- ใช้ภายใต้ `/refactor` เมื่องาน refactor ครบวงจร

- ใช้กับ source code ใน project หรือ workspace ที่พบ SRP violations เช่น ไฟล์/ฟังก์ชัน/class ทำหลายหน้าที่ โดยใช้ `/check-code-structure` เพื่อหา issues และ `/edit-relative` เพื่ออัปเดท references หลังการเปลี่ยนแปลง

## Execute

### 1. Analyze Code Structure

> Goal: วิเคราะห์ structure ก่อน refactor

1. ทำ `/check-code-structure` เพื่อดู top-level symbols, exports, members, imports, และ cohesion
2. ระบุ SRP violations ด้วย ast-grep outline ผ่าน `/check-code-structure`
3. ระบุ units ที่ violate SRP จาก thresholds:
   - ไฟล์มี top-level symbols เกิน 5 อันที่ไม่เกี่ยวข้องกัน
   - function/class มี public members เกิน 10 หรือทำหลายหน้าที่
   - imports ข้าม boundary หรือ layer
   - exports ที่ควรเป็น internal
4. ทำ `/check-long-files` เพื่อหาไฟล์ที่ยาวกว่า 250 บรรทัด
5. ถ้าไม่พบ issues → stop และ report

### 2. Plan Refactor

> Goal: วางแผนการแก้ไข

1. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขต
2. ทำ `/plan` เพื่อวางแผน split/extract/rename
3. ระบุ consumers และ public API ที่จะกระทบ
4. กำหนดลำดับการทำงาน: เริ่มจาก leaf units ที่ไม่มี dependency ก่อน

### 3. Refactor To Single Responsibility

> Goal: แยก/ extract units ให้ทำหน้าที่เดียว

1. แยก multi-responsibility functions ออกเป็น functions ย่อย
2. แยก multi-responsibility classes/types ออกเป็น types ย่อยด้วย composition
3. แยกไฟล์ที่มีหลาย concerns ออกเป็นไฟล์ย่อยตาม domain
4. ทำ `/refactor` ตามกรณี
5. ทำ `/restructure` หรือ `/relocation` เมื่อต้องย้ายไฟล์
6. ทำ `/rename` เมื่อต้องเปลี่ยนชื่อ identifier
7. ถ้าเป็น monorepo → ทำ `/all-workspace` หรือ `/refactor-packages` ตามความเหมาะสม

### 4. Update References

> Goal: อัปเดท references ทั้งหมดหลังการเปลี่ยนแปลง

1. ทำ `/edit-relative` เพื่ออัปเดท relative paths, imports, exports, และ references ทั้งหมด
2. ทำ `/update-reference` เพื่ออัปเดท references ใน global workflows/skills, AGENTS.md, .devin/rules, และ codebase
3. ค้นหา references เก่าอีกครั้งเพื่อยืนยันว่าไม่เหลือ
4. ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Verify

> Goal: ตรวจสอบว่า refactor สำเร็จและไม่มี regression

1. ทำ `/check-code-structure` อีกครั้งเพื่อเปรียบเทียบก่อน/หลัง
2. ทำ `/run-verify` สำหรับ lint, typecheck, scan
3. ทำ `/run-test` สำหรับ regression
4. ทำ `/check-circular-dependencies` และ `/review-quality`
5. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3-4 (สูงสุด 3 ครั้ง → stop/report)

### 6. Report

> Goal: รายงานผล refactor

1. สร้างตาราง Before/After: file, top-level symbols, public members, SRP status
2. รายงาน actions ที่ทำ: split, extract, rename, move, reference updates
3. ระบุ TODO หรือข้อควรระวังถ้ามี

## Rules

### 1. SRP Criteria

- หนึ่ง function ทำหนึ่ง operation
- หนึ่ง class/type ดูแลหนึ่ง responsibility
- หนึ่ง file ครอบคลุมหนึ่ง concern หรือ domain
- ไฟล์ไม่เกิน 250 บรรทัด

### 2. Minimal Change

- ทำ `/dont-over-engineer` เสมอ
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น
- รักษา public API ที่มีอยู่ถ้าไม่จำเป็นต้องเปลี่ยน

### 3. Reference Safety

- ทำ `/edit-relative` และ `/update-reference` หลังทุกการ split, rename, ย้าย, หรือลบ
- ตรวจสอบ imports, barrel exports, path aliases ให้ถูกต้อง

### 4. Verification

- ต้องรัน `/check-code-structure` ก่อนและหลัง refactor
- ต้องผ่าน `/run-verify` และ `/run-test` ก่อนถือว่าเสร็จ

## Expected Outcome

- Code units มี single responsibility ชัดเจน
- Files ไม่เกิน 250 บรรทัด ยกเว้น cohesive index/barrel
- References ทั้งหมดถูกต้อง ไม่มี broken imports
- Lint, typecheck, test ผ่าน
- มีรายงาน before/after ของ SRP metrics

## References

- ไม่มี nested references (ใช้ `/check-code-structure` และ `/check-long-files` แทน)
