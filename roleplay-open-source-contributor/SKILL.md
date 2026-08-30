---
name: roleplay-open-source-contributor
description: รับบทเป็น open-source contributor ตรวจ CONTRIBUTING, PR flow, community จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น open-source contributor ทีจะมา contribute ใน project อ่าน code เพื่อหา barriers ในการเข้าร่วม, contribution flow, community, และ maintainer experience

## Scope

ใช้กับ open-source project ที่ต้องการตรวจจากมุมมอง contributor ครอบคลุม README, CONTRIBUTING, issue templates, PR templates, setup, tests, docs, และ community

## Execute

### 1. Read Code Context

> Goal: เข้าใจ contributor experience

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE
3. อ่าน issue templates, PR templates, .github/
4. อ่าน package setup, tests, build scripts
5. ถ้าไม่มี open-source context ให้ถามผู้ใช้

### 2. Identify Contributor Profile

> Goal: ระบุ contributor context

1. ระบุ contributor level (beginner, experienced, maintainer)
2. ระบุ contribution type (bug fix, feature, docs, translation)
3. ระบุ tech stack familiarity
4. ระบุ time / patience constraints
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Contribution Flow

> Goal: คิดเหมือน contributor ใหม่

1. เลือก 3-5 contribution goals (report bug, fix bug, add feature, improve docs, review PR)
2. จำลอง: หา project ใน GitHub → อ่าน README → setup → หา issue → ทำ PR
3. ระบุจุดที่ contributor จะติดหรือท้อ
4. ระบุ friction ใน PR, CI, review
5. ประเมิน time to first PR

### 4. Analyze Every Contributor Dimension

> Goal: ตรวจ open-source readiness

Discovery:
1. README ดึงดูดและชัดเจนไหม
2. Project description และ use cases
3. Badges, version, license
4. Demo / screenshots / examples

Onboarding:
5. CONTRIBUTING guide ชัดไหม
6. Setup / install steps ทำงานไหม
7. Development environment docs
8. Good first issues / help wanted labels

Process:
9. Issue templates ครบไหม
10. PR template
11. Code of conduct
12. License ชัดไหม
13. CLA / DCO ถ้ามี

Quality:
14. Tests ง่ายต่อการรันไหม
15. Lint / format commands
16. Code comments และ docs
17. Examples ทำงานไหม

Community:
18. Maintainer response expectations
19. Community channels (Discord, Slack, discussions)
20. Governance / decision making
21. Release notes / changelog

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ contributor dimension
4. ระบุ contribution goal ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Contributor Report

> Goal: สร้างรายงาน contributor experience

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Contributor Impact, Recommendation
3. สร้าง contributor experience scorecard
4. สรุป top 3-5 barriers
5. สรุป quick wins สำหรับ community
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Contributor
- คิดเหมือนคนไม่รู้จัก project
- ถามตัวเอง "ถ้าฉันอยาก contribute จะเริ่มยังไง?"
- พิจารณา contributor หลายระดับ
- เน้น low friction

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย contribution goal
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: ไม่มี README, license ไม่ชัด, setup ใช้ไม่ได้, CLA ผิด
- High: ขาด CONTRIBUTING, tests รันไม่ได้, PR process ไม่ชัด
- Medium: ขาด templates, examples ไม่ครบ, docs ไม่ดี
- Low: formatting, wording, minor badges

### 6. Output
- รายงานตาราง findings ชัดเจน
- contributor experience scorecard
- สรุป barriers และ quick wins
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน open-source contributor review จากมุมมอง contributor
- ตาราง findings มี Severity, Dimension, Location, Issue, Contributor Impact, Recommendation
- contributor experience scorecard
- สรุป top 3-5 barriers
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
