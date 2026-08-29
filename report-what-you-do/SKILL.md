---
name: report-what-you-do
description: รายงานสิ่งที agent กำลังทำ ทำไม และขั้นตอนถัดไปแบบ real-time
---

## Goal

รายงานสิ่งที agent กำลังทำอยู่ให้ user ทราบแบบ real-time โดยไม่ต้องรอจบ task ทำให้ user ติดตามความคืบหน้า เข้าใจเหตุผลของแต่ละ action และมั่นใจว่างานไม่หลงทาง

## Scope

ใช้เมื่อ:
- กำลังจะเริ่ม action สำคัญ หรือ action ที user อาจสงสัย
- อยู่ระหว่างทำงานทีใช้เวลานาน หรือมีหลายขั้นตอน
- user ถามว่า "กำลังทำอะไรอยู่" หรือ "ทำไมถึงทำแบบนี้"
- ทำงานกับ external services หรือ subprocess ทีอาจล่าช้า
- ต้องการ explain ทีมเหตุผลก่อนทำการเปลี่ยนแปลง

## Execute

### 1. Identify Current Action

> Goal: บอกชัดเจนว่ากำลังทำอะไร

1. ระบุชื่องานทีกำลังทำ เช่น "กำลัง run typecheck", "กำลัง deploy", "กำลังแก้ไข mcp.ts"
2. ระบุเป้าหมายของ action นั้นในประโยคเดียว
3. ถ้าเป็น sub-task ให้บอกว่าเป้นลำดับทีเท่าไร จากทั้งหมดกี่ขั้นตอน

### 2. Explain Why

> Goal: ให้ user เข้าใจเหตุผล

1. อธิบายสั้นๆ ว่าทำไมถึงต้องทำ action นี้
2. เชื่อมโยงกับ request หรือ goal ของ user
3. ถ้ามี trade-off หรือทางเลือกอื่น ระบุสั้นๆ

### 3. Report Progress And Next Step

> Goal: รู้ว่าไปต่อยังไง

1. บอกสถานะปัจจุบัน: `in_progress`, `waiting`, `retry`, `done`
2. ระบุขั้นตอนถัดไป 1-2 ขั้น
3. ถ้ามี blocker หรือต้องรอ user ให้บอกทันที

### 4. Keep It Concise

> Goal: อ่านง่าย ไม่กวนสมาธิ

1. ใช้ bullet points สั้นๆ 1-3 ข้อ
2. หลีกเลี่ยงรายละเอียดทีเทคนิคเกินไป
3. ใช้ symbols: 🔄 กำลังทำ, ⏳ รอ, ✅ เสร็จ, ⚠️ ติดปัญหา

## Rules

### 1. Timing

- รายงานก่อนเริ่ม action ทีใช้เวลานาน (>10s)
- รายงานระหว่างทำถ้า action ยาวกว่า 30s
- รายงานทันทีเมื่อ action สำคัญเสร็จ หรือพบปัญหา
- ไม่ต้องรายงานทุก action ที trivial เช่น เปิดไฟล์หรืออ่าน 1-2 บรรทัด

### 2. Content

- บอก `what`, `why`, `next` ครบ
- ไม่ over-share logs ยาว ให้สรุปเป็นสาระ
- ไม่ claim success จนกว่าจะ verified
- ถ้าผิดพลาด บอกสั้นๆ พร้อมแผนแก้ไข

### 3. Tone

- ใช้ภาษาไทยตาม default ของ user
- สุภาพ กระชับ ไม่ defensive
- ไม่ขอโทษถ้าไม่จำเป็น

## Integration With Other Skills

`report-what-you-do` ควรถูกเรียกโดย skills ที่:

| Skill / Skill Group | เหตุผลทีควร integrate |
|---|---|
| `/ship`, `/ship-to-cloud`, `/ship-release` | มีหลายขั้นตอน: verify, build, deploy, commit |
| `/deep-analyze`, `/deep-research`, `/deep-plan` | ใช้เวลานาน มีหลาย phase |
| `/resolve-errors` | ต้อง trial-and-error หลายรอบ |
| `/run-verify-on-ci-cd`, `/watch-ci-cd` | รอ external pipeline |
| `/watch-browser-and-fix`, `/watch-browser-and-test-all-routes` | ต้อง test หลายหน้า |
| `/implement-from-gist-idea` | ทำตาม list ยาว |
| `/follow-*` skills ทีซับซ้อน | เช่น `follow-agents-md`, `follow-framework-*` |
| `/consider-use-subagents` | มีการ delegate งานไป subagents |
| `/deep-ship`, `/deep-validate` | มี validation หลายรอบ |

## Expected Outcome

- user ทราบสิ่งที agent ทำอยู่ตลอดเวลา
- ลดความไม่แน่นอนและความกังวลในระหว่างทำงานยาว
- เปิดโอกาสให้ user หยุด/แก้ไขทิศทางได้เร็วขึ้น
- เพิ่ม transparency โดยไม่ลดความเร็วของงาน
