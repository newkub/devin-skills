---
name: idea-features
description: สร้างไอเดีย features ใหม่และปรับปรุง features ที่มีอยู่ วิเคราะห์ gaps และ user needs ด้วย continuous numbering
---

## Goal

สร้างไอเดีย features ใหม่และปรับปรุง features ที่มีอยู่ วิเคราะห์ gaps, user needs และ market trends ด้วย continuous numbering และ scope ที่ชัดเจน

## Scope

ครอบคลุมการวิเคราะห์โปรเจกต์ การวางแผน architecture การกำหนดลำดับ implement และการตอบผลลัพธ์ในแชท — ไม่รวมการเปรียบเทียบ competitors โดยตรง (ใช้ `/compare-and-idea-features` แทน)

## Execute

### 1. Internal Analysis (เงียบ — ไม่ต้องแสดงผลในแชท)

วิเคราะห์ภายในเพื่อเข้าใจโครงสร้าง หา gaps และสร้างไอเดีย — ห้ามแสดงผลของขั้นตอนนี้ในแชท

> Goal: เข้าใจ project, packages, existing features, market trends และได้ไอเดีย features

1. ทำ `/analyze-project`, อ่าน `.devin/features/<workspace>/features.md`, วิเคราะห์ packages และกำหนด scope (internal)
2. ทำ `/learn-from-web` เพื่อศึกษา market trends, user needs และ competitor features จากแหล่งข้อมูลภายนอก (internal)
3. วิเคราะห์ข้อมูลจาก `/learn-from-web` เพื่อระบุ gaps และ opportunities (internal)
4. สร้างไอเดีย Extends และ New features (internal)
5. จัดลำดับตาม RICE — คำนวณ MVP Score 1-10 (internal)
6. ถ้าเข้าถึง project ไม่ได้ → stop และ report

### 2. Present Results (ตอบในแชท — ภาษาไทย)

ตอบผลลัพธ์ในแชทเป็นภาษาไทย เฉพาะส่วนที่ผู้ใช้ต้องการ

> Goal: ตอบกระชับ เป็นภาษาไทย มีแค่ 2 ตาราง + diagrams + suggest-next-action

1. ตอบ 2 ตาราง (Extends และ New) ในแชท พร้อม 27 คอลัมน์ตาม Rules — ภาษาไทย
2. ทำ `/report-format-table`, ทำ `/report-uxui-sketch` (features ที่ UX/UI = 🔴 หรือ 🟡), ทำ `/report-architecture-diagram` (จาก codebase จริง)
3. ทำ `/suggest-next-action` — แนะนำ action ถัดไป
4. ไม่สร้างไฟล์ .md, .html หรือ .json — ตอบในแชทเท่านั้น
5. ห้ามแสดงผลวิเคราะห์ยาวๆ เช่น existing features list, step-by-step analysis, market research details

## Rules

### 1. Group By Type With Continuous Numbering

- แยกเป็น 2 ตารางตาม Type: Extends และ New
- Continuous numbering รวมทั้ง 2 ตาราง: Extends เริ่มจาก 1, New ต่อจากเลขสุดท้ายของ Extends
- แต่ละตาราง 20 row, รวมกันไม่เกิน 40 row
- Sorting: เรียงตามลำดับเลข (#) ก่อน แล้วตาม Impact (🔴 → 🟡 → 🟢)
- Description สั้นกระชับ ไม่เกิน 1 บรรทัด
- Scope ระบุ: package-level, app-level, หรือ cross-package

### 2. Column Order (27 คอลัมน์)

- ลำดับ: # | Priority | Impact | Feature | Description | Why | How To | Phase | Effort | Difficult | Scope | Interface | Target | Topics | Deps | Feature Deps | Routing | Components | Types | API | DB | Risk | Breaking | Estimate | MVP Score | KPI | UX/UI
- Impact: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- Priority: P0 (critical), P1 (high), P2 (medium), P3 (low) — ลำดับ business แยกจาก Impact
- Phase: MVP, v2, v3
- Effort: S, M, L, XL
- Difficult: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
- Interface: api, cli, web, mobile, library, sdk
- Target: customer, provider, staff, admin, partner, multiple
- Deps: dependencies สั้นๆ เช่น `supabase`, `stripe`, `-` ถ้าไม่มี
- Feature Deps: features ที่ต้องทำก่อน เช่น `#3, #7`, `-` ถ้าไม่มี
- Routing: route paths เช่น `/provider/$id/services`, `-` ถ้าไม่มี
- Components: UI components เช่น `FormBuilder, FieldEditor`, `-` ถ้าไม่มี
- Types: TypeScript types เช่น `BookingForm, PricingTier`, `-` ถ้าไม่มี
- API: endpoints เช่น `POST /api/bookings`, `-` ถ้าไม่มี
- DB: tables เช่น `bookings`, `spaces`, `-` ถ้าไม่มี
- Risk: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- Breaking: yes, no — เป็น breaking change หรือไม่
- Estimate: เวลาประมาณ เช่น `1d`, `3d`, `1w`, `2w`
- MVP Score: RICE 1-10
- KPI: metric วัด success เช่น `conversion_rate, retention`, `-` ถ้าไม่มี
- UX/UI: 🔴 ต้องปรับเยอะ, 🟡 ปรับบางส่วน, 🟢 ใช้ existing UI

### 3. Summary Tables

- สรุป DB tables ที่จะสร้าง/แก้
- สรุป API endpoints ที่จะสร้าง
- สรุป Components ที่จะสร้าง/แก้
- สรุป Files ที่จะสร้าง/แก้

### 4. Define Problem First

- ทุก feature ต้อง solve real problem — ถ้าไม่มี problem ชัดเจน → ไม่เสนอ
- Validate ว่า users ต้องการจริง
- Focus บน pain points ที่มี impact สูง

### 5. Start With MVP

- เริ่มด้วย minimum viable version
- Build iteratively ไม่ใช่ big bang
- กำหนด MVP scope ชัดเจนสำหรับแต่ละ feature

### 6. Assess Technical Feasibility

- ประเมิน effort อย่าง realistic
- พิจารณา long-term maintenance cost
- ระบุ technical debt ที่อาจเกิด

### 7. Direct Execution

- ถ้าผู้ใช้สั่ง "ทำ ... ให้" → ทำ `/refactor` และ `/realize-implementation` เลย ไม่ต้องทำตาม workflow ปกติ
- ถ้าผู้ใช้สั่ง implement เฉพาะ feature → ทำ `/implement-features-to-mvp` เลย
- ถ้าผู้ใช้สั่ง implement features ที่ขาดทั้งหมด → ทำ `/review-codebase` เลย

## Expected Outcome

- 2 ตาราง (Extends และ New) พร้อม 27 คอลัมน์, continuous numbering, ตารางละ 20 row รวมไม่เกิน 40 row — ภาษาไทย
- ตาราง New ต่อเลขจากตาราง Extends (ไม่เริ่ม 1 ใหม่)
- เรียงลำดับตาม Impact (🔴 → 🟡 → 🟢)
- ANSI UX/UI sketch จาก `/report-uxui-sketch`
- ANSI architecture diagram จาก `/report-architecture-diagram`
- แนะนำ action ถัดไปจาก `/suggest-next-action`
- ตอบกระชับ ไม่มีวิเคราะห์ยาวๆ — ตอบเฉพาะตาราง + diagrams + next action
- ไม่สร้างไฟล์ใดๆ ตอบในแชทเท่านั้น
