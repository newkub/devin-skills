---
name: follow-create-website-rust
description: สร้าง website ด้วย Rust WASM + Solid frontend ผ่าน Vite plugin
argument-hint: "[project-name]"
allowed-tools:
  - exec
  - read
  - edit
  - write
  - ask_user_question
related:
  - follow-create-rust-crate
  - follow-framework-solidjs
  - follow-tool-vite
  - follow-tool-cargo
  - use-lib-effective
  - follow-create-vite-plugins
  - deploy-to-vercel
  - follow-my-tech-stack
  - review-techstack
  - deploy-to-cloudflare
---

## Goal

สร้าง website project ที่ใช้ Rust คำนวณหนักใน browser ผ่าน WebAssembly และใช้ SolidJS บน Vite สำหรับ frontend

## Scope

ใช้เมื่องานต้องการ performance จาก Rust ใน browser โดยไม่เขียน backend เช่น image/audio processing, simulation, cryptography, graph layout หรือ computational geometry

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Verify Toolchain

> Goal: ยืนยันว่า Rust และ wasm-pack พร้อมใช้

1. รัน `rustc --version` และ `cargo --version`
2. รัน `wasm-pack --version` ถ้าไม่มี → ติดตั้งด้วย `cargo install wasm-pack`
3. รัน `bun --version` หรือ `node --version` สำหรับ frontend tooling
4. ถ้ายังไม่มี `wasm32-unknown-unknown` target → รัน `rustup target add wasm32-unknown-unknown`

### 3. Create Rust Crate

> Goal: สร้าง Rust library สำหรับ compile เป็น WASM

1. รัน `cargo new --lib <project-name>-core`
2. แก้ไข `Cargo.toml`:
   - `crate-type = ["cdylib"]`
   - เพิ่ม `wasm-bindgen` กับ `serde` ถ้าต้องการ pass ข้อมูลซับซ้อน
3. สร้าง `src/lib.rs` ด้วยฟังก์ชัน public เช่น:
   ```rust
   use wasm_bindgen::prelude::*;

   #[wasm_bindgen]
   pub fn fibonacci(n: u32) -> u64 {
       match n {
           0 => 0,
           1 => 1,
           _ => fibonacci(n - 1) + fibonacci(n - 2),
       }
   }
   ```
4. รัน `cargo check` เพื่อตรวจ syntax

### 4. Build WASM Package

> Goal: สร้าง `.wasm` และ JS bindings จาก Rust crate

1. รัน `wasm-pack build <project-name>-core --target web --out-dir pkg`
2. ตรวจสอบว่าเกิด `pkg/<project-name>_core.js`, `pkg/<project-name>_core_bg.wasm`, และ `package.json`
3. ถ้ามี dependencies ของ `wasm-pack` ขาดหาย → รัน `wasm-pack build` อีกครั้งหลังแก้ `Cargo.toml`

### 5. Setup Vite + Solid Frontend

> Goal: สร้าง frontend project ด้วย Solid

1. รัน `bun create vite@latest <project-name>-web --template solid-ts`
2. เข้า `<project-name>-web` แล้วรัน `bun install`
3. ติดตั้ง wasm-pack Vite plugin: `bun add -D vite-plugin-wasm-pack`
4. สร้าง symlink หรือ copy `pkg/` จาก crate มาไว้ใน `web/pkg`
5. แก้ไข `package.json` ให้มี script:
   ```json
   "wasm": "wasm-pack build ../<project-name>-core --target web --out-dir pkg",
   "dev": "bun wasm && vite",
   "build": "bun wasm && tsc && vite build"
   ```

### 6. Configure Vite

> Goal: ตั้งค่า Vite ให้โหลด WASM package ได้

1. แก้ไข `vite.config.ts`:
   ```ts
   import { defineConfig } from 'vite';
   import solid from 'vite-plugin-solid';
   import wasmPack from 'vite-plugin-wasm-pack';

   export default defineConfig({
     plugins: [
       solid(),
       wasmPack('../<project-name>-core'),
     ],
   });
   ```
2. ถ้าใช้ `vite-plugin-wasm` แทน ให้เพิ่ม `topLevelAwait` plugin
3. ตรวจ `tsconfig.json` ให้รองรับ `esnext` module

