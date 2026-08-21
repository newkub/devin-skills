---
name: review-hooks-composables
description: Review hooks/composables design, parameter validation, return value, reactivity, effect cleanup, lifecycle, Vue/Nuxt specifics
---

## Goal

Review hooks/composables ครอบคลุม design, reactivity, cleanup, lifecycle, reusability พร้อม review score

## Scope

hooks/composables review สำหรับ: function design, parameter validation, return value structure, reactivity (signal/memo patterns), effect cleanup, lifecycle management (onMount/onCleanup), resource disposal, composable reusability, composition patterns, testing coverage, Vue/Nuxt composable specifics (ref/reactive, computed/watch, provide/inject, SSR compatibility, effect scope)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ hooks/composables structure และ patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ hooks/composables structure
2. ระบุ framework (React hooks, Vue composables, Solid hooks), composable file patterns (use-*), composable organization ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก hooks/composables dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ composable patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Design And API Review

> Goal: ครอบคลุม function design, parameters, return values

1. ตรวจสอบ function design: single responsibility, pure function where possible, side effect isolation, composable naming (use-* prefix), composable file organization
2. ตรวจสอบ parameter validation: parameter types, parameter defaults, parameter validation, options object pattern, required vs optional parameters
3. ตรวจสอบ return value structure: consistent return type, reactive vs non-reactive return, return value documentation, tuple vs object return, stable return reference
4. ตรวจสอบ composable reusability: composable reusability across components, composable configurability, composable composition (composable using other composables), composable coupling

### 4. Reactivity, Lifecycle And Cleanup Review

> Goal: ครอบคลุม reactivity, lifecycle, cleanup, SSR

1. ตรวจสอบ reactivity: signal/memo patterns, computed/watch patterns, reactivity dependencies tracking, reactivity leak prevention, stale closure prevention
2. ตรวจสอบ lifecycle management: onMount/onCleanup, onUnmounted, onBeforeUnmount, lifecycle ordering, lifecycle error handling
3. ตรวจสอบ effect cleanup: effect disposal, timer cleanup, event listener cleanup, subscription cleanup, abort controller usage, missing cleanup detection
4. ตรวจสอบ resource disposal: WebSocket cleanup, IntersectionObserver cleanup, ResizeObserver cleanup, AbortController cleanup, database connection cleanup
5. ตรวจสอบ Vue/Nuxt specifics (ถ้ามี): ref/reactive usage, computed/watch patterns, provide/inject patterns, Vue lifecycle integration, reactivity correctness, effect scope management, SSR compatibility, useFetch/useAsyncData patterns
6. Critical: broken composable, memory leak from missing cleanup, reactivity leak, SSR incompatibility, effect that runs after unmount
7. High: missing effect disposal, inconsistent return type, untestable composable, incorrect watch usage, missing ref unwrap, missing cleanup on unmount, stale closure

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี hooks/composables → ข้ามทั้งหมด
- ถ้า project ไม่มี Vue/Nuxt → ข้าม Step 4 item 5
- ถ้า project ไม่มี SSR → ข้าม SSR compatibility checks

### 2. Severity Classification

- Critical: broken composable, memory leak from missing cleanup, reactivity leak, SSR incompatibility, effect that runs after unmount
- High: missing effect disposal, inconsistent return type, untestable composable, incorrect watch usage, missing ref unwrap, missing cleanup on unmount, stale closure
- Medium: suboptimal reactivity, minor naming inconsistency, missing composable documentation, missing parameter validation
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ composable, function, หรือ effect ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก hooks/composables section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
