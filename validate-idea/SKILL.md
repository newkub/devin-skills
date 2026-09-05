---
name: validate-idea
description: ตรวจสอบและประเมินไอเดียก่อน implement ว่าคุ้มค่า ทำได้ และสอดคล้องกับ project
argument-hint: "[scope]"
related:
  - idea-features
  - deep-idea-features
  - research-setup
  - deep-research
  - learn-from-web
  - follow-my-tech-stack
  - follow-best-practice
  - suggest-next-action
  - pick-bestest
---

## Goal

ตรวจสอบและประเมินไอเดีย เพื่อตัดสินใจว่าควร implement หรือไม่ ก่อนลงมือเขียน code

## Scope

ใช้กับทุกไอเดียฟีเจอร์ การเปลี่ยนแปลง หรือ proposal ที่ต้องตรวจสอบความเป็นไปได้และความคุ้มค่าก่อน execute

ดูเพิ่มเติม: /deep-idea-features

## Execute

### 1. Capture Idea

> Goal: เข้าใจไอเดียและบริบท

1. รับไอเดียจาก prompt หรือ output ของ `/idea-features`
2. สรุปเป็น 1-2 ประโยค ชัดเจนและวัดผลได้
3. ระบุ problem, target user, และ expected outcome

### 2. Research Context

> Goal: ตรวจสอบข้อมูลและแหล่งอ้างอิง

1. ทำ `/research-setup` เพื่อหา setup/config/CI ที่เกี่ยวข้อง
2. ทำ `/deep-research` เพื่อเปรียบเทียบ alternatives ทีมี
3. ทำ `/learn-from-web` เพื่อศึกษา best practices
4. ตรวจ official docs และ changelogs ถ้ามี

### 3. Assess Feasibility

> Goal: ประเมินว่าทำได้จริงหรือไม่

1. ตรวจ tech stack ด้วย `/follow-my-tech-stack`
2. ตรวจ dependencies ที่มีและที่ต้องเพิ่ม
3. ระบุ skills/tools ที่ต้องใช้
4. ระบุ skills ที่มีอยู่แล้วใน project
5. ประเมิน effort (hours/days) และ risk (low/medium/high)

### 4. Evaluate Impact

> Goal: ประเมินคุณค่าของไอเดีย

1. ระบุ impact ต่อ users (high/medium/low)
2. ระบุ impact ต่อ stability, performance, security
3. ระบุ opportunity cost (ถ้าไม่ทำหรือทำอย่างอื่นแทน)
4. เปรียบเทียบกับ alternatives แบบ apples-to-apples

### 5. Check Alignment

> Goal: ตรวจสอบความสอดคล้อง

1. ตรวจว่าไอเดียตรงกับ project goals และ roadmap
2. ตรวจว่าไม่ซ้ำซ้อนกับ features ที่มีอยู่
3. ตรวจว่าไม่ผิด architecture หรือ conventions
4. ถ้าไม่ชัด → ใช้ `/follow-best-practice`

### 6. Make Decision

> Goal: สรุปและตัดสินใจ

1. ให้คะแนนทั้งหมดตาม criteria:
   - Feasibility (1-5)
   - Impact (1-5)
   - Alignment (1-5)
   - Risk (1-5 โดย 5 = low risk)
   - Effort สมเหตุสมผล (1-5)
2. คำนวณ total score (สูงสุด 25)
3. สรุป go/no-go ด้วยเหตุผล:
   - Score >= 20 + low/medium risk → go
   - Score 15-19 + medium risk → go with conditions
   - Score < 15 หรือ high risk → no-go or ask user
4. ถ้าไม่แน่ใจ → ใช้ `/ask-me`

## Rules

- ไม่ execute การเปลี่ยนแปลงใด ๆ
- อ่านข้อมูลจาก official sources เป็นหลัก
- ระบุ assumptions และ risks ชัดเจน
- เปรียบเทียบ alternatives แบบ apples-to-apples
- ถ้าขาด context → stop และ report

- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /pick-bestest ถ้าจำเป็น

## Expected Outcome

- รายงาน validation เป็นตาราง: Criteria, Score, Notes
- คำแนะนำ go/no-go พร้อมเหตุผล
- รายการสิ่งที่ต้องทำถัดไปถ้า go
- ไม่มีการ execute changes
