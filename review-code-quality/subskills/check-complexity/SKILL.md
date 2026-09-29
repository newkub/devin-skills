---
name: review-code-quality-check-complexity
description: Check complexity — long functions, nesting, cyclomatic, duplication, hotspots
argument-hint: "[scope]"
related:
  - review-code-quality
  - check-long-files
  - review-code-quality
  - use-astgrep
  - report
---

## Goal

Run the complexity dimension of `/review-code-quality` แบบ focused — หา code ที่ maintain ยากด้วย metrics ไม่ใช่ความรู้สึก

## Scope

- ใช้เมื่อ `/review-code-quality` dispatch มาที่ `complexity` หรือเรียก standalone
- ครอบคลุม: function length, nesting depth, cyclomatic/cognitive complexity, duplication, churn×complexity hotspots

## Execute

### 1. Complexity Scan

> Goal: hotspots พร้อม numbers — parent Execute §6

ทำตาม `../../references/time-complexity.md` + `../../references/code-quality.md`

1. long functions/files — thresholds ตาม convention (`/check-long-files`, `/review-code-quality`)
2. nesting/cyclomatic — deep branches, guard-clause opportunities
3. duplication — copy-paste blocks ที่ drift กัน (`/use-astgrep` patterns)
4. hotspots — files ที่เปลี่ยนบ่อย + complex (git churn × complexity)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `File/Function`, `Metric`, `Value`, `Severity`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `/refactor`
- ทุก finding มี measured value — ห้าม flag โดยไม่มี metric
- hotspot (churn × complexity) > complexity เดี่ยวๆ — จัดลำดับตาม impact

## Expected Outcome

- Complexity hotspots พร้อม metrics (length/nesting/cc)
- Prioritized refactor candidates พร้อม fix direction
