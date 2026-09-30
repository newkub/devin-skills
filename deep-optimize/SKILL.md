---
name: deep-optimize
description: Review ทุก dimension หา optimization opportunities ด้วย subagents ขนาน + prioritized plan
argument-hint: "[path-or-target] [--diff] [--apply]"
related:
  - deep-review
  - use-subagents
  - follow-parallel
  - deep-analyze
  - implement-to-production
  - report
  - suggest-next-action

---

## Goal

Review ทุกมิติของ codebase เพื่อหา optimization opportunities ด้วย `/use-subagents` ขนาน — performance, bundle, database, algorithm, dependencies, architecture, build, cost — แล้วรวมเป็น prioritized optimization plan พร้อม evidence

## Scope

ใช้เมื่อต้องการ optimize แบบครอบคลุมหลายมิติพร้อมกัน — report-only โดย default; `--apply` ค่อย fix ตาม plan หลัง user confirm

- เทียบกับ skills ใกล้เคียง: `/deep-review` = review ความถูกต้อง/standard/report; `/deep-optimize` = เจาะ bottleneck เฉพาะจุด; `deep-optimize` = fan-out ทุก dimension ด้วย subagents แล้วรวม plan เป็น prioritized actions
- `/ship-to-dev-branch` เรียก skill นี้ใน Validate step ก่อน merge/release เสมอ

## Execute

### 1. Scope And Slice

> Goal: แบ่ง target เป็น dimension slices ที่ review อิสระกันได้

1. รับ `[path-or-target]` — ไม่ระบุ = full repo; `--diff` = เฉพาะไฟล์ใน `git diff`
2. ทำ `/scan-codebase` ระบุ hot paths, build outputs, manifests, data layer, UI layer
3. แบ่งเป็น dimension lanes (file ownership ไม่ซ้ำกัน):

| Lane | Dimension | ตรวจอะไร |
|------|-----------|---------|
| 1 | `runtime` | hot paths, sync I/O, unnecessary awaits, re-renders, N+1 |
| 2 | `bundle` | bundle size, tree-shaking, chunks, static assets, sourcemaps |
| 3 | `data` | queries, indexes, caching, pagination, serialization |
| 4 | `algorithm` | time/space complexity บน critical paths |
| 5 | `deps` | heavy/unused deps, polyfill bloat, update opportunities |
| 6 | `architecture` | layering waste, redundant abstractions, circular deps |
| 7 | `build` | build time, cache config, CI pipeline efficiency |
| 8 | `cost` | compute, storage, idle resources, token spend (ถ้ามี AI) |

4. lanes ที่ N/A ชัดเจน (ไม่มี UI → ข้าม re-render checks) → mark `skipped` พร้อมเหตุ ห้ามข้ามเงียบๆ

### 2. Dispatch Subagents

> Goal: review ครบทุก dimension พร้อมกัน

1. ทำ `/use-subagents` spawn optimize-review subagent ต่อ lane ที่ relevant — ≤10 ต่อ batch ตาม `/follow-parallel`
2. แต่ละ subagent รับ: `workspace-path`, `lane`, `file-ownership` — output contract: findings table (`No.`, `Finding`, `Impact`, `Effort`, `Evidence`, `Fix`) + lane score
3. subagent อ่านเฉพาะไฟล์ใน ownership — ห้าม sweep ทั้ง codebase, ห้ามแก้ code (report-only)
4. lane ที่มี findings ≤ 2 → parent วิเคราะห์เอง
5. subagent fail → mark `failed` และเขียน lane นั้นใน report เป็น `review-failed` — ห้ามเงียบ

### 3. Aggregate And Prioritize

> Goal: plan เดียวจัดลำดับตาม impact

1. รวม findings ทุก lane — dedup ตาม `file + root-cause`
2. จัด priority ตาม `impact × blast-radius`: P0 quick-wins ที่ impact สูงก่อนเสมอ
3. เรียง execution: Foundation → Dependencies → High impact → Critical path → High risk
4. ทุก item ระบุ expected gain (เช่น bundle -X kb, query -Y ms) เท่าที่ประเมินได้ + effort คร่าวๆ

### 4. Report (And Optional Apply)

> Goal: plan พร้อม execute เมื่อ confirm

1. ทำ `/report` — `## Optimization Plan`: ตาราง `No.`, `Lane`, `Finding`, `Impact`, `Effort`, `Priority`, `Evidence`, `Owner`
2. persist → `.devin/temp/report/<workspace>/deep-optimize-<time>.md` ตาม `/create-report-in-dot-devin` (ถ้ามี)
3. `--apply` + user confirm → apply fixes ตามลำดับ plan ผ่าน `/implement-to-production` ทีละ item พร้อม verify ทุกรอบ
4. ทำ `/suggest-next-action`

## Rules

- report-only โดย default — fix เฉพาะเมื่อ `--apply` และ user confirm
- ทุก finding ต้องมี evidence (file:line, metric, หรือ measurement) — ห้ามเดา bottleneck จาก intuition
- measurement ก่อนเสนอ optimization ที่ซับซ้อน — micro-optimization ที่ไม่มี evidence → ไม่เสนอ
- ไม่เสนอการเปลี่ยน architecture ใหญ่โดยไม่มี expected gain ชัดเจน
- preserved behavior: optimization ต้องไม่เปลี่ยน output/public API (ยกเว้น performance fixes ที่จงใจ)
- ใช้ /deep-optimize ถ้าจำเป็น (deep-dive lane เดียว)
- ใช้ /deep-analyze ถ้าจำเป็น (root cause ไม่ชัด)
- ใช้ /deep-review ถ้าจำเป็น (ครบทุก review-* ไม่ใช่แค่ optimization)

## Expected Outcome

- Optimization plan ครบทุก dimension พร้อม evidence และ priority
- Quick wins ถูกแยกจาก strategic optimizations
- lanes ที่ skipped/failed ถูกระบุพร้อมเหตุ — coverage ตรวจสอบได้
