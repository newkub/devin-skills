---
name: follow-react-scan
description: ตรวจจับและแก้ไข React performance issues ด้วย react-scan โดยไม่แก้ไขโค้ด
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

หา performance issues ใน React และแก้ไขตามข้อมูลจาก react-scan

## Scope

Use `follow-react-scan` for the specific tasks and workflows it covers

## Execute

### 1. Prepare

> Goal: Prepare

1. รัน `/check-reference` เก็บ reference จากทุก sources
2. ใช้ `/learn-from-web` ศึกษา react-scan APIs และ integration methods
3. อ่าน workflows ที่คล้ายกันดู patterns และ conventions

### 2. Select Integration Method

> Goal: Select Integration Method

1. Script tag สำหรับ quick testing หรือ legacy apps ไม่ต้อง build
2. NPM package สำหรับ production apps ต้องการ control และ TypeScript
3. Build tool plugin สำหรับ Vite, Webpack, esbuild, Rollup, Rspack, Rolldown, Astro
4. Browser extension สำหรับ analyze apps โดยไม่แก้โค้ด

### 3. Install React Scan

> Goal: Install React Scan

1. Script tag: ใส่ script ใน `index.html` ก่อน React
   ```html
   <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
   ```

2. NPM: รัน `bun install react-scan` แล้ว import ก่อน React
   ```typescript
   import { scan } from 'react-scan';
   import React from 'react';
   scan({ enabled: true });
   ```

3. Vite plugin: ใส่ plugin ใน `vite.config.ts`
   ```typescript
   import reactScan from 'react-scan/react-component-name/vite';
   export default defineConfig({
     plugins: [reactScan()]
   });
   ```

4. Browser extension: ติดตั้งจาก Chrome/Firefox/Brave แล้ว activate บน site ที่ต้องการ

### 4. Configure Options

> Goal: Configure Options
1. ตั้ง `enabled` ตาม environment (`process.env.NODE_ENV === 'development'`)
2. เปิด `trackUnnecessaryRenders` เพื่อหา renders ที่ไม่มี DOM changes
3. ตั้งค่า `showToolbar`, `showFPS`, `animationSpeed` ตามต้องการ
4. ใช้ callbacks (`onRender`, `onCommitStart`, `onCommitFinish`) สำหรับ logic พิเศษ
5. เรียก `setOptions()` เมื่อต้องการเปลี่ยน config ระหว่าง run

### 5. Initialize Scanning

> Goal: Initialize Scanning
1. Import `scan` หรือ `useScan` ก่อน React และ React DOM
2. เรียก `scan(options)` ทันทีสำหรับ client-side apps
3. ใช้ `useScan` hook ใน `useEffect` สำหรับ SSR apps หลัง hydration
4. ตรวจสอบว่า toolbar ขึ้นและ scanning ทำงาน

### 6. Interpret Visual Cues

> Goal: Interpret Visual Cues
1. Component มี outline = มี render เกิดขึ้น
2. สีและความหนาของ outline = ความรุนแรงของปัญหา
3. ตัวเลข render count = จำนวนครั้งที่ render
4. Unnecessary renders จะ highlight พิเศษเมื่อเปิด `trackUnnecessaryRenders`

### 7. Analyze Performance Data

> Goal: Analyze Performance Data
1. ดู FPS meter (`showFPS: true`) เช็ค performance โดยรวม
2. ใช้ notification count (`showNotificationCount: true`) ดู slowdown alerts
3. เรียก `getReport()` เพื่อดู render report แบบละเอียด
4. ใช้ `onRender` callback เพื่อ collect metrics หรือ log ข้อมูล

### 8. Optimize Components

> Goal: Optimize Components
1. หา components ที่ re-render บ่อยโดยไม่จำเป็น
2. ใช้ `React.memo` สำหรับ components ที่มี props เหมือนเดิม
3. ใช้ `useMemo`/`useCallback` สำหรับ expensive computations และ callbacks
4. แก้ไข context ที่ทำให้ re-render ทั้ง app
5. เช็คว่าการ optimize ลด unnecessary renders ได้จริง

### 9. Disable in Production

> Goal: Disable in Production
1. ตั้ง `enabled: false` ใน production build
2. หลีกเลี่ยง `dangerouslyForceRunInProduction` ยกเว้น debugging จำเป็น
3. ใช้ build tool plugins เพื่อ strip code ออกใน production
4. เช็คว่า bundle size ไม่เพิ่มจาก react-scan code

## Rules

1. Integration Standards

- Import `react-scan` ก่อน React และ React DOM เสมอ
- เปิดเฉพาะ development โดย default
- ใช้ `useScan` ใน `useEffect` สำหรับ SSR applications

2. Performance Guidelines

- `trackUnnecessaryRenders` และ `log` อาจเพิ่ม overhead
- ใช้ build tool plugins เพื่อ preserve component names ใน production analysis
- ให้ความสำคัญกับ components ที่ highlight บ่อยที่สุด
- เริ่ม optimize จาก components ที่มี impact มากที่สุดก่อน
- ตรวจสอบว่าการ optimize ลด renders ได้จริงหลังแก้ไข
- ปิดหรือ remove `react-scan` ก่อน deploy production

## Expected Outcome

1. React app ที่มี performance issues ถูกหาโดยอัตโนมัติ
2. Unnecessary renders ถูก highlight ด้วย visual cues ชัดเจน
3. Performance data ถูก collect และ analyze ได้อย่างมีประสิทธิภาพ
4. Components ที่มีปัญหาถูก optimize ตามลำดับความสำคัญ
5. Production build ไม่มี react-scan code หรือ overhead
6. Developer เข้าใจ performance ของ app มากขึ้น
