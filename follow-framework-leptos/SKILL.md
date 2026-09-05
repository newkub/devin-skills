---
name: follow-framework-leptos
description: สร้าง reactive web applications ด้วย Rust พร้อม SSR และ CSR support
argument-hint: "[scope]"
related:
  - follow-framework-astro
  - follow-framework-capacitor
  - follow-framework-desktop-app
  - follow-best-practice
  - setup-cicd
  - follow-my-tech-stack
  - follow-lang-rust
---

## Goal

สร้าง reactive web applications ด้วย Rust พร้อม SSR และ CSR support

## Scope

ใช้สำหรับการพัฒนา web applications ด้วย Rust ที่มี performance สูงและ memory footprint ต่ำ ครอบคลุม SSR, CSR, reactive signals และ component system

## Execute

### 1. Create Project

> Goal: สร้าง Leptos project ใหม่

1. ติดตั้ง `cargo-leptos`: `cargo install cargo-leptos`
2. สร้าง project: `cargo leptos new my-app`
3. ตรวจสอบ `Cargo.toml` มี `leptos` dependency พร้อม features ตาม target (SSR, CSR)
4. ใช้ `follow-lang-rust` สำหรับ Rust best practices

### 2. Develop Components

> Goal: ใช้ Leptos component system และ signals

1. สร้าง components ด้วย `#[component]` macro
2. ใช้ `create_signal` สำหรับ reactive state
3. ใช้ `create_memo` สำหรับ derived state
4. แยก components เป็นไฟล์ใน `src/components/`

### 3. Configure Routing

> Goal: ตั้งค่า routing สำหรับ navigation

1. ใช้ `leptos_router` สำหรับ client-side หรือ server-side routing
2. กำหนด routes ด้วย `<Route>` component
3. ใช้ `<A>` component สำหรับ navigation links
4. รองรับ nested routes และ dynamic params

### 4. Build And Run

> Goal: Build สำหรับ SSR หรือ CSR

1. SSR: `cargo leptos build --release` และรัน server binary
2. CSR: `cargo leptos build --release --features csr` สำหรับ static SPA
3. ตรวจสอบ `target/` มี output ที่ถูกต้อง
4. ทดสอบ SSR และ CSR modes ก่อน production

## Rules

### 1. Development

- ใช้ Rust สำหรับ type safety
- ใช้ signals สำหรับ reactive state
- ทำตาม Leptos component patterns จาก official docs

### 2. Best Practices

- ใช้ proper resource management
- Optimize reactivity ด้วย `create_memo` สำหรับ expensive computations
- Test SSR และ CSR modes ก่อน deploy

- ใช้ /follow-framework-astro ถ้าจำเป็น
- ใช้ /follow-framework-capacitor ถ้าจำเป็น
- ใช้ /follow-framework-desktop-app ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น

## Expected Outcome

- Reactive web applications ด้วย Rust
- Performance สูงและ memory footprint ต่ำ
- SSR และ CSR support
- Components และ routing ทำงานได้ถูกต้อง
