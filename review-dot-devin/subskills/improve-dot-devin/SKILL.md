---
name: review-dot-devin-improve-dot-devin
description: Apply .devin findings — structure, hooks, rules, AGENTS.md, sgconfig fixes
argument-hint: "[scope-or-findings]"
related:
  - review-dot-devin
  - update-dot-devin
  - check-reference
  - run-check
  - report-before-after
  - ask-me
---

## Goal

แก้ findings จาก `/review-dot-devin` จริง — `.devin/` structure/config/rules ถูกต้องและไม่ซ้ำซ้อน

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: directories, hooks.json + scripts, rules, AGENTS.md, sgconfig — harness-level changes เสี่ยง → confirm ทุก destructive action

## Execute

### 1. Baseline

> Goal: snapshot `.devin/` ก่อนแก้

1. inventory dirs/files + findings list จาก review
2. group findings: structure, hooks, rules, AGENTS.md, sgconfig
3. git checkpoint — `.devin/` ต้อง committed หรือ backup ก่อนแก้

### 2. Fix Structure + Hooks

> Goal: layout ตรง convention + hooks ทำงาน

ทำตาม `../../subagents/dot-devin-reviewer/directories.md` + `../../subagents/dot-devin-reviewer/hooks.md`

1. สร้าง subdirs ที่ขาด, ย้าย misplaced files
2. hooks — command paths มีจริง, try/catch + exit codes ถูก, ไม่มี loops

### 3. Fix Rules + AGENTS.md + sgconfig

> Goal: ไม่มี dupes/broken refs

ทำตาม `../../subagents/dot-devin-reviewer/rules-checklist.md`, `../../subagents/dot-devin-reviewer/agents-md.md`, `../../subagents/dot-devin-reviewer/sgconfig.md`, `../../subagents/dot-devin-reviewer/ast-grep-rules.md`

1. rules — merge duplicates (หลัง confirm), frontmatter ถูก, ไม่ stale
2. AGENTS.md — skill refs resolve, workspace coverage ครบ
3. sgconfig — `ruleDirs`, `languageAliases`, `devPaths` ครบ; rules parse ผ่าน

### 4. Verify

> Goal: harness ทำงาน + refs ไม่ขาด

1. `ast-grep scan` ผ่าน; hooks dry-run ไม่ error
2. `/check-reference` ไม่มี broken refs
3. `/run-check` + `/report-before-after` — findings หายครบ

## Rules

- destructive (ลบ rules/dirs/hooks) ต้อง user confirm + git checkpoint ก่อนเสมอ
- preserve intent — ห้าม rewrite rule semantics ระหว่าง cleanup
- hooks ที่ fail ต้อง non-blocking เว้นแต่ตั้งใจ
- แยก commit: structure → hooks → rules → config

## Expected Outcome

- `.devin/` structure ตรง convention, hooks ทำงาน, no stale refs
- Before/after findings พร้อม evidence
