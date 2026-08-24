---
name: review-components
description: Review component structure, props, events, reactivity, composition, reusability, testing, isolation
---

## Goal

Review components ครอบคลุม structure, prop design, event emission, reactivity, composition, reusability พร้อม review score

## Scope

component review สำหรับ: component structure, prop design, event emission patterns, reactivity usage, memo/computed patterns, unnecessary re-renders, component composition, slot usage, component reusability, component testing coverage, component isolation, component file organization, component API design

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ component structure และ framework

1. ทำ `/scan-codebase` เพื่อเข้าใจ component structure
2. ระบุ component framework (Vue, React, Solid, Svelte), component file patterns, component organization ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก component dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ component patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Component Structure And Prop Review

> Goal: ครอบคลุม structure, props, events

1. ตรวจสอบ component structure: file organization, single responsibility, component size, component complexity, component naming (PascalCase)
2. ตรวจสอบ prop design: prop naming, prop types, prop defaults, prop validation, prop count (เกิน 4 ต้อง group), required vs optional, prop immutability (no prop mutation)
3. ตรวจสอบ event emission: event naming (kebab-case for Vue, camelCase for React), event payload typing, event documentation, custom event vs native event, event emission on correct lifecycle
4. ตรวจสอบ component composition: slot usage, named slots, scoped slots, component composition patterns, higher-order components, render functions, component injection
5. Critical: broken component, prop mutation ที่ก่อให้เกิด error, broken slot, component ที่ render ไม่ได้
6. High: missing prop validation, poor composition, too many props without grouping, inconsistent event naming, missing event documentation

### 4. Reactivity, Reusability And Testing Review

> Goal: ครอบคลุม reactivity, reusability, testing, isolation

1. ตรวจสอบ reactivity usage: computed/memo patterns, watch effects, unnecessary re-renders, reactivity dependencies, reactivity leak, effect scope
2. ตรวจสอบ component reusability: component reusability across pages, component configurability, component extensibility, component coupling, shared component patterns
3. ตรวจสอบ component testing: unit test coverage, component testing strategy, snapshot testing, interaction testing, accessibility testing in components
4. ตรวจสอบ component isolation: component isolation from parent, component isolation from global state, component isolation from side effects, pure component patterns
5. Critical: reactivity bug ที่ก่อให้เกิด error, memory leak from missing cleanup, reactivity leak, SSR incompatibility
6. High: unnecessary re-render, missing memo on expensive component, untestable component, missing test coverage, high coupling, missing component isolation

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

- ถ้า project ไม่มี components → ข้ามทั้งหมด
- ถ้า project ไม่มี slots → ข้าม Step 3 item 4
- ถ้า project ไม่มี component tests → ข้าม Step 4 item 3

### 2. Severity Classification

- Critical: broken component, prop mutation ที่ก่อให้เกิด error, broken slot, reactivity bug ที่ก่อให้เกิด error, memory leak, SSR incompatibility
- High: missing prop validation, poor composition, unnecessary re-render, missing memo, untestable component, missing test coverage, high coupling
- Medium: inconsistent naming, too many props, minor reactivity issue, missing component documentation
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ component, prop, event, หรือ slot ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก component section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
