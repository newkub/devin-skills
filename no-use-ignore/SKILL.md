---
name: no-use-ignore
description: หาและลบ ignore comments (ts-ignore, eslint-disable, biome-ignore, noqa) โดยแก้ root cause
argument-hint: "[@files... | scope]"
related:
  - refactor
  - no-hard-code
  - deep-review
  - run-lint
  - run-typecheck
  - run-verify
  - use-astgrep
  - report-before-after
  - dont-over-engineer
---

## Goal

ลบ suppression comments (lint ignore, type ignore, coverage ignore) ออกจาก code — แก้ปัญหาที่ถูก suppress จริงๆ แทนการปิด rule — เหลือเฉพาะ suppression ที่ justified พร้อมเหตุผล

## Scope

- ถ้า user ระบุ `@files...` → เคลียร์เฉพาะไฟล์นั้น; ไม่ระบุ → scan scope ที่ให้มาหรือทั้ง project
- suppression ที่อยู่ใน config files (`.eslintignore`, `coveragePathIgnorePatterns`, `.gitignore` เพื่อ build outputs) → ไม่ใช่ scope นี้ — skill นี้จัดการ code-level suppression comments/annotations เท่านั้น
- security-scan ignores (`# nosec`, `#checkov:skip`, `#tfsec:ignore`) → escalate severity — suppressing security finding ต้องมี written justification + issue link เสมอ
- mechanical batch หลายไฟล์ → `/use-astgrep rewrite` (dry-run + confirm ก่อนเขียนทับเสมอ)

## Execute

### 1. Inventory Suppressions

> Goal: รู้ว่ามี suppression อะไรบ้าง ที่ไหน ของ tool ไหน

1. scan suppression comments/annotations ใน scope ตามตารางด้านล่าง — ใช้ `rg`/`ast-grep` patterns ต่อ ecosystem
2. จัดกลุ่มตาม tool + rule: `(file, line, tool, rule)` ต่อ suppression
3. จำแนก: `stale` (suppress อะไรที่ไม่มีอยู่แล้ว — unused directives), `blanket` (file-level หรือไม่ระบุ rule), `lazy` (ระบุ rule แต่ไม่มีเหตุผล), `justified` (rule + reason comment + narrowest scope)

| Ecosystem | Suppression Syntax |
|-----------|-------------------|
| TypeScript | `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `@ts-check` (บน file ที่ไม่ตั้งใจ) |
| ESLint | `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line`, `eslint-enable`, `/* eslint ... */` overrides |
| Biome | `biome-ignore lint/...`, `biome-ignore format`, `biome-ignore assist` |
| Prettier / formatters | `prettier-ignore`, `# fmt: off`/`on` (black/ruff), `// swiftformat:disable`, `// clang-format off` |
| Python | `# noqa`, `# type: ignore`, `# pylint: disable`, `# pragma: no cover`, `# nosec` |
| Go | `//nolint`, `//lint:ignore`, `// #nosec`, `//go:noinline` misuse |
| Rust | `#[allow(...)]`, `#![allow(...)]` crate-level, `#[allow(clippy::...)]` |
| Java / Kotlin | `@SuppressWarnings`, `@Suppress`, `@kotlin.Suppress` |
| C# / C++ | `#pragma warning disable`, `[SuppressMessage]`, `// NOLINT`, `// NOLINTNEXTLINE`, `#pragma GCC diagnostic ignored` |
| Swift | `// swiftlint:disable`, `// swiftlint:disable:next` |
| Dart | `// ignore: rule`, `// ignore_for_file:` |
| Ruby | `# rubocop:disable`, `# rubocop:todo` |
| Shell | `# shellcheck disable=SC...` |
| PHP | `@phpcs:ignore`, `phpcs:disable`, `@phpstan-ignore`, `@psalm-suppress` |
| CSS / HTML | `/* stylelint-disable */`, `<!-- markdownlint-disable -->`, `<!-- prettier-ignore -->` |
| Coverage | `/* istanbul ignore */`, `# pragma: no cover`, `// coverage:ignore`, `.coveragerc` exclusions |
| Infra scanners | `# hadolint ignore=DL`, `#checkov:skip=`, `#tfsec:ignore:`, `# kics-scan ignore` |

### 2. Classify Each Suppression

> Goal: แยกของที่ต้องแก้ vs ของที่เก็บได้

1. `stale` — ลบทิ้งเลย (directive ที่ไม่ suppress อะไร — เช่น `eslint-disable` บน code ที่ผ่าน rule อยู่แล้ว; tools: `eslint --report-unused-disable-directives`, biome `--diagnostic-level=error` reports unused suppressions)
2. `blanket` — file-level disables (`@ts-nocheck`, `eslint-disable` ไม่มี rule, `ignore_for_file`, `#![allow]`) → split เป็น per-line suppressions ชั่วคราวเพื่อเห็น surface จริง แล้วแก้ทีละจุด
3. `lazy` — มี rule แต่ไม่มีเหตุผล → แก้ root cause (Step 3)
4. `justified` — เก็บไว้แต่ enforce format: narrowest scope + named rule + reason comment (`// eslint-disable-next-line no-console — intentional CLI output`) + link issue ถ้าเป็น workaround ชั่วคราว

### 3. Fix Root Cause

