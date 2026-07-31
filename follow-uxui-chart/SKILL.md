---
name: follow-uxui-chart
description: สร้าง interactive charts และ data visualization ที accessible และ performant
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
  - skill
related:
  - tanstack
  - follow-uxui-animation
  - follow-uxui-interaction
  - follow-uxui-feedback
  - follow-my-tech-stack
  - follow-react
  - follow-vue
  - follow-solidjs
  - follow-best-practice
  - review-accessibility
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

สร้าง interactive charts และ data visualization ทีมี tooltip, zoom, pan, selection รองรับ accessibility และ responsive

## Scope

ใช้สำหรับ dashboards, reports, analytics ที่ต้องแสดงข้อมูลในรูป chart

## Execute

### 1. Detect Chart Need

ระบุลักษณะ data viz

> Goal: เลือก chart type และ library ถูกต้อง

1. ระบุ chart type: line, bar, pie, scatter, heatmap, area
2. ระบุ interaction: tooltip, zoom, pan, brush, selection
3. ระบุ data volume: small, medium, large
4. ระบุ target framework: React, Vue, Solid, Svelte
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Library

เลือก data viz library

> Goal: ใช้ library ทีเหมาะสมกับ framework และ scale

1. ถ้าใช้ TanStack → `TanStack Charts` (ถ้า support framework ทีใช้)
2. ถ้า React → `Recharts`, `Nivo`, `Victory`
3. ถ้า Vue → `Vue Chart.js`, `ApexCharts`
4. ถ้าต้องการ full control → `D3` หรือ `Chart.js`

### 3. Implement Chart

เขียน interactive chart

> Goal: ใช้งานได้จริงและ smooth

1. ใช้ responsive container
2. เพิ่ม tooltips ทีมี label, value, unit
3. รองรับ zoom/pan/brush ถ้าจำเป็น
4. ใช้ legend ที interactive ได้
5. ใช้ animation สำหรับ data update
6. รองรับ `prefers-reduced-motion`

### 4. Validate

ตรวจสอบ chart

> Goal: ไม่มี a11y หรือ performance issues

1. ตรวจสอบ color contrast กับ background
2. ตรวจสอบ keyboard navigation บน interactive elements
3. ตรวจสอบ screen reader สำหรับ data summary
4. ทดสอบกับ large dataset
5. ทำ `/validate` และ `/validate-workflow`
6. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Accessibility

- ให้ text alternative สำหรับ data summary
- ใช้ `role="img"` และ `aria-label` บน chart
- ไม่พึ่งสีอย่างเดียวสำหรับ distinguish data
- รองรับ keyboard navigation

### 2. Performance

- ใช้ virtualization สำหรับ large dataset
- ลด re-render ด้วย memoization
- ไม่ update animation บ่อยเกิน

### 3. Responsive

- ใช้ responsive container
- ปรับ label/tick density ตาม breakpoint
- รองรับ touch interaction

## Expected Outcome

- Interactive chart ที a11y และ responsive
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
