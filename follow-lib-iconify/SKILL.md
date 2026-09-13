---
name: follow-lib-iconify
description: ใช้ @iconify-json/* icon sets — Iconify API, offline bundles, on-demand loading
argument-hint: "[target-or-scope]"
related:
  - follow-lib-unocss
  - run-verify
  - run-test
---

## Goal

ใช้ @iconify-json/* icon sets — Iconify API, offline bundles, on-demand loading

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ Iconify — icon components, `@iconify-json/*` offline data, on-demand loading (lib iconify)

- ใช้ skill นี้สำหรับเลือก/ติดตั้ง icon components และ icon data — integration เชิงลึกกับ UnoCSS `presetIcons` ให้ทำ `/follow-lib-unocss` แทน
- Tailwind v3 ใช้ `@iconify/tailwind`; Tailwind v4 ใช้ `@iconify/tailwind4`
- Optimize bundle (offline bundles, subsetting, lazy loading) → `subskills/optimize-icons/SKILL.md`
- ถ้า project ใช้ icons น้อยมากและไม่ต้องการ dependency → พิจารณา inline SVG แทน

- Latest: `@iconify/react@6.0.2` / `@iconify/vue@5.0.1` / `iconify-icon@3.0.2` (web component) / `@iconify/tailwind@1.2.0` / `@iconify/tailwind4@1.2.3` (verified 2026-09-13)
- References: [apis](references/apis.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-iconify/SKILL.md` — install + usage patterns ตาม framework |
| Optimize | `subskills/optimize-icons/SKILL.md` — offline bundles, on-demand loading, subsetting |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `@iconify-json/<set>` (เช่น mdi, lucide) กับ UnoCSS `presetIcons`, Tailwind `@iconify/tailwind` plugin หรือ icon component
1. ใช้ component ตาม framework: `@iconify/react`, `@iconify/vue`, `@iconify/svelte` หรือ `iconify-icon` web component สำหรับ framework-agnostic
1. เลือก icon set ตาม design: mdi (material), lucide (minimal), tabler
1. ใช้ on-demand loading — bundle เฉพาะ icons ที่ใช้จริง; ใช้ `@iconify/utils` เมื่อต้อง generate icon data เอง
1. สำหรับ custom icons ใช้ `customizations` หรือ inline SVG แทน

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib iconify)

## Rules

- อย่า import ทั้ง icon set — ใช้ per-icon เสมอ
- ตั้ง `size`/`color` ผ่าน props/class ไม่ hardcode ใน SVG
- ใช้ iconify API runtime เฉพาะ dynamic icons — static icons bundle ไว้เลย

- ใช้ `/follow-lib-unocss` ถ้าต้อง config UnoCSS `presetIcons` เชิงลึก
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib iconify)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib iconify)
- Lint, typecheck, tests ผ่าน
