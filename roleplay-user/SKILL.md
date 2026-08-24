---
name: roleplay-user
description: รับบทเป็น user อ่าน code แล้วคิดผ่าน user journey เพื่อ review usage และ UX/UI แบบไม่รันอะไรจริง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

จำลองเป็น user อ่าน source code แล้วคิดผ่าน user journey ทีละขั้นตอน เพื่อ review ว่าใช้งานได้หรือไม่ กดได้หมดหรือไม่ ทำได้หรือไม่ และมีปัญหาอะไรในทุกด้าน UX/UI โดยไม่รันโปรแกรมหรือ server จริง

## Scope

ใช้กับ project ที่ต้องการตรวจ usage และ UX/UI จาก source code โดยตรง (web, mobile, CLI, TUI, extension) โดย AI จำลอง user behavior ใน head แบบไม่เปิด browser, emulator, หรือรัน test จริง

## Execute

### 1. Read Code Context
> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา user-facing code
2. อ่าน routes, pages, components, forms, navigation, dialogs, loading/error/success states
3. อ่าน state management, handlers, guards, validations ที่มีผลต่อ user interaction
4. ถ้าหา user-facing code ไม่เจอ ให้ถามผู้ใช้ว่าต้องการ review ส่วนไหน

### 2. Identify User Personas And Goals
> Goal: Identify User Personas And Goals

1. ระบุ user types จาก code (guest, logged-in, admin, provider, customer, etc.)
2. ระบุ primary goals ของแต่ละ persona (sign up, book, pay, search, manage, etc.)
3. ระบุ success criteria ของแต่ละ goal
4. บันทึก assumptions ที่ทำจาก code ไว้ชัดเจน

### 3. Simulate User Journey
> Goal: Simulate User Journey

1. เลือก 3-5 ใช้งานหลัก แต่ละ persona จาก code ที่อ่าน
2. จำลอง step-by-step ใน head: user เห็นอะไร กดอะไร กรอกอะไร ไปหน้าไหน
3. ระบุ expected outcome ของแต่ละ step
4. ตรวจ happy path และ error path ที่อ่านได้จาก code

### 4. Review Clickability And Doability
> Goal: Review Clickability And Doability

1. สำหรับแต่ละ step ถาม: "user กดได้ไหม?", "user รู้จะกดตรงไหนไหม?", "มี CTA ชัดเจนไหม?"
2. ตรวจว่า links, buttons, routes, handlers ต่อกันถูกต้อง
3. ตรวจว่า form validation, guards, permissions ไม่บล็อก user โดยไม่บอกกลไก
4. บันทึก dead-end, missing action, หรือ unreachable state

### 5. Review Every UX UI Aspect
> Goal: Review Every UX UI Aspect

Goal reminder: จำลอง user แล้วหาปัญหา UX/UI ในทุกมิติ ไม่ใช่แค่ visual

Core UX:

1. Flow: ลำดับขั้นตอนสมเหตุสมผลไหม มี back/escape ไหม มี cancel/abort ไหม
2. Navigation and wayfinding: breadcrumbs, active nav state, page titles, deep linking, back button behavior
3. Clickability: ทุก interactive element กดได้จริงไหม, มี hover/active/focus state ไหม, disabled state ชัดเจนไหม
4. Feedback: loading, error, success, empty states ครบทุก flow ไหม, มี progress indicator ไหม
5. Error prevention: confirmation dialogs, undo, constraints, smart defaults, guardrails สำหรับ destructive actions

Content and Communication:

6. Copy: ภาษา, คำอธิบาย, error messages เข้าใจง่ายไหม, มี helpful text ไหม
7. Information architecture: content hierarchy, grouping, categorization, searchability, scannability
8. Form design: field ordering, grouping, inline validation, autofill, input types, labels vs placeholders, required field indicators
9. Data presentation: tables, charts, images, media, markdown rendering, list vs grid, pagination vs infinite scroll
10. Search and filtering: search UX, filter UX, sort UX, result count, no results state, saved searches

