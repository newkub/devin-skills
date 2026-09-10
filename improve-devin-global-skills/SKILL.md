---
name: improve-devin-global-skills
description: ปรับปรุง devin global skills ให้สอดคล้องและมีคุณภาพสูง — orchestrator สำหรับ improve workflow
argument-hint: "[scope]"
related:
  - review-devin-global-skills
  - update-devin-global-skills
  - improve
  - check-broken-skills-references
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

ปรับปรุง devin global skills ให้สอดคล้อง ครบถ้วน และมีคุณภาพสูง โดยเรียก `/improve`, `/review-devin-global-skills`, และ `/update-devin-global-skills` ตามลำดับ

## Scope

ใช้สำหรับงานใหญ่ที่ต้องการจัดการ global skills repo ทั้งหมดหรือชุด skill ที่ต้องปรับปรุง ไม่แก้ไขโดยตรง เป็น orchestrator เท่านั้น

## Execute

### 1. Review Current State

> Goal: รู้ว่าต้องปรับปรุงอะไร

1. ทำ `/review-devin-global-skills` เพื่อหา findings
2. ทำ `/check-broken-skills-references` เพื่อหา broken references
3. บันทึก baseline score และ grade

### 2. Identify Improvements

> Goal: จัดลำดับสิ่งที่ควรปรับปรุง

1. ทำ `/improve <scope>` เพื่อรับ prioritized improvement list
2. ทำ `/learn-web` เพื่อดึง best practices/conventions ล่าสุดจาก official docs ก่อนตัดสินใจแก้ไข
3. กรอง findings ที่ duplicate หรือ false positive
4. จัดกลุ่มตาม priority: structure, references, content, formatting

### 3. Apply Updates

> Goal: แก้ไข skills ตามลำดับ

1. ทำ `/update-devin-global-skills` กับ skill หรือกลุ่มที่เลือก
2. ถ้ามีหลายอันที่อิสระ → ทำ `/follow-parallel` หรือ `/use-subagents`
3. หลังแก้ไขทุกกลุ่ม → ทำ `/update-references`

### 4. Validate

> Goal: ยืนยันว่าผ่านเกณฑ์

1. ทำ `/review-devin-global-skills` อีกครั้ง
2. ทำ `/check-broken-skills-references` อีกครั้ง
3. ถ้าผ่าน → ทำ `/deep-validate`
4. ถ้าไม่ผ่าน → กลับไป step 2

### 5. Report

> Goal: สรุปผล

1. ทำ `/report` คอลัมน์: `No.`, `Skill`, `Action`, `Before`, `After`
2. ทำ `/suggest-next-action`

## Rules

- ไม่แก้ไขไฟล์โดยตรง เป็น orchestrator เท่านั้น
- ทำ `/review-devin-global-skills` ก่อนปรับปรุงเสมอ
- ทำ `/improve` ก่อน `/update-devin-global-skills`
- ยืนยัน validation ผ่านก่อนจบ
- ถ้ามี breaking changes → ขอ user ยืนยัน

## Expected Outcome

- Findings จาก `/review-devin-global-skills` ลดลงหรือหมด
- Broken references ไม่มี
- Skills ที่ปรับปรุงสอดคล้องกับ conventions
- รายงาน before/after ครบ
