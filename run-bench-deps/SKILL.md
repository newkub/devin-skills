---
name: run-bench-deps
description: Benchmark/compare project dependencies — CLI table report (installed vs latest, bundle size, status, health) เพื่อตัดสินใจ upgrade/swap
argument-hint: "[scope] [--json] [--top N]"
related:
  - run-bench
  - update-version-to-latest
  - check-should-update
  - follow-improve
  - follow-optimize
  - report
---

## Goal

รายงาน dependencies ทั้งหมดของ project เป็น comparison table — เห็นภาพรวม installed vs latest, bundle cost, health/status และ alternatives ในคำสั่งเดียว เพื่อตัดสินใจ upgrade หรือ swap deps

## Scope

ใช้เมื่อต้อง bench/audit dependencies ของ project — report-only ไม่แก้ `package.json`; upgrade จริงทำผ่าน `/update-version-to-latest`, swap ทำผ่าน `/follow-improve`/`/follow-optimize`

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (bench-deps)

### 1. Collect Dependencies

> Goal: รวม unique deps ทั้ง monorepo

1. อ่าน root `package.json` + workspace manifests (`workspaces` globs) — รวม `dependencies`, `devDependencies`, `peerDependencies`
2. dedupe เป็น `name → { installed: version-spec, usedIn: [workspaces] }`
3. ถ้า `bun.lock`/`pnpm-lock.yaml` มีอยู่ → resolve installed version จริงจาก lockfile แทน spec range

### 2. Gather Metrics Per Dep

> Goal: metadata ครบต่อ dep

1. npm registry abbreviated packument (`Accept: application/vnd.npm.install-v1+json`) → `dist-tags.latest`, `time` (release dates), `deprecated`
2. downloads/week → `https://api.npmjs.org/downloads/point/last-week/{name}` (encode scoped names)
3. bundle size → `https://bundlephobia.com/api/size?package={name}@{version}` — best-effort, timeout หรือ error → `-`
4. derivations: `status` = `deprecated` > `unmaintained` (>2y since latest publish) > `prerelease` (latest เป็น pre-release tag) > `stable`; `outdated` = installed major < latest major; `minor/patch behind` ถ้าเท่า major แต่ต่ำกว่า latest

### 3. Render Table

> Goal: table เดียวอ่านรู้เรื่อง

| Column | Source | Note |
|---|---|---|
| `Package` | name | scoped แสดงเต็ม |
| `Installed` | lockfile/spec | เช่น `^4.17.21` |
| `Latest` | dist-tags | เช่น `4.21.0` |
| `Released` | time[latest] | relative (`3mo ago`) |
| `Status` | derived | `stable`/`beta`/`deprecated`/`unmaintained`/`outdated` |
| `Bundle` | bundlephobia | min+gzip KB; `-` ถ้าไม่ได้ |
| `DL/wk` | npm downloads | humanized (`1.2M`) |
| `License` | registry | `MIT`/`Apache-2.0` |
| `Used in` | workspaces | count หรือ `*` = root |

1. sort: `deprecated`/`unmaintained`/`outdated` ขึ้นก่อน แล้วตาม bundle size ใหญ่→เล็ก
2. `--json` → emit machine-readable array แทน table; `--top N` → เฉพาะ N rows แรก
3. summary line ท้าย table: total deps, outdated count, deprecated count, bundle total

### 4. Report

> Goal: findings ไปต่อได้

1. ทำ `/report` — table + highlights: deps ที่ deprecated/unmaintained, outdated majors, bundle hogs (top 5 ใหญ่สุด)
2. แนะนำ next action: `/update-version-to-latest` สำหรับ outdated, `/follow-improve` สำหรับ swap alternatives

## Rules

- Report-only — ห้ามแก้ `package.json`/lockfile ใน skill นี้
- Network calls ต้อง best-effort — registry/bundlephobia down → แสดง `-` แล้วทำต่อ ห้าม fail ทั้ง report
- จำกัด concurrency ≤10 ต่อ external API — ห้าม spam registry
- ใช้ `/update-version-to-latest` เมื่อต้อง upgrade จริง — skill นี้ report เท่านั้น
- ใช้ `scripts/bench-deps.ts` (bun) ถ้ามีอยู่ใน project หรือ skill นี้ — `bun run scripts/bench-deps.ts`

## Expected Outcome

- Comparison table ครบทุก dep พร้อม installed/latest/status/bundle/downloads
- Highlights ชัดเจน: deprecated, unmaintained, outdated majors, bundle hogs
- พร้อมตัดสินใจ upgrade/swap ต่อผ่าน `/update-version-to-latest` หรือ `/follow-improve`
