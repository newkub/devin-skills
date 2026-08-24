---
name: follow-leptos
description: สร้าง reactive web applications ด้วย Rust พร้อม SSR และ CSR support
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

สร้าง reactive web applications ด้วย Rust พร้อม SSR และ CSR support

## Scope

ใช้สำหรับการพัฒนา web applications ด้วย Rust ที่มี performance สูงและ memory footprint ต่ำ

## When To Use

- เมื่อต้องการสร้าง reactive web applications ด้วย Rust
- เมื่อต้องการ SSR (Server-Side Rendering) และ CSR (Client-Side Rendering)
- เมื่อต้องการ performance สูงและ memory footprint ต่ำ
- เมื่อต้องการใช้ Rust ecosystem สำหรับ web development

## Execute

### 1. Create Project

> Goal: Create Project

```bash
cargo install cargo-leptos
cargo leptos new my-app
```

### 2. Develop Components

> Goal: ใช้ Leptos component system และ signals

### 3. Configure Routing

> Goal: ตั้งค่า routing สำหรับ navigation

### 4. Build and Run

> Goal: Build สำหรับ SSR หรือ CSR

## Rules

### Development
- ใช้ Rust สำหรับ type safety
- ใช้ signals สำหรับ reactive state
- Follow Leptos component patterns

### Best Practices
- ใช้ proper resource management
- Optimize reactivity
- Test SSR และ CSR modes

## References

- [Leptos Docs](https://leptos.dev)
- [Leptos GitHub](https://github.com/leptos-rs/leptos)
- [Leptos Book](https://book.leptos.dev)

## Related Skills

- `follow-write-devin-skills` - มาตรฐานการเขียน skills
- lang-rust
- bun

## Expected Outcome

- Reactive web applications ด้วย Rust
- Performance สูงและ memory footprint ต่ำ
- SSR และ CSR support