> Goal: แก้ปัญหาที่ suppress จริง ไม่ใช่ลบ comment แล้วปล่อย lint/typecheck พัง

| Suppressed อะไร | Fix จริง |
|-----------------|----------|
| type error (`@ts-ignore`, `# type: ignore`) | แก้ types — proper types, narrowing, guards; cast เมื่อจำเป็นจริง (`as` + comment); generated/external code → `.d.ts` หรือ `skipLibCheck` scope |
| lint rule violation | แก้ code ตาม rule — restructure logic, rename, split function; ถ้า rule ผิดพลาดทั้ง codebase → ปรับ config ที่ root (`follow-config`) ไม่ใช่ suppress ทีละไฟล์ |
| format suppression (`prettier-ignore`, `fmt: off`) | ลบ suppression แล้ว format — ถ้า code จงใจ layout เอง (ASCII art, aligned tables) → justified พร้อม reason |
| security suppression (`# nosec`, `checkov:skip`) | แก้ root cause เสมอ — ไม่มี justified case โดยไม่มี written exception + expiry; escalate `/check-secrets` ถ้า suppress เพื่อซ่อน secret |
| coverage suppression (`no cover`, `istanbul ignore`) | เขียน test แทน (`/update-tests`); เก็บได้เฉพาะ defensive branches ที่ unreachable จริง (`assert_never`, platform guards) พร้อม comment |
| allow/expect ใน Rust/C | แก้ lint ที่ trigger — clippy suggestion ส่วนใหญ่แก้ได้ตรง; `#[allow]` ที่ block-level ดีกว่า item-level, item-level ดีกว่า crate-level |

### 4. Enforce Going Forward

> Goal: suppression ไม่กลับมาโดยไม่มีเหตุผล

1. enable unused-directive reporting ใน tool config — `reportUnusedDisableDirectives` (eslint ≥9 default), biome `linter` diagnostics, `#![warn(unused_attributes)]`
2. lint rule/CI check — fail บน suppression ที่ไม่มี reason comment (eslint `eslint-plugin-eslint-comments`/`@eslint-community/eslint-comments` `require-description`; biome nursery `noSuppressionWithoutReason` ถ้ามี; custom `rg` gate เช่น `rg -l '(ts-ignore|eslint-disable|noqa|nolint)(?!\s*-\s*\w)'`)
3. config-level exceptions ย้ายไปที่ root config (`.eslintrc` overrides, `biome.json` overrides) — ชัดกว่า comment กระจาย
4. สำหรับ generated/vendor files → exclude ที่ tool config ไม่ใช่ suppression ใน file

### 5. Verify

> Goal: suppressions หายจริงและ code ยังผ่าน

1. re-scan scope — count suppressions ก่อน/หลัง (`stale`/`lazy`/`blanket` → 0, `justified` เหลือพร้อม reason)
2. ทำ `/run-lint` + `/run-typecheck` — ไม่มี errors ใหม่หลังลบ suppression
3. ทำ `/run-verify` — tests ผ่าน behavior ไม่เปลี่ยน (suppression เป็น no-op ทาง runtime แต่ fix ข้างในเปลี่ยน code)
4. `/report-before-after` — count per category: stale removed, lazy fixed, justified kept (with reasons), config-exceptions moved

## Rules

### 1. Fix, Don't Silence

- ลบ suppression แล้วปล่อย lint/typecheck พัง = fail — ทุก suppression ที่ลบต้องแก้ underlying issue หรือ move ไป config override ที่เหมาะกว่า
- ห้ามแทน `@ts-ignore` ด้วย `any` cast เพื่อหลบ — นั่นคือ suppression รูปแบบอื่น (แก้ types จริง)

### 2. Justified Suppression Format

- suppression ที่เหลือต้องมี: named rule (ห้าม blanket disable), narrowest scope (`next-line` > block > file > crate), reason comment ภาษาอังกฤษบนบรรทัดเดียวกันหรือเหนือ, issue/ticket link ถ้าเป็น workaround
- security suppressions ต้องมี documented exception + expiry — ไม่มี exception → แก้ root cause เสมอ

### 3. Generated And Vendor Code

- generated code, vendored code, minified bundles → exclude ที่ tool config ไม่ใช่ suppress ใน file (files ถูก regenerate แล้ว suppression หายอยู่ดี)

### 4. Preserve Behavior

- suppression removal ต้องไม่เปลี่ยน runtime behavior — fix ข้างในต้องผ่าน tests เดิม
- ไม่ mix กับ feature work — commit แยกตาม category (stale → fixes → config moves)

### 5. Don't Over-Police

- suppression ที่ justified ดีอยู่แล้ว (named rule + reason + scope แคบ) → เก็บไว้ ไม่ต้อง "fix" (`/dont-over-engineer`)
- test files มี leniency มากกว่า — `@ts-expect-error` ใน negative tests คือ feature ไม่ใช่ suppression

- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /run-lint ถ้าจำเป็น
- ใช้ /run-typecheck ถ้าจำเป็น

## Expected Outcome

- stale/blanket/lazy suppressions เหลือ 0 — เหลือเฉพาะ justified พร้อม named rule + reason + narrowest scope
- security suppressions ทุกตัวมี documented exception หรือถูกแก้ root cause
- config บังคับ: unused-directive reporting + reason-required gate
- ผ่าน lint/typecheck/test/build — behavior เดิม
