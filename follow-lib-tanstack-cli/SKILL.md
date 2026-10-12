---
name: follow-lib-tanstack-cli
description: ใช้ TanStack CLI — scaffold projects พร้อม add-ons (router, query, drizzle, auth)
argument-hint: "[template] [add-ons]"
related:
  - follow-lib-tanstack-ecosystem
  - run-dev
  - resolve-errors
---

## Goal

ใช้ TanStack CLI scaffold project ใหม่ — app starter พร้อม add-ons ที่เลือก (Start/Router-based)

## Scope

ใช้ตอนเริ่ม project ใหม่ที่อยากได้ TanStack stack ตั้งต้นครบ — ไม่ใช่เพิ่ม lib เข้า project เดิม (ใช้ `setup-*` workflows แทน)

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Scaffold

```bash
bunx @tanstack/cli create my-app
```

Options สำคัญ (ตรวจ `--help` ล่าสุด):

```bash
bunx @tanstack/cli create my-app --add-ons clerk,drizzle,tanstack-query
```

- Add-ons เช่น `tanstack-query`, `drizzle`, `clerk`, `tailwind`, `shadcn` — รายการปัจจุบันใน `bunx @tanstack/cli create --help`
- เลือก package manager, framework (React/Solid), toolchain ตาม prompts

### 2. Post-Scaffold

> Goal: project รันได้จริง

1. `cd my-app && bun install`
2. ตั้ง env ตาม add-ons ที่เลือก (`.env` keys ของ clerk/drizzle ฯลฯ)
3. `/run-dev` — ยืนยัน dev server ขึ้น
4. ตรวจ generated structure — route tree, config files

### 3. Verify

1. ทำ `/run-typecheck` + smoke test หน้าแรก
2. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- CLI คือ starting point — หลัง scaffold ปรับแต่งตาม `setup-*` workflows ต่อไป
- เลือก add-ons เฉพาะที่ใช้จริง — เพิ่มทีหลังได้ง่ายกว่าถอด
- Scaffold output อาจล้าหลัง patch releases — ตรวจ versions ใน `package.json` หลังสร้าง

## Expected Outcome

- Project ใหม่ scaffold สำเร็จพร้อม add-ons ที่เลือก
- Dev server รันได้ ไม่มี errors
