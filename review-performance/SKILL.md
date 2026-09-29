---
name: review-performance
description: Review application performance ครอบคลุม network, build, runtime, memory, I/O, database, caching
argument-hint: "[scope]"
related:
  - review-frontend
  - follow-tool-lighthouse
  - review-code-quality
  - run-profiler
  - run-bench
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - suggest-next-action
  - use-astgrep
  - review-dependencies
  - use-subagents

---

## Goal

Review application performance ครอบคลุม network, build/runtime, memory, I/O, database, caching และ algorithmic complexity พร้อม severity ratings และ review score — domain checklist อยู่ใน `subagents/perf-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้สำหรับ review performance บน critical paths ครอบคลุม:

| Dimension | Checklist |
|-----------|-----------|
| `network` — DNS, latency, payload, cache headers, HTTP/2, CDN | `subagents/perf-reviewer/network-and-api.md` |
| `bundler` — chunk splitting, tree shaking, minification | `subagents/perf-reviewer/bundler-and-build.md` |
| `runtime` — CPU hot paths, event loop, async | `subagents/perf-reviewer/runtime-and-cpu.md` |
| `memory` — heap, GC, leaks, streaming | `subagents/perf-reviewer/memory.md` |
| `io` — file, database, network I/O, batching | `subagents/perf-reviewer/io-and-database.md` |
| `caching` — invalidation, TTL, stampede | `subagents/perf-reviewer/caching.md` |
| `database` — N+1, indexes, query optimization | `subagents/perf-reviewer/io-and-database.md` |
| `complexity` — Big O, data structures | `subagents/perf-reviewer/time-complexity.md` |
| `profiling` — flamegraphs, hotspot detection | `subagents/perf-reviewer/performance-profile.md` |

ไม่รวม security หรือ stability (ใช้ `/review-security` และ `/review-stability`)

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ project structure, tech stack และเก็บ baseline

1. ทำตาม `subagents/perf-reviewer/prepare.md` — stack, entry points, critical paths
2. ทำ `/run-review` + `/deep-analyze` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)
3. เก็บ perf baseline: `/run-bench` หรือ `/run-profiler` บน critical paths ถ้ามี

### 2. Dispatch Perf-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ตาม skip conditions ใน Rules)
2. Spawn `subagents/perf-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. Validate score ตาม `subagents/perf-reviewer/validate-score-and-report.md` + `scoring.md`
3. ถ้าพบ security/stability issues → ระบุเป็น info เท่านั้น

### 4. Report

> Goal: รายงานครบทุก dimension พร้อม next actions

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/report-before-after` ถ้ามี baseline; ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งานเฉพาะรูปแบบ — report subskill format findings, optimize subskill fix เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `vitals`, `report-vitals` — LCP/INP/CLS + metrics เทียบ thresholds | `subskills/report-vitals/SKILL.md` |
| Apply performance findings — bundle, runtime, memory, I/O fixes by severity | `subskills/optimize-performance/SKILL.md` |

## Rules

### 1. Scope Boundary

- เน้น performance บน critical paths; ไม่ซ้ำ `/review-security` หรือ `/review-stability`
- รายละเอียด rendering performance อยู่ใน `/review-frontend`
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/perf-reviewer/` เท่านั้น

### 2. Skip Conditions

| Condition | Skip Dimension |
|-----------|----------------|
| ไม่มี build step | `bundler` |
| ไม่มี caching | `caching` |
| ไม่มี network layer | `network` |
| ไม่มี database | `io`/`database` |
| ไม่มี frontend | runtime ที่เกี่ยวกับ render |

### 3. Severity Classification

| Severity | ลักษณะ |
|---|---|
| Critical | blocking bottleneck, bundle size รุนแรง, broken build config, CWV ไม่ผ่าน, cache poisoning/stampede, complexity เกิน budget 10x บน hot path |
| High | N+1 query, missing cache บน hot path, missing code splitting, large vendor chunk, missing TTL |
| Medium | suboptimal query/chunk, missing lazy load, complexity เกิน budget บน cold path |
| Low | minor optimization, complexity ใกล้ budget |

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, และ function/query/config ที่เกี่ยวข้อง
- ใช้ profiling data/measurements ประกอบ; ไม่ optimize ก่อนมี evidence

### 5. Formatting

- ห้ามใช้ `**` — backticks สำหรับ emphasis; รายงานเป็นตารางด้วย `/report`; symbols: ผ่าน, ไม่ผ่าน, warning

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ; ห้าม TODO, MOCK, placeholder

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. profile ก่อนแก้: `/run-bench`/profiler baseline — แก้เฉพาะ bottleneck ที่วัดได้
2. hot paths: memoize, complexity ลด, async/batch sync work
3. memory: allocations ลด, leaks fixed, unbounded growth → bounds
4. web vitals: LCP/INP/CLS — LCP image preload, third-party defer, layout stability
5. verify: benchmark before/after + tests ผ่าน — ห้ามเปลี่ยน correctness

## Expected Outcome

- รายงาน performance findings ครอบคลุมทุก dimension — review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน; ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`; ถ้าต้อง optimize ให้ทำ section `## Fix`
