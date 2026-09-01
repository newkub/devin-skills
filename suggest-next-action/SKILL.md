---
name: suggest-next-action
description: วิเคราะห์สถานการณ์และแนะนำ action ถัดไปที่ควรทำ
argument-hint: "[context]"
related:
  - loop-continuous
  - follow-enter-dot
  - follow-agents-md
  - follow-devin-global-subagents
  - report-before
  - ask-me
  - ship
  - continue
  - rethink
---
## Goal

วิเคราะห์สถานการณ์ปัจจุบันและแนะนำ action ถัดไปที่ควรทำ เพื่อให้การทำงานมีทิศทางชัดเจนและเป็นระบบ

## Scope

ใช้สำหรับวิเคราะห์สถานการณ์หลังจากทำงานเสร็จ task ใด task หนึ่ง หรือเมื่อไม่แน่ใจว่าควรทำอะไรต่อ ครอบคลุมทั้ง context ของโปรเจกต์และสถานะปัจจุบัน

## Execute

### 1. Analyze Current State

> Goal: Analyze Current State

วิเคราะห์สถานการณ์ปัจจุบัน

1. ตรวจสอบ task ล่าสุดที่ทำเสร็จ
2. ดูสถานะของ project (errors, warnings, pending changes)
3. ตรวจสอบ git status (uncommitted changes, branches)
4. ดูสถานะของ dependencies (outdated, vulnerabilities)
5. ตรวจสอบ test coverage และ test failures
6. ดู documentation ที่อาจต้องอัปเดท
7. ตรวจสอบ `AGENTS.md` ว่ามีอยู่และระบุ workflows อะไรบ้าง
8. ตรวจสอบว่างานถัดไปสามารถแบ่งเป็น subtasks อิสระได้หรือไม่

### 2. Identify Context

> Goal: Identify Context

ระบุ context ของสถานการณ์

- เป็นการเริ่ม project ใหม่หรือ maintenance
- เป็นการ fix bug หรือ add feature
- เป็นการ refactor หรือ optimization
- เป็นการ prepare สำหรับ release
- เป็นการ review หรือ audit
- เป็นการ learning หรือ research

### 3. Evaluate Priority

> Goal: Evaluate Priority

ประเมินความสำคัญของ actions ที่อาจทำ

- Impact ต่อ users (high/medium/low)
- Impact ต่อ stability (high/medium/low)
- Effort ที่ต้องใช้ (high/medium/low)
- Risk ของการทำ (high/medium/low)
- Dependencies กับ tasks อื่น
- Time sensitivity

### 4. Suggest Actions

> Goal: Suggest Actions

แนะนำ actions ที่ควรทำถัดไป

1. จัดลำดับ actions ตาม priority
2. แนะนำ workflow ที่เหมาะสม (ถ้ามี)
3. ระบุว่า action นั้น critical หรือ optional
4. อธิบาย reason ที่แนะนำ action นั้น
5. ระบุ dependencies ระหว่าง actions
6. ให้ estimate effort ถ้าเป็นไปได้
7. ถ้ามีไฟล์หรือ folder ที่ควรลบ ให้แนะนำ `git rm` พร้อมระบุเหตุผล แล้ว `/update-references`
8. ถ้ามีไฟล์ที่ควรสรุปเนื้อหา ให้แนะนำ `/report-table`
9. ถ้ามี `AGENTS.md` → แนะนำ `/follow-agents-md` เป็น action หลัก แทนการทำเองโดยตรง
10. ถ้างานมี subtasks อิสระหลายด้าน (frontend/backend/qa/devops/security) → แนะนำ `/follow-devin-global-subagents` หรือ `/consider-use-subagents` ตาม context

### 5. Present Options

> Goal: Present Options

เตรียม options สำหรับนำเสนอ

1. เตรียมข้อมูล actions สำหรับ `/report-table`: #, Action, Priority, Impact, Effort, Workflow, Reason
2. จัดลำดับ actions ที่แนะนำพร้อม priority
3. ระบุ action ทีเหมาะสมทีสุดสำหรับแต่ละ context แต่ไม่ตอบสินใจแทน user
4. เตรียม trade-offs ระหว่าง options สำหรับ `/report-table`: Option, Pros, Cons, Risk
5. ระบุว่า action ไหนสามารถทำ parallel ได้
6. ถ้าต้องการ user confirmation ก่อนดำเนินการ → เก็บคำถามไว้ให้ `/ask-me` หลัง `/report-table`

### 6. Report

> Goal: นำเสนอผลลัพธ์ให้ user เห็นภาพรวม

