---
name: report-markdown-uxui-all-routes
description: สร้างรายงาน routes ทั้งหมดของ app/website ใน markdown table สำหรับ UX/UI
related:
  - report-markdown-uxui-sketch
  - list-website-all-routes
  - report-markdown-table
---

## Goal

สร้างรายงาน routes ทั้งหมดของ app หรือ website ใน markdown table สำหรับวางแผน UX/UI, navigation, และ tab structure

## Scope

- ใช้สำหรับ app/website ทีมี tab หรือ multi-screen navigation
- รองรับ file-based routing, config-based routing, หรือ manual route list
- ระบุ route/screen, tab group, method, purpose, actions, entry points
- ใช้ร่วมกับ `/report-markdown-uxui-sketch` เพื่อสร้าง wireframe ครบ

## Execute

### 1. Detect Route Source

> Goal: หา routes จาก project หรือ context

1. ถ้ามี project → อ่าน `package.json` และใช้ `/list-website-all-routes`
2. ถ้าไม่มี project → อ่าน context จาก prompt, references, หรือ `AGENTS.md`
3. ระบุ framework (Next.js, Nuxt, SvelteKit, SolidStart, Capacitor, ฯลฯ)
4. ระบุ tab/switcher structure ถ้ามี

### 2. Collect Routes

> Goal: รวบรวม route ทั้งหมด

1. สแกน route files หรืออ่าน route config
2. ระบุ page routes, API routes, modal routes, nested routes
3. ระบุ dynamic segments เช่น `[id]`
4. แยก public กับ protected/authenticated routes

### 3. Add UX Metadata

> Goal: เพิ่มข้อมูลเพื่อ UX/UI planning

1. ระบุ tab group ของแต่ละ route (เช่น `Session`, `Customize`)
2. ระบุ purpose/goal ของแต่ละ screen
3. ระบุ primary actions บน screen
4. ระบุ navigation pattern: bottom tab, top tab, drawer, stack

### 4. Format As Markdown Table

> Goal: สรุป routes ในตาราง

1. ใช้ `/report-markdown-table`
2. คอลัมน์: No, Tab/Screen, Route, Method, Tab Group, Purpose, Primary Actions, Notes
3. เรียงลำดับตาม Tab Group แล้ว Route
4. ใช้ symbols `✅` `❌` `⚠️` สำหรับ status

### 5. Validate And Report

> Goal: ตรวจสอบความครบถ้วน

1. ตรวจว่าทุก tab มี route
2. ตรวจว่า primary actions ระบุชัดเจน
3. ตรวจ conflicts/duplicates
4. ทำ `/suggest-next-action` ท้าย report

## Rules

### Route Extraction

- แปลง file path เป็น URL path ตาม convention ของ framework
- ไม่รวม `layout`, `error`, `loading`, `template` files เป็น routes
- รวม dynamic segments ตามสัญลักษณ์จริง (`[]`, `()`, `[...]`)
- ระบุ HTTP method ให้ถูกต้องตาม convention ถ้าเป็น API route

### UX Metadata

- ทุก route ต้องมี `Tab Group` หรือระบุว่าเป็น standalone
- ทุก route ต้องมี `Purpose` สั้นๆ
- `Primary Actions` ระบุชัดเจน และใช้ `[]` สำหรับ tap/click
- ระบุ `Notes` สำหรับ state, loading, หรือ edge cases

### Table Format

- ใช้ markdown table format มาตรฐาน
- ใช้ headers ชัดเจน
- คอลัมน์ `No` เริ่มจาก 1
- เรียงตาม `Tab Group` แล้ว `Route` ตามตัวอักษร
- ใช้ backticks สำหรับ `route`, `method`, `paths`

### Report UX/UI

- สรุป key findings ไว้ด้านบนก่อนรายละเอียด
- ใช้ `/report-markdown-table` สำหรับตารางเปรียบเทียบหลาย columns
- ใช้ bullet หรือ numbered list สำหรับสรุป points
- ใช้ symbols `✅` `❌` `⚠️` สำหรับ status indicators
- ทำ `/suggest-next-action` ท้าย report เสมอ

### Source Accuracy

- อ้างอิง routes จาก codebase จริง หรือ context ที่ผู้ใช้ให้
- ห้ามประดิษฐ์ routes ที่ไม่มี
- ถ้ามี context ทีขาด → ระบุ gaps และถามผู้ใช้ด้วย `/ask-me`

## Expected Outcome

- Markdown table ของ routes ทั้งหมด จัดกลุ่มตาม Tab Group
- UX metadata สำหรับแต่ละ route (purpose, actions, notes)
- Navigation pattern summary
- รายการ gaps หรือ routes ทีต้อง verify
- Suggested next action
