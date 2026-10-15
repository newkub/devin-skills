---
name: idea-features
description: สร้าง 30 ไอเดียฟีเจอร์ (extends + new + platform) — ตอบตารางเดียวในแชท เรียงตาม impact ไม่สร้างไฟล์
argument-hint: "[topic]"
related:
  - idea
  - deep-analyze
  - learn-from-codebase
  - reframe
  - ask-me
  - suggest-next-action
  - implement-to-production
  - create-plan-in-dot-devin
  - improve
  - bench-competitors
---

## Goal

สร้าง 30 ไอเดียฟีเจอร์สำหรับ project/topic — ครอบคลุม `extends` (ขยายของเดิม), `new` (net-new capability) และ `platform` (cross-cutting: auth, security, performance, stability, release, observability) — ตอบในแชทเป็น **ตารางเดียว** เรียงตาม impact ไม่สร้างไฟล์ใด ๆ

## Scope

- output = ตารางในแชทเท่านั้น — ไม่มี web viewer, ไม่มี `ideas.json`, ไม่เขียนไฟล์ลง temp/skill dir/target repo อีกต่อไป (โมเดลเดิมถูกถอดออกแล้ว)
- idea ที่เป็น gap-fix ของ implementation เดิม → `/improve features`; ต้องการ market evidence สำหรับ net-new → `/bench-competitors`
- ไม่ implement ไอเดีย — idea ที่ user confirm ส่งต่อ `/create-plan-in-dot-devin` เสมอ แล้วจึง `/implement-to-production`
- UX/UI ล้วน ๆ ไม่เจาะ feature set → `/idea-uxui` แทน

## Execute

### 1. Understand Context

> Goal: เข้าใจ topic และ project จริงก่อนคิดไอเดีย

1. รับ `<topic>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/learn-from-codebase` แบบ lightweight เพื่อ ground ไอเดียกับ codebase จริง — ดู routes, commands, features หลักของ target project
3. อ่าน manifest + structure เพื่อรู้ architecture pattern — ห้ามเดา path/surface ในคอลัมน์ Usage
4. เสนอ topic clusters (เช่น reporting, ux, data, mobile, privacy, workflow) — ถ้ากว้างเกิน ให้ `/ask-me` multi-select เลือก cluster; default: กระจาย 30 ไอเดียทุก cluster

### 2. Generate 30 Ideas

> Goal: 30 ไอเดียครบทุกคอลัมน์ ไม่มี placeholder

สร้าง **30 รายการเสมอ** ผสม `extends` + `new` + `platform` ตามสัดส่วน topic ที่เลือก — ทุกแถวของตารางต้องมีครบ 9 คอลัมน์:

| คอลัมน์ | เนื้อหา |
|---------|---------|
| No. | 1–30 (continuous หลัง sorting แล้ว) |
| Features | ชื่อไอเดียสั้นกระชับ |
| Description | ไอเดียนี้คืออะไร ทำอะไรได้ 3–5 bullet ย่อบรรทัดด้วย `<br>` ได้ |
| Why | pain/motivation หลังรองรับจาก context จริง — ห้าม generic |
| Benefit | outcome ที่ผู้ได้ (user/team/system) ได้รับเป็นรูปธรรม |
| Usage | วิธีใช้/ทางเข้าจริงของ feature (route, command, API, flow) ตาม structure จริงของ target |
| Tags | `kind` (`extends`/`new`/`platform`) + category เช่น `auth`, `dx`, `perf` |
| Impact | High = เปลี่ยนผลลัพธ์จริง / Medium = ดีขึ้นชัดเจน / Low = nice-to-have |
| Risk | risk หลักของไอเดีย (สั้น): security, complexity, breaking change, dependency |

### 3. Sort And Answer In Chat

> Goal: ตารางเดียว อ่านเรียงตามความสำคัญ

1. **Sort ตาม Impact: High → Medium → Low** — ภายใน impact เท่ากัน จัด `new`/`platform` ที่ unlock งานอื่นไว้ก่อน; renumber `No.` หลัง sort
2. ตอบในแชทเป็น **ตาราง markdown เดียว** ครบ 30 แถว — ไม่แยก group, ไม่สร้างไฟล์, ไม่ serve อะไร
3. ปิดท้ายด้วยสรุปสั้น: สัดส่วน extends/new/platform, จำนวน High-impact, ไอเดียที่แนะนำเริ่มก่อน 3 อัน + เหตุผล
4. ทำ `/suggest-next-action` — idea ที่ user confirm → `/create-plan-in-dot-devin` → `/implement-to-production`

## Rules

- 30 ไอเดียเสมอ — ห้ามน้อยกว่า; ทุกคอลัมน์มีค่าจริง ห้าม placeholder
- แชทเท่านั้น — ห้ามสร้างไฟล์ viewer/data/รายงาน; ถ้า user อยากได้ไฟล์รายงาน → ใช้ `/create-report-in-dot-devin` ต่างหาก
- `new` ต้องเป็น net-new capability จริง (flow/module/integration/surface ใหม่) — การอุด gap ของเดิม = `extends`
- ทุก Description/Why/Usage อ้างอิง context จริงของ target project — ห้ามเสนอ feature ที่ขัด architecture ที่มี
- ใช้ `/reframe` ถ้าไอเดียจำเจหรือติดกรอบเดิม

## Expected Outcome

- ตารางเดียวในแชท: 30 ไอเดีย × 9 คอลัมน์ (No., Features, Description, Why, Benefit, Usage, Tags, Impact, Risk) เรียงตาม impact
- สัดส่วน kind (extends/new/platform) ชัดเจน และมี 3 ไอเดียแนะนำเริ่มแรกพร้อมเหตุผล
- ไม่มีไฟล์ใดถูกสร้างใน process นี้
