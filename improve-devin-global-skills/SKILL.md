---
name: improve-devin-global-skills
description: ปรับปรุง devin global skills ให้สอดคล้องและมีคุณภาพสูง — orchestrator สำหรับ improve workflow
argument-hint: "[scope]"
related:
  - review-devin-global-harness
  - review
  - review-gaps
  - deep-review
  - update-devin-global-skills
  - improve
  - check-broken-skills-references
  - follow-parallel
  - use-subagents
  - update-references
  - learn
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

ปรับปรุง devin global skills ให้สอดคล้อง ครบถ้วน และมีคุณภาพสูง โดยเรียก `/improve`, `/review-devin-global-harness`, และ `/update-devin-global-skills` ตามลำดับ

## Scope

ใช้สำหรับงานใหญ่ที่ต้องการจัดการ global skills repo ทั้งหมดหรือชุด skill ที่ต้องปรับปรุง ไม่แก้ไขโดยตรง เป็น orchestrator เท่านั้น

## Execute

### 1. Review Current State

> Goal: รู้ว่าต้องปรับปรุงอะไร — ครอบคลุมทุก review dimension ที่เกี่ยวข้อง

1. ทำ `/review-devin-global-harness` เพื่อหา findings (tier `core` — ทำเสมอ)
2. ทำ `/check-broken-skills-references` เพื่อหา broken references
3. Dispatch `review-*` ตาม [references/review-skills-map.md](references/review-skills-map.md):
   - เลือก tier `skills-repo` ที่ condition ตรง (default สำหรับ global skills repo)
   - เลือก tier `domain` เฉพาะที่ตรงกับ skill ใน scope
   - เลือก tier `target` ตาม artifact ใน scope (diff, PR, issue, plan)
   - independent → ทำ `/follow-parallel` หรือ `/use-subagents` (≤10 ต่อ batch)
4. บันทึก baseline score และ grade

### 2. Identify Improvements

> Goal: จัดลำดับสิ่งที่ควรปรับปรุง

1. ทำ `/improve <scope>` เพื่อรับ prioritized improvement list
2. ทำ `/learn` (web) เพื่อดึง best practices/conventions ล่าสุดจาก official docs ก่อนตัดสินใจแก้ไข
3. กรอง findings ที่ duplicate หรือ false positive
4. จัดกลุ่มตาม priority: structure, references, content, formatting

### 3. Apply Updates

> Goal: แก้ไข skills ตามลำดับ

1. ทำ `/update-devin-global-skills` กับ skill หรือกลุ่มที่เลือก
2. ถ้ามีหลายอันที่อิสระ → ทำ `/follow-parallel` หรือ `/use-subagents`
3. หลังแก้ไขทุกกลุ่ม → ทำ `/update-references`

### 4. Validate

> Goal: ยืนยันว่าผ่านเกณฑ์

1. ทำ `/review-devin-global-harness` อีกครั้ง
2. ทำ `/check-broken-skills-references` อีกครั้ง
3. Re-dispatch `review-*` ที่เคยมี findings เพื่อยืนยันว่าหมดแล้ว
4. ถ้าผ่าน → ทำ `/deep-validate`
5. ถ้าไม่ผ่าน → กลับไป step 2

### 5. Report

> Goal: สรุปผล

1. ทำ `/report` คอลัมน์: `No.`, `Skill`, `Action`, `Before`, `After`
2. ทำ `/suggest-next-action`

## Rules

- ไม่แก้ไขไฟล์โดยตรง เป็น orchestrator เท่านั้น
- ทำ `/review-devin-global-harness` ก่อนปรับปรุงเสมอ
- เลือก `review-*` จาก [references/review-skills-map.md](references/review-skills-map.md) เท่านั้น — ทุกตัวใน map ต้องมี skill จริง
- ทำ `/improve` ก่อน `/update-devin-global-skills`
- ยืนยัน validation ผ่านก่อนจบ
- ถ้ามี breaking changes → ขอ user ยืนยัน

## References

- [Review skills map — review-* ทั้ง 54 ตัวแบ่งตาม tier](references/review-skills-map.md)
- ใช้ /review-gaps ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น


## Expected Outcome

- Findings จาก `/review-devin-global-harness` ลดลงหรือหมด
- Broken references ไม่มี
- Skills ที่ปรับปรุงสอดคล้องกับ conventions
- รายงาน before/after ครบ
