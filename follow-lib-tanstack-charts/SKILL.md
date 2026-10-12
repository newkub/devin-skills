---
name: follow-lib-tanstack-charts
description: ใช้ TanStack Charts ครบวงจร — declarative grammar-of-graphics, series types, axes, tooltips
argument-hint: "[chart-type]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Charts ครบ — grammar-of-graphics charting: data + axes + series declarative config, series types, interactivity, responsive sizing

## Scope

ใช้สำหรับ data visualization — **0.x (beta)**: API อาจเปลี่ยน ตรวจ `https://tanstack.com/charts/latest` ก่อน implement; ถ้าต้อง mature lib มาก → พิจารณา Recharts/d3 ผ่าน `/ask-me`

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-charts
```

### 2. Grammar Model

> Goal: เข้าใจ grammar — data + scales/axes + series

```tsx
import { Chart } from '@tanstack/react-charts'

<Chart
  options={{
    data,                                        // array of datum objects
    primaryAxis: { getValue: (d) => d.label },   // x / category
    secondaryAxes: [{ getValue: (d) => d.value, elementType: 'bar' }],
  }}
/>
```

- Series `elementType`: `bar`, `line`, `area`, `pie`, `bubble`
- Multi-series: `data` เป็น array ของ series + หลาย `secondaryAxes`
- Tooltip/hover พร้อมใช้ผ่าน options — custom renderers ได้

### 3. Patterns

> Goal: charts จริง

1. **Series หลายตัว**: normalized data shape `{ label, s1, s2 }` + axes แยกต่อ key
2. **Time series**: primary axis `getValue` คืน Date — scale time อัตโนมัติ
3. **Responsive**: container มีขนาดชัดเจน — chart ยึดตาม parent
4. **Theming**: colors ผ่าน series options — map เข้า design tokens ของ app
5. **Loading/empty**: จัดการ `data: []` และ loading state เอง (headless-ish)

### 4. Verify

1. `/run-typecheck` + `/run-test`
2. Render จริง: axes labels, series shapes, tooltip
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `data` stable reference (`useMemo`) — array ใหม่ทุก render = re-render ทั้ง chart
- 0.x API — pin exact version; ห้าม assume API เหมือน Recharts
- Colors ผ่าน design tokens — ไม่ hardcode hex ใน chart config
- Chart ซับซ้อน (brushing, custom marks) → อ่าน grammar docs เต็มก่อน

## Expected Outcome

- Charts render ถูกตาม grammar config
- Responsive + themed ตรง design system