Visual and Interaction:

11. Visual consistency: spacing, typography, colors, icons สม่ำเสมอหรือไม่, design system compliance
12. Accessibility: labels, ARIA, keyboard focus, color contrast, screen reader, tab order, skip links
13. Micro-interactions: hover effects, transitions, animations, delight moments, loading skeletons
14. Cognitive load: จำนวน steps, decision points, information density, progressive disclosure, chunking

Trust, Safety, and Context:

15. Trust and safety: ข้อมูล sensitive, confirmation, undo มีหรือไม่, privacy controls, data visibility
16. Onboarding and first-time experience: empty states with guidance, tooltips, tours, progressive disclosure, contextual help
17. Session and state persistence: draft saving, page refresh behavior, state restoration, unsaved changes warning
18. Notification and communication: in-app notifications, toast/snackbar, email notifications, push, notification preferences

Platform and Environment:

19. Mobile/responsive: viewport, touch targets, responsive rules, gesture support, mobile-specific UI
20. Performance perception: ทำงานช้าหรือไม่จาก code (large bundles, sync blocking, waterfall requests), skeleton loading, optimistic updates
21. Internationalization: date/time formats, number formats, currency, RTL support, text length expansion
22. Offline and connectivity: offline mode, retry, sync indicator, cached data, graceful degradation
23. Edge cases: empty, error, loading, unauthorized, no network, expired session, concurrent editing, large datasets

### 6. Map Findings To Code
> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ aspect ที่เกี่ยวข้อง (flow, clickability, accessibility, etc.)
4. ถ้าไม่มี evidence ใน code ให้ระบุเป็น assumption

### 7. Generate Report
> Goal: Generate Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Aspect, Location, Issue, User Impact, Recommendation
3. สรุป top 3-5 issues ที่ควรแก้ก่อน
4. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, emulator, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/review-codebase`

### 2. Simulate From Real User

- ถามตัวเอง "ถ้าเป็น user จริง จะเข้าใจไหม" ทุก step
- ไม่ยึดมุมมอง developer ว่า "โค้ดนี้ชัดเจน"
- พิจารณา user ที่ไม่รู้จักระบบมาก่อน
- พิจารณา user ที่มี accessibility needs
- พิจารณา user บน mobile และ desktop

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage

- ตรวจทุก user persona หลัก
- ตรวจทุก flow หลัก (ไม่ใช่แค่ happy path)
- ตรวจทุก aspect ทุกหมวด (core UX, content, visual, trust, platform)
- ถ้า aspect ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม

### 5. Severity

- Critical: ทำ task ไม่สำเร็จ, dead-end, ไม่มีทาง recover, ไม่มี error message
- High: ทำได้แต่งง/ผิดได้, ขาด feedback สำคัญ, ขาด confirmation สำหรับ destructive action
- Medium: ไม่สม่ำเสมอ, ขาด empty/error state บางที่, ขาด accessibility บางจุด
- Low: ความสวยงาม/คำพูดเล็กน้อย, micro-interaction ขาด, spacing ไม่สม่ำเสมอ

### 6. Integration

- ถ้า journey ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม simulate
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการวาด flow ช่วย visualize ให้ทำ `/report-uxui-sketch`
- ถ้าต้องการ scan จริงด้วย scripts ให้ใช้ `/review-codebase`
- ถ้าต้องการ review cross-domain impact ให้ใช้ `/review-codebase`

### 7. Output

- รายงานตาราง findings ชัดเจน จัดกลุ่มตาม aspect category
- สรุป top issues
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน usage และ UX/UI จากมุมมอง user ที่จำลองจาก source code
- ตาราง findings มี Severity, Aspect, Location, Issue, User Impact, Recommendation
- ระบุว่าอะไรกดได้/ทำได้ อะไรไม่ได้ และปัญหาในทุกด้าน
- ครอบคลุม 23 aspects ครบ 5 หมวด (core UX, content, visual, trust, platform)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
