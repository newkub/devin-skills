---
name: svelte-runes-reference
description: Runes API reference สำหรับ Svelte 5
---

## Goal

อ้างอิง Runes API ทีใช้ใน Svelte 5

## Scope

ใช้เมื่องานต้องระบุวิธีใช้ runes อย่างถูกต้อง

## Runes

- `$state()` — reactive state (deeply reactive by default)
- `$derived()` — computed values (lazy evaluation)
- `$effect()` — side effects เท่านั้น (DOM, network, analytics)
- `$props()` — component props พร้อม destructuring
- `$bindable()` — bindable props
- `$effect.pre()` — effects ก่อน DOM updates
- `$state.snapshot()` — immutable snapshot

## Rules

- `$effect` ห้ามใช้สำหรับ sync state ใช้ `$derived`
- `$state` ใช้ใน `.ts` files แทน Svelte stores เมื่อเป็นไปได้
- `$effect` เป็น escape hatch ไม่ใช่ default

## Expected Outcome

- ใช้งาน runes ถูกต้องตาม use case
