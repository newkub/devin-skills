---
name: follow-lib-solidjs-migrate-solid-2
description: Migrate Solid 1.x → 2.0 — breaking changes, API surface check, incremental migration steps
argument-hint: "[scope]"
related:
  - follow-lib-solidjs
  - run-typecheck
  - run-test
  - resolve-errors
---

## Goal

Migrate Solid 1.x codebase → Solid 2.0 — detect usage ของ APIs ที่เปลี่ยน, apply breaking changes, verify

## Scope

major version upgrade — ทำเมื่อ project อยู่ `solid-js` 1.x และต้องการขึ้น 2.x; **เช็ค official migration guide ล่าสุดก่อนเสมอ** — v2 เป็น RC ระหว่างเขียน skill นี้ API เปลี่ยนได้

## Execute

### 1. Check Current State

```bash
bun pm ls solid-js            # หรือ npm ls solid-js
```

- `solid-js@^1.x` → migration path นี้; `@2.x`/`-rc` → ใช้ API ใหม่ได้เลย
- **Fetch official migration guide ก่อน**: https://docs.solidjs.com/ — RC stage = APIs ยังขยับ ต้องตรวจ source ล่าสุด ไม่เดาจาก skill

### 2. Audit API Usage

> Goal: inventory patterns ที่อาจเปลี่ยน

```bash
# grep hot spots
rg "createEffect|createMemo|createResource|createStore|produce|reconcile|createContext|lazy\(|Suspense|ErrorBoundary" src/ -l
```

- จัดกลุ่ม: signals/stores/resources/context/SSR/lifecycle — เทียบกับ breaking changes list จาก official guide
- Package deps ที่เกี่ยว: `@solidjs/router`, `@solidjs/meta`, `@solid-primitives/*`, `solid-start` — เช็ค compat version แต่ละตัว

### 3. Upgrade Incrementally

1. `bun add solid-js@<target>` — RC: pin exact version ไม่ใช้ caret
2. Upgrade ecosystem packages พร้อมกัน (router/meta/testing-library — peer deps ต้อง match)
3. Apply breaking changes ตาม guide — ทำทีละ primitive family, แก้ errors ทีละกลุ่ม
4. `bunx tsc --noEmit` หลังแต่ละ batch — type errors reveal API changes ที่ miss

### 4. Verify

1. `bunx tsc --noEmit` clean
2. `/run-test` — component + store tests ผ่านครบ
3. `/run-dev` — smoke critical routes; reactivity regressions (stale UI, missing updates)
4. fail → `/resolve-errors` max 3 รอบ → report remaining blockers

## Rules

- **RC version = pin exact** — ไม่ใช้ `^` บน prerelease
- Official migration guide = source of truth — skill นี้ให้ workflow เท่านั้น API details ดู docs
- Migrate per-family (signals → stores → resources → SSR) — อย่า upgrade ทีเดียวทั้ง codebase ใหญ่
- Ecosystem packages ต้อง upgrade พร้อมกัน — mixed major versions ชน peer deps

## Expected Outcome

- `solid-js` 2.x + ecosystem compat ติดตั้ง
- Breaking changes applied, typecheck + tests + dev server ผ่าน
