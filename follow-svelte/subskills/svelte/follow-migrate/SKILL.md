---
name: svelte-follow-migrate
description: Migrate Svelte 4 project ไป Svelte 5
allowed-tools:
  - read
  - edit
  - write
  - grep
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-typescript
  - validate
---

## Goal

Migrate Svelte 4 project ไป Svelte 5 ด้วย `sv migrate` และแก้ syntax ตาม patterns

## Scope

ใช้เมื่องานมี code Svelte 4 อยู่แล้วและต้องการ upgrade ไป Svelte 5

## Execute

### 1. Backup

> Goal: สำรอง project ก่อน migrate

1. ทำ `/git-commit` หรือ backup branch ก่อน
2. ตรวจสอบ `package.json` ว่าล็อก version ไว้

### 2. Run Sv Migrate

> Goal: รัน migration tool

1. รัน `npx sv migrate svelte-5`
2. ตรวจสอบ diff ทีเกิดขึ้น
3. ถ้ามี error → `/resolve-errors`

### 3. Verify

> Goal: ตรวจสอบว่า project ยังทำงานได้

1. รัน `bun run check` หรือ `npx svelte-check`
2. รัน `bun run build`
3. ทำ `/validate`

### 4. Manual Review

> Goal: ตรวจจุดที migration อาจไม่ครบ

1. ตรวจ `on:click` ยังคงอยู่หรือไม่
2. ตรวจ stores เปลี่ยนเป็น `$state` ตามทีต้องการ
3. ตรวจ slots เปลี่ยนเป็น snippets

## Rules

### 1. Safety

- ต้องมี backup ก่อน migrate
- ไม่ force หาก test fail

### 2. Syntax Mapping

- `let count = 0` → `let count = $state(0)`
- `$: doubled = count * 2` → `let doubled = $derived(count * 2)`
- `$: { console.log(count) }` → `$effect(() => { console.log(count) })`
- `export let prop` → `let { prop } = $props()`
- `on:click` → `onclick`
- Slots → Snippets

### 3. Compatibility

- Svelte stores ยังใช้ได้ ไม่ deprecated
- สามารถ mix syntax ชั่วคราวระหว่าง migration

## Expected Outcome

- Project ผ่าน `svelte-check`
- Build สำเร็จ
- Syntax Svelte 5 ถูกต้อง
