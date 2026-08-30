---
name: validate-score-and-report
description: Validate findings, calculate score, and report
---

# Validate, Score And Report

## Goal

findings ถูกต้อง พร้อม review score

## Scope

ใช้สำหรับ validate findings, จัดลำดับ severity, คำนวณ score, รายงานผล และแนะนำ action ถัดไป

## Execute

1. ทำ `/deep-validate` เพื่อ validate findings ทุกรายการ
2. ทำ `/deep-validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. คำนวณ review score ตาม `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

- ทุก finding ต้องมี file path, line number, function/query/config ที่เกี่ยวข้อง
- ระบุ dimensions ที่ถูก skip ใน report
- ไม่นับ dimensions ที่ถูก skip ใน overall score
- ใช้ score เปรียบเทียบ before/after เท่านั้น ไม่ใช้สำหรับ pass/fail
- ไม่ใช้ `**` สำหรับ emphasis — ใช้ backticks

## Expected Outcome

- รายงาน performance findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
