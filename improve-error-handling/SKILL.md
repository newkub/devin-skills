---
name: improve-error-handling
description: หา error handling improvements — error paths, retries, recovery, error UI — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-code-quality
  - improve-uxui
  - improve-api
  - improve-cli
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "error handling improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-stability` (scope error handling) + `review-code-quality` + error UI/API/CLI surfaces เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "error handling ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-stability` (error-handling scope) — missing try/catch boundaries, swallowed errors, missing retries/timeouts, unhandled rejections, crash paths
- `review-code-quality` (error-handling scope) — error types/taxonomy, error messages quality, error propagation consistency, logging on failure
- `review-frontend` (error-UI scope) — missing error boundaries/fallback UI, unhandled async error states, error toast/dialog handling — เฉพาะ workspace ที่มี UI code
- `review-uxui` (error-state scope) — user-facing error messages, recovery guidance, error/empty state design — เฉพาะ workspace ที่มี UI
- `review-api` (error-response scope) — consistent error payload shape, status codes, machine-readable error codes — เฉพาะ workspace ที่ expose API
- `review-cli` (error-output scope) — exit codes, stderr messages, actionable fix hints — เฉพาะ workspace ที่มี CLI
- stability/reliability กว้างกว่า error handling → `/improve-stability` แทน

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ตรวจ workspace type (มี UI code / expose API / มี CLI) เพื่อเลือก domain surfaces ที่จะรวม
3. ทำ `/deep-review` กับ scope นั้น domains `review-stability` + `review-code-quality` (scope error handling) เพิ่ม `review-frontend` + `review-uxui` (scope error UI) เมื่อ workspace มี UI, `review-api` (scope error responses) เมื่อ expose API, `review-cli` (scope error output) เมื่อมี CLI
4. รวบรวม prioritized list พร้อม severity และ evidence — แยกกลุ่ม core logic / error UI / API / CLI

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง — stability/code-quality → Domain Map เดิม, frontend/uxui → `/improve-uxui` หรือ `## Fix` ของ review-frontend, api → `/improve-api`, cli → `## Fix` ของ review-cli)
2. ทุก error-path fix ต้องมี failure-mode test — ห้ามแก้ error handling แบบไม่มี coverage ทดสอบ
3. ทุก error-UI fix ต้อง render ได้จริงใน state: error, loading, empty — ตรวจผ่าน `/test-component` หรือ `/test-website` ไม่ใช่แค่ compile ผ่าน
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- รวม domain error UI/API/CLI เฉพาะเมื่อ workspace มี surface นั้น — ห้าม dispatch domain ที่ไม่มี code ให้ review
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม swallow errors หรือแก้โดยการ catch-then-ignore
- ห้ามแก้ error UI ด้วยการซ่อน error (silenced toast, fallback เงียบ) — user ต้องเห็นสาเหตุและทางแก้เสมอ
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized error-handling improvement list จาก `/deep-review` — ครอบคลุมทั้ง core error paths, error UI, API error responses, CLI error output (ตาม surface ที่มีจริง)
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม failure-mode tests และ error UI render ได้จริงใน error/loading/empty states
