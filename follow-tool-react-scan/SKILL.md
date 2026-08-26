---
name: follow-tool-react-scan
description: ตรวจหาและแก้ไข React performance issues ด้วย react-scan
---

## Goal

ตรวจหา performance issues ใน React application และ optimize ด้วย react-scan

## Scope

ใช้ `follow-tool-react-scan` สำหรับ project หรือ workflow ที่เป็น React

## Execute

### 1. Prepare

> Goal: เตรียม references และเข้าใจ react-scan APIs

1. ทำ `/check-reference` เพื่อตรวจ references จาก sources
2. ทำ `/learn-from-web` เพื่อเรียนรู้ react-scan APIs และ integration methods
3. ทบทวน workflows และ patterns ตาม conventions

### 2. Select Integration Method

> Goal: เลือกวิธี integrate react-scan เข้ากับ project

1. Script tag สำหรับ quick testing หรือ legacy apps โดยไม่ต้อง build
2. NPM package สำหรับ production apps ที่ต้องการ control และ TypeScript
3. Build tool plugin สำหรับ Vite, Webpack, esbuild, Rollup, Rspack, Rolldown, Astro
4. Browser extension สำหรับ analyze apps โดยไม่ต้องแก้ code

### 3. Install React Scan

> Goal: ติดตั้ง react-scan ตามวิธีที่เลือก

1. Script tag: ใส่ script ใน `index.html` ก่อน React
   ```html
   <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
   ```

2. NPM: รัน `bun add react-scan` แล้ว import ก่อน React
   ```typescript
   import { scan } from 'react-scan';
   import React from 'react';
   scan({ enabled: true });
   ```

3. Vite plugin: ใช้ plugin ใน `vite.config.ts`
   ```typescript
   import reactScan from 'react-scan/react-component-name/vite';
   export default defineConfig({
     plugins: [reactScan()]
   });
   ```

4. Browser extension: ติดตั้งบน Chrome/Firefox/Brave แล้ว activate ใน site ที่ต้องการ

### 4. Configure Options

> Goal: ตั้งค่า options สำหรับ scanning behavior

1. กำหนด `enabled` ตาม environment (`process.env.NODE_ENV === 'development'`)
2. เปิด `trackUnnecessaryRenders` เพื่อหา renders ที่ไม่ทำให้ DOM เปลี่ยน
3. ปรับ `showToolbar`, `showFPS`, `animationSpeed` ตามความสะดวก
4. ใช้ callbacks (`onRender`, `onCommitStart`, `onCommitFinish`) สำหรับ logic เพิ่มเติม
5. ใช้ `setOptions()` เพื่อเปลี่ยน config ขณะ runtime ได้

### 5. Initialize Scanning

> Goal: เริ่ม scanning สำหรับ client-side และ SSR apps

1. Import `scan` หรือ `useScan` ก่อน React และ React DOM
2. เรียก `scan(options)` สำหรับ client-side apps
3. ใช้ `useScan` hook ใน `useEffect` สำหรับ SSR apps หลัง hydration
4. ตรวจสอบ toolbar ว่าเริ่ม scanning แล้ว

### 6. Interpret Visual Cues

> Goal: อ่านค่า visual cues จาก react-scan

1. Component มี outline = มี render เกิดขึ้น
2. สีและความหนาของ outline = ระดับความรุนแรงของปัญหา
3. ตัวเลข render count = จำนวนครั้งที่ render
4. Unnecessary renders จะ highlight เมื่อเปิด `trackUnnecessaryRenders`

### 7. Analyze Performance Data

> Goal: วิเคราะห์ performance data จาก reports และ callbacks

1. ดู FPS meter (`showFPS: true`) เพื่อเช็ค performance โดยรวม
2. ดู notification count (`showNotificationCount: true`) สำหรับ slowdown alerts
3. เรียก `getReport()` เพื่อดู render report แบบละเอียด
4. ใช้ `onRender` callback เพื่อ collect metrics หรือ log เอง

### 8. Optimize Components

> Goal: ปรับ components ที่ re-render มากหรือไม่จำเป็น

1. หา components ที่ re-render บ่อยหรือไม่จำเป็น
2. ใช้ `React.memo` สำหรับ components ที่มี props ไม่เปลี่ยนบ่อย
3. ใช้ `useMemo`/`useCallback` สำหรับ expensive computations และ callbacks
4. แยก context เพื่อลด re-render ทั่ว app
5. วัดผลก่อนและหลัง optimize เพื่อยืนยันว่า unnecessary renders ลดลง

### 9. Disable in Production

> Goal: ปิด react-scan ใน production build

1. กำหนด `enabled: false` ใน production build
2. หลีกเลี่ยง `dangerouslyForceRunInProduction` ยกเว้น debugging ฉุกเฉิน
3. ใช้ build tool plugins เพื่อ strip code ออกจาก production
4. ตรวจสอบ bundle size ว่าไม่โตจาก react-scan code

## Rules

### 1. Integration Standards

- Import `react-scan` ก่อน React และ React DOM เสมอ
- เปิดใช้งานเฉพาะ development เป็นค่าเริ่มต้น
- ใช้ `useScan` ใน `useEffect` สำหรับ SSR applications

### 2. Performance Guidelines

- `trackUnnecessaryRenders` และ `log` ทำให้เพิ่ม overhead ใช้ด้วยความระมัดระวัง
- ใช้ build tool plugins เพื่อ preserve component names สำหรับ production analysis
- หาและจัดลำดับ components ที่มี highlight บ่อยที่สุดก่อน
- อย่า optimize ทุก components โดยไม่วัด impact จริง
- ตรวจสอบว่าไม่ได้ optimize เฉพาะ renders ที่ไม่ได้กระทบ UX
- ถอดถอนหรือ remove `react-scan` ก่อน deploy production

## Expected Outcome

- React app หา performance issues ได้ชัดเจนขึ้น
- Unnecessary renders ถูก highlight ด้วย visual cues ที่เข้าใจง่าย
- Performance data ถูก collect และ analyze เพื่อแก้ไขได้ตรงจุด
- Components ที่เป็นปัญหาถูก optimize อย่างเหมาะสม
- Production build ไม่มี react-scan code หรือ overhead
- Developer เห็น performance ของ app ได้ทันที
