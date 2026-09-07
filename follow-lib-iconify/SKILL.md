---
name: follow-lib-iconify
description: ใช้ @iconify-json/* icon sets — Iconify API, offline bundles, on-demand loading
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ @iconify-json/* icon sets — Iconify API, offline bundles, on-demand loading

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `@iconify-json/<set>` (เช่น mdi, lucide) กับ UnoCSS `presetIcons` หรือ icon component
1. เลือก icon set ตาม design: mdi (material), lucide (minimal), tabler
1. ใช้ on-demand loading — bundle เฉพาะ icons ที่ใช้จริง
1. สำหรับ custom icons ใช้ `customizations` หรือ inline SVG แทน

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- อย่า import ทั้ง icon set — ใช้ per-icon เสมอ
- ตั้ง `size`/`color` ผ่าน props/class ไม่ hardcode ใน SVG
- ใช้ iconify API runtime เฉพาะ dynamic icons — static icons bundle ไว้เลย

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน