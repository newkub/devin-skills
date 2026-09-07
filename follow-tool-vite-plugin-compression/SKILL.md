---
name: follow-tool-vite-plugin-compression
description: ใช้ vite-plugin-compression2 สร้าง gzip/brotli pre-compressed assets ตอน build
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ vite-plugin-compression2 สร้าง gzip/brotli pre-compressed assets ตอน build

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ติดตั้ง `vite-plugin-compression2` แล้วใส่ใน `plugins` — รองรับ gzip + brotli
1. ตั้ง `algorithms: ["gzip","brotliCompress"]` และ `threshold` (เช่น 1024 bytes)
1. server ต้อง serve `.br`/`.gz` ด้วย `Content-Encoding` ที่ถูกต้อง
1. บน Cloudflare Workers/Pages compression ทำที่ edge แล้ว — ใช้เฉพาะเมื่อ host เอง

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- ไม่จำเป็นบน Cloudflare/modern CDN — edge compress ให้อัตโนมัติ
- exclude images/fonts ที่ compress อยู่แล้ว (woff2, webp)
- อย่า compress files เล็กกว่า threshold — overhead มากกว่าประโยชน์

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน