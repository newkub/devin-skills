---
name: follow-uxui-3d
description: สร้าง 3D UI interactions ด้วย Three.js, Spline, Rive 3D ใน UX/UI
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
  - follow-uxui-animation
  - follow-uxui-interaction
  - follow-uxui-gesture
  - follow-my-tech-stack
  - follow-react
  - follow-vue
  - follow-solidjs
  - follow-best-practice
  - review-performance
  - review-accessibility
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

สร้าง 3D UI interactions เช่น card flip, product viewer, scene navigation ด้วย Three.js, Spline, หรือ Rive 3D ให้ performant และ accessible

## Scope

ใช้สำหรับ product showcase, hero sections, data viz 3D, interactive storytelling ทีต้องการ depth

## Execute

### 1. Detect 3D Need

ระบุ use case 3D

> Goal: เลือก tool และ pattern ถูกต้อง

1. ระบุ use case: product viewer, hero, data viz, game-like UI, character
2. ระบุ complexity: simple (2.5D) หรือ full 3D scene
3. ระบุ interaction: rotate, zoom, pan, click/hover
4. ระบุ target framework: React, Vue, Solid, Svelte
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Tool

เลือก 3D tool

> Goal: ใช้ tool ทีเหมาะกับทีมและ performance

1. ถ้าเป็น React → `@react-three/fiber` + `@react-three/drei`
2. ถ้าต้องการ embed from design → `Spline` runtime
3. ถ้าต้องการ vector 3D ไฟล์เล็ก → `Rive` หรือ `Lottie`
4. ถ้า Vanilla หรือ full control → `Three.js`

### 3. Implement 3D Interaction

สร้าง 3D scene

> Goal: smooth และ responsive

1. ใช้ camera ที user ควบคุมได้ง่าย (orbit, pan, zoom)
2. ใช้ lighting ทีเหมาะสม
3. ใช้ raycaster สำหรับ hover/click
4. ใช้ lazy loading สำหรับ large assets
5. รองรับ `prefers-reduced-motion` (disable auto-rotate)

### 4. Optimize And Validate

optimize และตรวจสอบ

> Goal: ไม่ทำให้ device ช้า

1. ใช้ `requestAnimationFrame` อย่างระมัดระวัง
2. ลด polygon count และ texture size
3. ใช้ instancing สำหรับ repeated objects
4. ทดสอบบน low-end device
5. ทำ `/review-performance` และ `/validate`
6. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Progressive Enhancement

- 3D เป็น enhancement ไม่ใช่ requirement
- มี fallback 2D หรือ static image
- รองรับ reduced motion

### 2. Performance

- ใช้ `useFrame` อย่างระมัดระวัง
- ลด draw calls
- ใช้ texture compression
- ไม่ render 3D บน background

### 3. Accessibility

- ให้ keyboard controls สำหรับ 3D navigation
- ให้ text description สำหรับ screen reader
- รองรับ `prefers-reduced-motion`

## Expected Outcome

- 3D UI interaction ที performant
- รองรับ mouse, touch, keyboard
- ผ่าน lint, typecheck, performance validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
