## Goal
map user flows, identify friction points, and suggest UX improvements

## Scope
- รองรับ web, mobile, desktop apps
- ใช้ route list, analytics, หรือ code trace
- รายงาน journey พร้อม friction points

## Execute
### 1. List Routes/Screens

> Goal: List Routes/Screens

1. ใช้ `list-website-all-routes` สำหรับ web
2. หา screens/pages ของ mobile/desktop
3. ระบุ entrypoints และ exit points

### 2. Map Flows

> Goal: Map Flows

1. trace ทางเดินที user ทำได้จาก entrypoint ถึง goal
2. ระบุ actions, decisions, inputs
3. หา dead ends, loops, unnecessary steps

### 3. Add Data

> Goal: Add Data

1. ถ้ามี analytics ให้ใช้ event data ยืนยัน
2. หา drop-off points
3. ระบุ common paths vs rare paths

### 4. Report

> Goal: Report

1. สรุป user journeys หลัก
2. ระบุ friction points และ severity
3. แนะนำ UX improvements เบื้องต้น

## Rules
### 1. User-Centric

- มองจากมุมมอง user ไม่ใช่ dev
- focus เป้น goal ที user ต้องการทำ
- ไม่ optimize ทางเดินที user ไม่ได้ใช้

### 2. Evidence

- ใช้ analytics ถ้ามี
- ระบุ assumptions ถ้าไม่มี data
- ไม่สร้าง flow โดยไม่มีหลักฐาน

## Expected Outcome
- user journey map
- friction points พร้อม severity
- UX improvement ideas
