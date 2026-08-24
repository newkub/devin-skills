---
name: review-debugging
description: Review debuggability ครอบคลุม logging, error messages, naming, complexity พร้อม review score
---

## Goal

Review debuggability ครอบคลุม logging context, error messages clarity, naming conventions, code complexity พร้อม review score

## Scope

debuggability review สำหรับ: logging statements, error messages, naming conventions, code complexity, nesting levels, self-documenting code — ไม่รวมการ fix (ใช้ `/review-codebase` สำหรับ fix)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ debuggability ปัจจุบันของ codebase

1. ทำ `/scan-codebase`, ตรวจสอบ logging statements ทั้งหมด
2. ตรวจสอบ error messages ทั้งหมด
3. ตรวจสอบ naming conventions
4. ตรวจสอบ code complexity และ nesting

### 2. Analyze Logging Quality

> Goal: รู้ว่า logging มี context เพียงพอหรือไม่

1. ตรวจสอบ logging มี context ครบถ้วน
2. ตรวจสอบใช้ structured logging
3. ตรวจสอบ log levels ที่เหมาะสม (debug, info, warn, error)
4. ตรวจสอบ timestamps และ correlation IDs
5. ระบุ logging ที่ซ้ำซ้อน

### 3. Analyze Error Messages

> Goal: รู้ว่า error messages ชัดเจนและ actionable หรือไม่

1. ตรวจสอบ error messages ชัดเจนและเป็นประโยค
2. ตรวจสอบมี context ที่เกี่ยวข้อง
3. ตรวจสอบระบุสาเหตุและวิธีแก้ไข
4. ตรวจสอบใช้ typed error classes
5. ระบุ generic error messages ที่ไม่มีประโยชน์

### 4. Analyze Naming And Complexity

> Goal: รู้ว่า naming และ complexity เหมาะสมหรือไม่

1. ตรวจสอบ naming บ่งบอกถึง purpose
2. ตรวจสอบ verbs สำหรับ functions, nouns สำหรับ variables และ types
3. ตรวจสอบ abbreviations ที่ไม่ชัดเจน
4. ตรวจสอบ nesting levels สูงสุด 3 levels
5. ตรวจสอบ functions ที่ยาวกว่า 50 บรรทัด
6. ตรวจสอบ early returns และ guard clauses

### 5. Score And Report

> Goal: Report ชัดเจน  actionable สอดคล้อง Goal

1. ให้ score ตาม debuggability: logging quality, error message clarity, naming, complexity
2. จำแนก severity: critical (no logging), high (generic errors), medium (poor naming), low (high complexity)
3. รายงานเป็นตาราง: category | issues found | severity | action item
4. ทำ `/suggest-next-action` สำหรับขั้นตอนถัดไป

## Rules

### 1. Logging Assessment

- Logging ทุกครั้งต้องมี context
- ใช้ structured logging เสมอ
- ใช้ log levels ที่เหมาะสม
- หลีกเลี่ยง logging ที่ซ้ำซ้อน

### 2. Error Message Assessment

- Error messages ต้องชัดเจนและเป็นประโยค
- ต้องระบุสาเหตุและวิธีแก้ไข
- ต้องมี context ที่เกี่ยวข้อง
- หลีกเลี่ยง generic error messages

### 3. Non-Redundancy

- รายละเอียดการ fix อยู่ใน `/review-codebase` แล้ว
- รายละเอียด debugging principles อยู่ใน `/follow-debugging` แล้ว
- workflow นี้เป็น review เท่านั้น ไม่ fix

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder

## Expected Outcome

- ตาราง: category | issues found | severity | action item
- Debuggability gaps ถูกระบุและจัดลำดับ
- Review score สำหรับ debuggability
- Action items ชัดเจนสำหรับขั้นตอนถัดไป
