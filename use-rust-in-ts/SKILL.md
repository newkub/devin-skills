---
name: use-rust-in-ts
description: ค้นหาและใช้งาน Rust libraries ที่มี npm packages สำหรับ TypeScript/JavaScript projects
---

## Goal

ค้นหาและใช้งาน Rust libraries ที่มี npm packages เพื่อใช้ประโยชน์จาก performance ของ Rust ใน TypeScript/JavaScript projects

## Scope

ครอบคลุมการค้นหาและใช้งาน Rust libraries ผ่าน native bindings, WebAssembly, และ build tools

## Execute

### 1. วิเคราะห์ Requirements

1. ระบุ use case ที่ต้องการ (performance, cross-platform, etc.)
2. ทำ `/choose-tech-stack` เพื่อเลือกวิธี integration ที่เหมาะสม
3. ตัดสินใจระหว่าง native bindings หรือ WebAssembly

### 2. ค้นหา Rust Libraries

ค้นหาด้วย keywords เหล่านี้:
- "rust npm package"
- "napi-rs" - Node.js native bindings
- "wasm-bindgen" - WebAssembly bindings
- "neon-bindings" - Node.js bindings
- "swc" - Rust-based compiler
- "esbuild" - Go-based bundler (แต่มี Rust alternatives)
- "rolldown" - Rust-based Rollup alternative
- "turbopack" - Rust-based bundler
- "rspack" - Rust-based webpack alternative

### 3. เลือก Integration Method

#### Native Node.js Bindings
- napi-rs - Build native Node.js modules with Rust
- neon-bindings - Write native Node.js modules in Rust
- node-bindgen - Automatic FFI bindings

#### WebAssembly Bindings
- wasm-bindgen - Rust to WebAssembly bindings
- wasm-pack - Build Rust WebAssembly packages

#### Build Tools (Rust-based)
- swc - Rust-based JavaScript/TypeScript compiler
- rolldown - Rust-based Rollup alternative
- turbopack - Rust-based bundler (Next.js)
- rspack - Rust-based webpack alternative
- oxc - Rust-based JavaScript toolchain

#### ตัวอย่าง Libraries ที่เขียนด้วย Rust
- @napi-rs/blake-hash - BLAKE3 hashing
- @napi-rs/crypto - Crypto operations
- @swc/core - JavaScript/TypeScript compiler
- `@rolldown/**` - Bundling tools
- oxlint - Fast linter

### 4. ติดตั้งและทดลอง

#### สำหรับ napi-rs
```bash
npm install @napi-rs/cli
napi init
```

#### สำหรับ wasm-bindgen
```bash
cargo install wasm-pack
wasm-pack build --target web
```

#### สำหรับ swc
```bash
npm install @swc/core
```

### 5. วัดผลและตัดสินใจ

- ใช้ napi-rs ถ้าต้องการ native performance บน Node.js
- ใช้ wasm-bindgen ถ้าต้องการ cross-platform (browser + Node.js)
- ใช้ swc ถ้าต้องการ fast TypeScript compilation
- ใช้ rolldown/turbopack ถ้าต้องการ fast bundling

## Rules

### 1. Method Selection

เลือกวิธี integration ตาม use case:
- ใช้ napi-rs สำหรับ native performance บน Node.js
- ใช้ wasm-bindgen สำหรับ cross-platform (browser + Node.js)
- ใช้ swc สำหรับ fast TypeScript compilation
- ใช้ rolldown/turbopack สำหรับ fast bundling

### 2. Performance Considerations

- เปรียบเทียบ performance กับ pure JavaScript solutions
- วัด benchmark ก่อนใช้งานจริง
- พิจารณา cold start time สำหรับ serverless

### 3. Maintenance

- เลือก libraries ที่มี active maintenance
- ตรวจสอบ compatibility กับ Node.js versions
- พิจารณา build complexity และ CI/CD impact

## Expected Outcome

- เลือก Rust libraries ที่เหมาะสมกับ project
- Integration ทำงานได้อย่างถูกต้อง
- Performance improvement ที่วัดได้
- Maintenance burden ที่ยอมรับได้

## Common Mistakes

- ใช้ Rust เพราะ trend โดยไม่ได้วัดผลจริง
- เลือก native bindings แต่ต้องการ cross-platform
- ไม่พิจารณา build time และ CI/CD impact
- ใช้ libraries ที่ไม่มี maintenance

## References

- napi-rs: https://napi.rs
- wasm-bindgen: https://rustwasm.github.io/wasm-bindgen/
- swc: https://swc.rs
- rolldown: https://rolldown.rs