### 7. Call Rust From Solid

> Goal: ใช้งาน WASM function ใน Solid components

1. ใน `src/App.tsx` import ฟังก์ชันจาก crate:
   ```tsx
   import { createResource, Show } from 'solid-js';
   import * as wasm from '<project-name>-core';

   export default function App() {
     const [result] = createResource(async () => wasm.fibonacci(40));
     return (
       <div>
         <Show when={!result.loading} fallback={<p>computing...</p>}>
           <p>fibonacci(40) = {result()}</p>
         </Show>
       </div>
     );
   }
   ```
2. ใช้ `createResource` เมื่อ loading WASM แบบ async
3. ถ้า plugin ทำให้ import เป็น sync → ใช้ `createSignal` ธรรมดาได้

### 8. Add State And UX

> Goal: สร้าง UI ครอบคลุมการใช้งาน Rust function

1. สร้าง `src/components/` สำหรับ input form, result display, error boundary
2. ใช้ `createStore` ถ้ามี state ซับซ้อน
3. ใช้ `<ErrorBoundary>` รองรับ WASM init errors
4. ทำ `/follow-framework-solidjs` เพื่อตรวจ patterns ของ Solid

### 9. Test And Build

> Goal: ยืนยันว่า project build ผ่านทั้ง Rust และ Vite

1. รัน `cargo test` ใน crate directory
2. รัน `bun run build` ใน web directory
3. รัน `bun run dev` เพื่อตรวจ dev mode
4. ทำ `/run-test` สำหรับ frontend ถ้ามี test suites

### 10. Deploy

> Goal: deploy website ไปยัง platform ที่เลือก

1. ถ้า Vercel → `bunx vercel --prod`
2. ถ้า Cloudflare Pages → ทำ `/follow-service-cloudflare`
3. ตรวจสอบว่า `.wasm` files ถูก serve ด้วย MIME type `application/wasm`
4. ทดสอบ production URL กับ function หนัก

### 11. Ship

> Goal: ส่งมอบ project

1. ทำ `/ship-ci`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Rust Crate

- ใช้ `wasm-bindgen` สำหรับ expose function ไปยัง JS
- ใช้ `serde-wasm-bindgen` ถ้าต้องส่ง object/complex data
- หลีกเลี่ยง `unwrap()` ใน library code
- `Cargo.toml` ต้องมี `crate-type = ["cdylib"]`
- ใช้ `wasm-pack --target web` สำหรับ browser ESM

### 2. Vite Plugin

- ใช้ `vite-plugin-wasm-pack` สำหรับ crate ที่ build ด้วย `wasm-pack`
- ใช้ `vite-plugin-wasm` + `vite-plugin-top-level-await` ถ้า import `.wasm` โดยตรง
- ไม่ commit `pkg/` หรือ `target/` ให้เพิ่มลง `.gitignore`

### 3. Solid Frontend

- ใช้ `.tsx` สำหรับทุก components
- ห้าม destructure props — ใช้ `mergeProps`/`splitProps`
- ใช้ `createResource` สำหรับ async WASM initialization
- ใช้ `createSignal` สำหรับ sync state

### 4. Performance

- ย้าย computation หนักลง Rust WASM ไม่ใช่ main thread
- ถ้ามี batch processing ให้พิจารณา Web Workers
- ตรวจ `cargo build --release` ก่อน deploy

### 5. Safety

- ไม่ expose pointer/memory ตรงๆ ให้ JS ถ้าไม่จำเป็น
- ใช้ `#[wasm_bindgen]` types ที support โดย `wasm-bindgen`
- ไม่ commit secrets หรือ API keys

## Expected Outcome

- Rust crate build ผ่าน `wasm-pack` และ produce `pkg/` ที่ใช้ใน browser ได้
- Vite + Solid project รัน `bun run dev` ได้โดยไม่มี errors
- Rust function ถูกเรียกจาก Solid component และแสดงผลบนหน้าเว็บ
- Production build สำเร็จและพร้อม deploy
- Project structure ถูกต้องตาม convention ของ Rust + Vite + Solid
