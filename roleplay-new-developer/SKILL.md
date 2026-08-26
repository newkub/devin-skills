---
name: roleplay-new-developer
description: รับบทเป็น dev ใหม่ที่เพิ่ง join พยายาม onboard ผ่าน codebase หาสิ่งที่งง ขาด docs ไม่มี context
---

## Goal

รับบทเป็น developer ใหม่ที่เพิ่ง join พยายามเข้าใจและ onboard ผ่าน codebase เพื่อหาสิ่งที่งง ขาด docs ไม่มี context และ friction points ที่ทำให้เริ่มทำงานช้า

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง dev ใหม่ ครอบคลุม onboarding experience, code comprehension, documentation, และ developer friction โดย AI รับบทเป็น dev ใหม่อ่าน code เหมือนจริง

## Execute

### 1. Read Code Context

> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อเข้าใจ project structure
2. อ่าน README, AGENTS.md, docs, contributing guides
3. อ่าน package.json, tsconfig, config files, scripts
4. อ่าน directory structure, file naming conventions
5. ถ้าไม่มี docs เลย ให้บันทึกเป็น finding ทันที

### 2. Identify New Developer Profile

> Goal: Identify New Developer Profile

1. ระบุ dev level (junior, mid, senior, staff)
2. ระบุ tech stack familiarity (knows framework, new to framework, new to language)
3. ระบุ domain knowledge (knows domain, new to domain)
4. ระบุ onboarding goal (fix bug, add feature, understand architecture, write tests)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Onboarding Journey

> Goal: Simulate Onboarding Journey

Goal reminder: คิดเหมือน dev ใหม่จริงที่งง ไม่ใช่ dev เดิมที่คุ้นเคย

1. เลือก 3-5 onboarding scenarios (fix a bug, add a feature, understand a flow, set up local, write a test)
2. จำลอง step-by-step: dev ใหม่เริ่มจากไหน อ่านอะไร งงตรงไหน หาคำตอบที่ไหน
3. ระบุจุดที่ dev ใหม่ต้องถามคนอื่น เพราะหาจาก code/docs ไม่ได้
4. ระบุจุดที่ dev ใหม่อาจเข้าใจผิดและทำพลาด
5. ประเมินเวลาที่ใช้ onboard โดยประมาณ

### 4. Analyze Every Onboarding Dimension

> Goal: Analyze Every Onboarding Dimension

Documentation and Context:

1. README quality: มี quickstart ไหม, setup steps ชัดไหม, รันได้เลยไหม
2. Architecture docs: มีไหม, อัปเดตไหม, เข้าใจได้โดยไม่รู้ project ไหม
3. API docs: มีไหม, ตัวอย่างพอไหม, input/output ชัดไหม
4. Code comments: มี comments อธิบาย why ไหม, หรือมีแค่ what
5. AGENTS.md / contributing guide: มีไหม, บอก conventions ไหม, บอก workflow ไหม
6. Inline documentation: JSDoc, type docs, schema docs มีพอไหม

Code Comprehension:

7. Naming: ชื่อ variable, function, file, module เข้าใจง่ายไหม, สื่อความหมายไหม
8. File structure: หาไฟล์ที่ต้องการง่ายไหม, มี convention ชัดไหม, มี unexpected locations ไหม
9. Module boundaries: แยกชัดไหม, import ซับซ้อนไหม, circular deps ไหม
10. Abstraction levels: มี abstraction เกินไปไหม, ต้องไล่หลายชั้นไหม, magic ซ่อนอยู่ไหม
11. Consistency: patterns สม่ำเสมอไหม, ทำแต่ละที่ไม่เหมือนกันไหม
12. Error messages: เข้าใจง่ายไหม, บอกวิธีแก้ไหม, หรือแค่ stack trace ไม่มี context

Setup and Tooling:

13. Local setup: รันได้ง่ายไหม, มี dependencies เยอะไหม, มี setup script ไหม
14. Environment variables: มี .env.example ไหม, บอกหาค่าจากไหนไหม, มี secrets management ไหม
15. Build and run: build ได้ง่ายไหม, มี error กำกวมไหม, มี watch mode ไหม
16. Testing: รัน test ได้ง่ายไหม, มี test examples ไหม, รู้ว่าจะเขียน test ยังไงไหม
17. Debugging: มี debug config ไหม, source maps ไหม, logging พอไหม

Workflow and Process:

18. Git workflow: มี branching strategy ไหม, commit conventions ไหม, PR template ไหม
19. Code review: รู้ว่าจะถูก review ยังไงไหม, มี checklist ไหม
20. CI/CD: รู้ว่า pipeline ทำอะไรไหม, รู้ว่า fail แล้วทำยังไงไหม
21. Task tracking: รู้ว่าจะหางานที่ต้องทำจากไหนไหม, มี issue template ไหม

Domain Knowledge:

22. Business logic: เข้าใจได้จาก code ไหม, มี domain docs ไหม, มี glossary ไหม
23. Data model: เข้าใจ schema ไหม, มี ERD ไหม, มี data dictionary ไหม

### 5. Map Findings To Code

> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (docs, comprehension, setup, workflow, domain)
4. ระบุ onboarding scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Onboarding Report

> Goal: Generate Onboarding Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, New Dev Impact, Recommendation
3. สร้าง onboarding timeline estimate: setup, first bug fix, first feature, full productivity
4. สรุป top 3-5 friction points ที่ต้องแก้ก่อน
5. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/update-review-cli-and-run` หรือ `/run-dev`

### 2. Think Like A New Developer

- คิดเหมือน dev ใหม่จริงที่งง ไม่ใช่ dev เดิมที่คุ้นเคย
- ถามตัวเอง "ถ้าเราเป็น dev ใหม่ จะงงตรงไหน?" ทุก dimension
- ไม่สมมติว่ารู้ domain, conventions, หรือ history ของ project
- พิจารณา dev หลายระดับ (junior, mid, senior)
- คิดถึงความรู้สึกหงุดหงิดที่จะเกิดขึ้นจริง

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง "missing" และ "unclear"

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (docs, comprehension, setup, workflow, domain)
- ตรวจจากหลาย dev profile
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- เน้น friction points ที่กระทบ productivity มากที่สุด

### 5. Severity

- Critical: ไม่สามารถ onboard ได้เลย, ไม่มี docs, setup ไม่ได้, งงทุกอย่าง
- High: onboard ได้แต่ช้ามาก, ต้องถามคนอื่นบ่อย, อาจทำพลาด
- Medium: onboard ได้ปกติ แต่มี friction บางจุด, ใช้เวลาเพิ่ม
- Low: friction เล็กน้อย, ไม่กระทบ productivity มาก

### 6. Integration

- ถ้า onboarding ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan DX patterns จริง ให้ใช้ `/update-review-cli-and-run`
- ถ้าต้องการ scan file structure ให้ใช้ `/check-code-structure`
- ถ้าต้องการ scan naming ให้ใช้ `/update-review-cli-and-run`

### 7. Output

- รายงานตาราง friction points ชัดเจน จัดกลุ่มตาม dimension
- onboarding timeline estimate
- สรุป top friction points ที่ต้องแก้ก่อน
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน onboarding experience จากมุมมอง dev ใหม่ที่จำลองจาก source code
- ตาราง findings มี Severity, Dimension, Location, Issue, New Dev Impact, Recommendation
- onboarding timeline estimate: setup, first bug fix, first feature, full productivity
- ครอบคลุม 23 dimensions ครบ 5 หมวด (docs, comprehension, setup, workflow, domain)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`