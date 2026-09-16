---
name: follow-lib-treejs
description: ใช้ three.js (3D WebGL/WebGPU) — renderer, addons, framework integration, dispose
argument-hint: "[target-or-scope]"
related:
  - follow-lib-solidjs
  - run-verify
  - run-test
---

## Goal

ใช้ three.js สร้าง 3D scene ถูกต้อง — renderer, camera, addons, controls, loaders, animation loop และ dispose resources ครบ (lib three.js)

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ 3D rendering — scene, camera, lights, materials, models, shaders, post-processing, WebGPU (lib three.js)

- ใช้ skill นี้สำหรับ vanilla three.js และ framework bindings — integration เชิงลึกกับ SolidJS ให้ทำ `/follow-lib-solidjs` ร่วม
- 2D canvas/SVG ที่ไม่ต้องการ GPU → พิจารณา `follow-lib-animejs` หรือ Canvas2D แทน
- npm package `three` versioned เป็น `0.1xx.x` ตรงกับ release `rXXX` — latest `0.186.x` (r186, verified 2026-09-17)
- References: threejs.org/manual | threejs.org/docs | github.com/mrdoob/three.js/wiki/Migration-Guide

## Execute

### 1. Setup

> Goal: ติดตั้งและเลือก renderer ถูกต้อง

1. ติดตั้ง `bun add three` + `bun add -d @types/three`
2. WebGL (default, compat กว้าง): `import * as THREE from "three"` + `new THREE.WebGLRenderer({ antialias: true })`
3. WebGPU (modern, TSL shaders): `import * as THREE from "three/webgpu"` + `new THREE.WebGPURenderer()` — ใช้ `three/tsl` สำหรับ node materials
4. Addons เสมอผ่าน `three/addons/...` (map ไป `examples/jsm`) เช่น `three/addons/controls/OrbitControls.js`, `three/addons/loaders/GLTFLoader.js`, `three/addons/libs/stats.js`
5. อย่า import `three/examples/jsm/...` ตรงๆ — ใช้ `three/addons` alias เสมอ

### 2. Framework Integration

> Goal: ผูกกับ framework ตามมาตรฐาน

1. React → `@react-three/fiber` + `@react-three/drei` (mature)
2. Vue → `tresjs` (`@tresjs/core`)
3. SolidJS → `solid-three` (port ของ R3F — ยัง early dev) หรือ vanilla three ใน `onMount` + `onCleanup` dispose (แนะนำสำหรับ production)
4. Vanilla/TS → ครอบ canvas ใน component ที่ mount ครั้งเดียว, เก็บ renderer/scene ใน closure ไม่ใส่ store (non-serializable)

### 3. Core Loop

> Goal: scene lifecycle ถูกต้อง

1. `renderer.setAnimationLoop(fn)` — ไม่ใช้ `requestAnimationFrame` เอง (รองรับ XR)
2. `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` — cap DPR กัน mobile burn
3. Resize → `ResizeObserver` บน container แล้ว `camera.aspect` + `renderer.setSize` (ไม่ใช้ window resize)
4. ใช้ `colorSpace` + tone mapping: `renderer.toneMapping = THREE.ACESFilmicToneMapping` เมื่อต้องการ look สมัยใหม่

### 4. Performance

> Goal: ไม่ leak GPU memory และ frame budget ไม่พัง

1. Dispose ครบใน cleanup: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.dispose()` + `scene.traverse` เก็บ orphan
2. Instancing สำหรับ object ซ้ำ — `InstancedMesh` ไม่ใช่ clone loop
3. `frustumCulled` default เปิดอยู่ — อย่าปิดมั่ว; ใช้ `three-mesh-bvh` (`bun add three-mesh-bvh`) หรือ LOD สำหรับ scene ใหญ่
4. Asset: GLTF/GLB + `DRACOLoader`/`MeshoptDecoder` สำหรับ compression; KTX2 textures ผ่าน `KTX2Loader`
5. Profile ด้วย `stats.js` addon หรือ `renderer.info` (drawcalls, triangles)

### 5. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ Migration Guide ก่อนใช้ API จาก docs เก่า — three.js break บ่อยระหว่าง rXXX
4. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib three.js)

## Rules

- dispose ทุก GPU resource ใน cleanup — geometry, material, texture, render target, renderer
- อย่าสร้าง renderer ใหม่ทุก re-render — mount ครั้งเดียวแล้ว mutate scene
- cap `devicePixelRatio` ที่ 2 เสมอ
- ใช้ `three/addons` ไม่ใช่ `three/examples/jsm` path ตรง
- อย่าเก็บ THREE objects ใน reactive store (Solid/Vue) — proxy ทำ class internals พัง; เก็บเป็น plain ref/closure

- ใช้ `/follow-lib-solidjs` ถ้า integrate กับ SolidJS เชิงลึก
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib three.js)
- ไม่มี GPU memory leak จาก dispose ที่ขาด
- ไม่มี security/performance pitfalls ที่รู้จัก (lib three.js)
- Lint, typecheck, tests ผ่าน
