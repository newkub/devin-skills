---
name: follow-uxui-animation
description: เลือกและใช้ animation/interaction libraries สำหรับ UX/UI visual interactive
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
  - follow-my-tech-stack
  - animejs
  - follow-react
  - follow-vue
  - follow-solidjs
  - follow-best-practice
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

เลือกและใช้ animation/interaction libraries ให้เหมาะสมกับ UX/UI visual interactive ใน web app

## Scope

ใช้เมื่อต้องการ implement animation, micro-interaction, scroll effects, gestures, data visualization, หรือ interactive visuals ใน TypeScript/JavaScript web projects

## Execute

### 1. Identify Animation Need

ระบุลักษณะ animation ที่ต้องการ

> Goal: เลือก library ตาม output เป้าหมาย

1. ระบุประเภท: DOM transition, SVG/line draw, scroll/parallax, gesture/drag, physics/spring, canvas/WebGL, data viz, vector/Lottie, หรือ micro-interaction
2. ระบุ target framework: React, Vue, Solid, Svelte, Vanilla
3. ระบุ constraints: bundle size, type safety, accessibility, performance budget
4. ถ้าไม่ชัด → ทำ `/ask-me` หรือดู `/follow-my-tech-stack`

### 2. Choose Library

เลือก library ตาม use case

> Goal: ใช้ library ที่ minimal และเหมาะสม

1. ใช้ `/follow-my-tech-stack` เพื่อดู animation/interactive row
2. เลือกตามกลุ่ม:
   - DOM timeline: `GSAP`, `Framer Motion`, `animejs`, `Motion One`
   - React: `Framer Motion`, `react-spring`, `@use-gesture`
   - Vue: `@vueuse/motion`, `GSAP`
   - Solid/Svelte: `GSAP`, `solid-motion`, `svelte/motion`
   - SVG line: `Vivus`, `GSAP DrawSVG`, `animejs`
   - Vector: `Lottie`, `Rive`
   - Scroll: `GSAP ScrollTrigger`, `Lenis`, `Locomotive Scroll`
   - Gesture: `@use-gesture`, `interact.js`
   - Physics: `Popmotion`, `react-spring`, `matter.js`
   - Canvas/WebGL: `Three.js`, `PixiJS`, `p5.js`
   - Data viz: `TanStack Charts`, `D3`, `Chart.js`
3. ถ้าต้องการหลาย framework → ใช้ `GSAP`, `animejs`, `Motion One` ทีเป็น framework-agnostic
4. ทำ `/check-reference` เพื่อ verify library version และ docs

### 3. Install And Configure

ติดตั้งและตั้งค่า

> Goal: พร้อมใช้งานและปลอดภัย

1. ติดตั้งด้วย `bun add <library>` หรือ `bun add -D <library>` ถ้าเป็น dev tool
2. เพิ่ม CSS `prefers-reduced-motion` media query เสมอ
3. ตั้งค่า global animation defaults (duration, easing) ถ้า library รองรับ
4. สร้าง helper/composable สำหรับ cleanup animation บน unmount

### 4. Implement Patterns

เขียน animation patterns ตาม best practices

> Goal: ใช้งานได้จริงและ performance ดี

1. ใช้ `transform` และ `opacity` เป็นหลัก หลีกเลี่ยง `width`, `height`, `top`, `left`
2. ใช้ `will-change` อย่างระมัดระวังและ remove หลัง animate เสร็จ
3. ใช้ stagger แทน loop เมื่อต้อง animate หลาย element
4. ใช้ `requestAnimationFrame` หรือ library timeline สำหรับ sequence
5. รองรับ `prefers-reduced-motion` ด้วยการ disable หรือ simplify animation
6. ทำ `/follow-react`, `/follow-vue`, หรือ `/follow-solidjs` ตาม framework เพื่อ integrate

### 5. Validate

ตรวจสอบ implementation

> Goal: ไม่มี regression, a11y, หรือ performance issues

1. รัน `bun run lint` และ `bun run typecheck` ถ้ามี
2. เปิด browser ทดสอบ animation บน target devices และ browsers
3. ตรวจสอบ `prefers-reduced-motion` ทำงาน
4. ตรวจสอบ memory leaks และ cleanup listeners/timers/tweens
5. ทำ `/validate` และ `/validate-workflow`
6. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Library Selection

- ใช้ library ตาม output จริง ไม่ over-engineer
- ถ้าเป็น micro-interaction ง่ายๆ ให้พิจารณา CSS transitions ก่อน
- ใช้ framework-native animation ถ้ามี เช่น `svelte/motion`, `@vueuse/motion`, `Framer Motion`
- ใช้ `animejs` หรือ `GSAP` เมื่อต้องการ timeline/complex sequence

### 2. Performance

- ใช้ `transform` และ `opacity` เป็นหลัก
- หลีกเลี่ยง trigger layout (width, height, top, left, margin)
- ไม่ animate หลาย element พร้อมกันเกิน 50-100 ตัว โดยไม่ batch
- ใช้ `IntersectionObserver` หรือ library virtualizer สำหรับ scroll animation

### 3. Accessibility

- เคารพ `prefers-reduced-motion` เสมอ
- ไม่ใช้ animation สำหรับ content สำคัญที่ต้องอ่านก่อน
- ให้ผู้ใช้ pause/stop สำหรับ auto-play animation
- ใช้ `focus-visible` และ keyboard navigation ไม่ถูก animation บัง

### 4. Code Quality

- แยก animation logic ออกจาก business logic
- ใช้ type-safe wrappers เมื่อเป็น TypeScript
- cleanup animation instances บน unmount หรือ route change
- ใช้ backticks สำหรับ library names, commands, file paths

## Expected Outcome

- Library ที่เลือกเหมาะสมกับ use case
- ติดตั้งและ configure ถูกต้อง
- Animation patterns ทีทำงานได้จริง
- ผ่าน lint, typecheck, a11y, และ performance validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
