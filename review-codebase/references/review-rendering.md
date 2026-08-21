---
name: review-rendering
description: Review SSR/CSR/hydration, rendering performance, re-renders, memo/computed, virtual DOM
---

## Goal

Review rendering ครอบคลุม SSR/CSR/hydration, rendering performance, re-render optimization พร้อม review score

## Scope

rendering review สำหรับ: SSR/SSG/CSR/ISR rendering modes, hydration correctness, hydration mismatch, rendering performance, layout thrashing, unnecessary re-renders, memo/computed patterns, virtual DOM efficiency, render blocking, paint optimization

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ rendering mode และ framework

1. ทำ `/scan-codebase` เพื่อเข้าใจ rendering structure
2. ระบุ rendering mode (SSR, SSG, CSR, ISR, universal), hydration strategy, rendering framework ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก rendering dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ rendering patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. SSR And Hydration Review

> Goal: ครอบคลุม SSR, hydration, universal rendering

1. ตรวจสอบ SSR correctness: server-side data fetching, server component patterns, SSR error handling, SSR-safe code (window/document guards)
2. ตรวจสอบ hydration: hydration mismatch prevention, client/server consistency, hydration error handling, selective hydration, progressive hydration
3. ตรวจสอบ universal rendering: code that works on both server และ client, environment detection, shared logic, server-only vs client-only code separation

### 4. Rendering Performance And Re-render Review

> Goal: ครอบคลุม rendering performance, re-render optimization

1. ตรวจสอบ re-render patterns: unnecessary re-renders, missing memo/computed, prop drilling causing re-renders, state placement optimization
2. ตรวจสอบ layout thrashing: forced synchronous layout, read-then-write patterns, getBoundingClientRect in loop, layout thrashing in hot path
3. ตรวจสอบ render blocking: render-blocking resources, critical rendering path, above-the-fold optimization, deferred rendering, lazy hydration
4. ตรวจสอบ paint optimization: paint complexity, layer promotion, will-change usage, composite layers, transform/opacity vs layout/paint
5. ตรวจสอบ virtual DOM efficiency: keyed lists, v-for/:key correctness, list virtualization, large list rendering, diff algorithm efficiency

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี SSR → ข้าม Step 3
- ถ้า project ไม่มี virtual DOM framework → ข้าม Step 4 item 5
- ถ้า project เป็น pure CSR → ข้าม Step 3 ทั้งหมด

### 2. Severity Classification

- Critical: hydration mismatch ที่ก่อให้เกิด error, SSR crash, server/client state inconsistency, layout thrashing ใน hot path, infinite render loop, broken rendering on key pages
- High: unnecessary re-renders ใน hot path, missing memo on expensive component, missing list virtualization, missing key, render-blocking resource, missing SSR-safe guards, inconsistent rendering, hydration performance issue, missing error boundary for hydration
- Medium: suboptimal re-render, minor hydration warning, missing lazy hydration, suboptimal paint
- Low: cosmetic, minor optimization, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ component, page, หรือ render path ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก rendering section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
