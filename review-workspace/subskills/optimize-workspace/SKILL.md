---
name: review-workspace-optimize-workspace
description: Apply workspace findings — repo bloat, monorepo task graph, cache tuning
argument-hint: "[scope-or-findings]"
related:
  - review-workspace
  - check-monorepo
  - run-check
  - report-before-after
---

## Goal

แก้ workspace findings จาก `/review-workspace` จริง — repo ลีนและ monorepo tasks เร็วขึ้นแบบวัดได้

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: git repo bloat (history, large objects, gc, LFS) + monorepo task graph (affected-only, remote cache, pipeline tuning)
- history rewriting เป็น destructive — ต้อง user confirm เสมอ

## Execute

### 1. Baseline

> Goal: ตัวเลขก่อนแก้

ทำตาม `../../references/checklist.md` + `../../references/analyze-manifest.md`

1. repo size — `.git` size, largest objects (`git rev-list --objects --all | sort`), pack efficiency
2. task graph — build/test durations per package, cache hit rate, serial vs parallel
3. affected-only runs — รันอะไรที่ไม่จำเป็นบน PR

### 2. Fix Repo Bloat

> Goal: clone เร็วขึ้น repo สะอาดขึ้น

1. large objects → LFS migration หรือ gitignore (หลัง confirm — binary/media artifacts)
2. history bloat → `git filter-repo`/BFG เฉพาะเมื่อ user confirm explicitly — rewrite = force-push coordination
3. gc — `git gc --aggressive` / prune policies, shallow clone สำหรับ CI

### 3. Fix Task Graph

> Goal: CI/dev เสียเวลาน้อยลง

1. affected-only — `turbo`/`nx`/`moon` filters, `--since`/affected detection ใน CI
2. caching — remote cache config, inputs/outputs declarations ครบ (miss = misdeclared inputs)
3. parallelism — pipeline deps ถูก, ไม่ serial โดยไม่จำเป็น

### 4. Verify

> Goal: measured improvement

1. clone size + task durations เทียบ baseline
2. `/run-check` + tests ผ่าน — repo hygiene ไม่ break workspace
3. `/report-before-after` — sizes, timings, cache hit rate

## Rules

- history rewrite (filter-repo, LFS migrate) ต้อง explicit user confirm — destructive + coordination cost
- cache config changes ต้อง measurable — ห้าม optimize โดยไม่มี timing baseline
- preserve behavior — workspace restructure ไม่เปลี่ยน package APIs
- แยก commit: repo cleanup → cache/pipeline config

## Expected Outcome

- Repo size + task timings ดีขึ้นพร้อม numbers
- Cache hit rate + affected-only coverage เพิ่มขึ้นวัดได้