1. ทำ `/report-table` เสมอเพื่อจัดรูปแบบ actions, options และ trade-offs เป็นตาราง
2. สรุปคำแนะนำหลัก 1-2 บรรทัดก่อนตาราง
3. ระบุ next action ทีเหมาะสมทีสุดและเหตุผลสั้นๆ แต่ไม่ตอบสินใจแทน user
4. ทำ `/ask-me` เสมอเพื่อถามให้ user เลือก action ตอบมา ไม่ตอบสินใจแทน user ในแชท

## Rules

### 1. Context Awareness

ต้องเข้าใจ context ก่อนแนะนำ

- อย่าแนะนำ action โดยไม่เข้าใจ context
- ตรวจสอบสถานะปัจจุบันก่อน
- พิจารณา impact ต่อ project โดยรวม
- พิจารณา state ของ codebase

### 2. Priority Framework

ใช้ framework ในการจัดลำดับ

- High impact, low effort → ทำก่อน
- High impact, high effort → วางแผนให้ดี
- Low impact, low effort → ทำเมื่อมีเวลา
- Low impact, high effort → ทำเมื่อจำเป็น
- Critical issues → ทำทันที
- Blockers → ทำก่อนอื่นๆ

### 3. Action Categories

แบ่ง actions เป็น categories:

- Critical: ต้องทำทันที (security issues, blocking bugs)
- High: ควรทำเร็วๆ (features, important fixes)
- Medium: ทำเมื่อมีเวลา (refactor, improvements)
- Low: ทำเมื่อว่าง (nice-to-have)
- Optional: ทำหรือไม่ก็ได้ (experiments, learning)

### 4. Workflow Suggestions

แนะนำ workflows ที่เหมาะสม

- ถ้ามี workflow ที่ครอบคลุม action นั้น ให้แนะนำใช้ workflow
- อย่าแนะนำ workflow ที่ไม่มีอยู่จริง
- ตรวจสอบ `related_workflows` ก่อนแนะนำ
- อธิบายว่าทำไม workflow นั้นเหมาะสม

### 5. Clarity And Specificity

ให้คำแนะนำที่ชัดเจนและเฉพาะเจาะ

- อย่าแนะนำ "ทำอะไรดี" โดยไม่ระบุ
- ให้คำแนะนำที่ specific และ actionable
- ระบุ file paths หรือ components ที่เกี่ยวข้อง
- ให้ examples ถ้าจำเป็น

### 6. Agent And Subagent Discipline

ใช้ `/follow-agents-md` และ subagents อย่างถูกต้อง

- ถ้า `AGENTS.md` มีอยู่ → แนะนำ `/follow-agents-md` ก่อน ไม่แนะนำทำเองโดยตรง
- ถ้างานต้องใช้หลาย roles/perspectives → แนะนำ `/follow-devin-global-subagents` หรือ `/consider-use-subagents`
- ห้ามแนะนำ subagent หรือ skill ที่ไม่เกี่ยวข้องกับ task
- ตรวจสอบ `related` และ `AGENTS.md` ก่อนอ้างอิง workflow หรือ subagent
- ถ้าไม่แน่ใจว่าควรใช้ subagent ใด → ทำ `/ask-me` ก่อน

### 7. Trade-off Awareness

อธิบาย trade-offs ระหว่าง options

- อธิบาย pros และ cons ของแต่ละ option
- ระบุ risks ที่อาจเกิดขึ้น
- ระบุ opportunity costs
- ให้ผู้ใช้ตัดสินใจขั้นสุดท้าย

- ใช้ /loop-continuous ถ้าจำเป็น
- ใช้ /follow-enter-dot ถ้าจำเป็น
- ใช้ /report-before ถ้าจำเป็น
- ใช้ /ship ถ้าจำเป็น
- ใช้ /continue ถ้าจำเป็น
- ใช้ /rethink ถ้าจำเป็น

## Expected Outcome

- ผู้ใช้ได้รับคำแนะนำที่ชัดเจน
- Actions ถูกจัดลำดับตาม priority
- Context ของสถานการณ์ถูกเข้าใจ
- Workflow ที่เหมาะสมถูกแนะนำ
- Trade-offs ระหว่าง options ชัดเจน
- การทำงานมีทิศทางชัดเจน
- ผลลัพธ์ถูกนำเสนอด้วย `/report-table` ในรูปแบบตาราง
- ถ้ามี `AGENTS.md` จะแนะนำ `/follow-agents-md` ก่อน
- ถ้างานซับซ้อน multi-role จะแนะนำ `/follow-devin-global-subagents` หรือ `/consider-use-subagents` ตาม context
- สิ้นสุดด้วย `/ask-me` เพื่อให้ user เลือก action ตอบมา ไม่ตอบสินใจแทน user ในแชท

