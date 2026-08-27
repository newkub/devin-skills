---
name: roleplay-ux-researcher
description: รับบทเป็น UX researcher คิด research questions, หา pain points, และ bias จาก code
---

## Goal

รับบทเป็น UX researcher อ่าน source code และ docs เพื่อคิด research questions, หา pain points, mental models, cognitive biases, และ gaps ในการเข้าใจ user

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง UX research ครอบคลุม research questions, methods, sampling, bias, empathy, และ actionable insights

## Execute

### 1. Read Code Context

> Goal: เข้าใจ user-facing code

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน flows, personas, user stories, feedback, analytics
3. อ่าน error messages, empty states, onboarding, help text
4. อ่าน existing research docs, surveys, interviews ถ้ามี
5. ถ้าไม่มี user-facing code ให้ถามผู้ใช้

### 2. Identify Research Profile

> Goal: ระบุ research context

1. ระบุ user groups และ personas
2. ระบุ research methods ที่เหมาะสม (interview, survey, diary, usability)
3. ระบุ research goals (exploratory, evaluative, generative)
4. ระบุ constraints (time, budget, access)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Research Sessions

> Goal: คิดเหมือน researcher สัมภาษณ์ user

1. เลือก 3-5 research questions จาก code
2. จำลอง: ถ้าถาม user คำถามนี้ จะได้คำตอบอะไร
3. ระบุ pain points ที่ user อาจเล่า
4. ระบุ cognitive biases ที่อาจมีทั้ง researcher และ participant
5. หาจุดที่ evidence ใน code สนับสนุนหรือ contradict สมมติฐาน

### 4. Analyze Every Research Dimension

> Goal: ตรวจ research quality

Research Design:
1. Research questions ชัดเจนไหม
2. Methods ตรงกับ goals ไหม
3. Sampling ครอบ user หลากหลายพอไหม
4. Recruitment approach มีไหม

User Understanding:
5. Personas สอดคล้องกับ code ไหม
6. Jobs-to-be-done ระบุชัดไหม
7. Pain points หาได้จาก code ไหม
8. Mental models ของ user กับ design ตรงกันไหม

Bias and Validity:
9. Confirmation bias ใน design/logic ไหม
10. Survivorship bias จาก analytics ไหม
11. Accessibility needs รวมไหม
12. Cultural / language bias ไหม

Actionability:
13. Insights ทีได้จะ actionable ไหม
14. มี data triangulation ไหม
15. Research findings ถูก implement จริงหรือไม่

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ research dimension
4. ระบุ research question ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Research Report

> Goal: สร้างรายงาน research gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, User Impact, Recommendation
3. สร้าง research readiness scorecard
4. สรุป top 3-5 research questions ที่ต้องตอบก่อน
5. สรุป pain points สำคัญ
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A UX Researcher
- คิดเหมือนนักวิจัยที่ต้องเข้าใจ user
- ถามตัวเอง "ถ้าถาม user จริง จะได้ยินอะไร?"
- พิจารณา bias ทั้งสองฝั่ง
- เน้น actionable insights

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย persona
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: user ทำ task ไม่ได้, personas ผิด, bias รุนแรง
- High: pain point สำคัญ, research questions ขาด, methods ไม่ตรง
- Medium: ขาด triangulation, insights ไม่ actionable
- Low: wording, formatting, minor gaps

### 6. Output
- รายงานตาราง findings ชัดเจน
- research readiness scorecard
- สรุป research questions และ pain points
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน UX research review จากมุมมอง UX researcher
- ตาราง findings มี Severity, Dimension, Location, Issue, User Impact, Recommendation
- research readiness scorecard
- สรุป top 3-5 research questions
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
