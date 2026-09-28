---
name: review-ai-check-prompts
description: Check prompts — injection surface, structure, versioning, output contracts
argument-hint: "[scope]"
related:
  - review-ai
  - use-astgrep
  - report
---

## Goal

Run the prompts dimension of `/review-ai` แบบ focused — prompts ปลอดภัยจาก injection และ maintainable

## Scope

- ใช้เมื่อ `/review-ai` dispatch มาที่ `prompts`/`prompt` หรือเรียก standalone
- ครอบคลุม: prompt injection surface, structure/versioning, output contracts, prompt-in-code hygiene

## Execute

### 1. Prompt Checks

> Goal: prompts robust ต่อ injection และ drift

ทำตาม `../../references/prompts.md`

1. injection surface — user input interpolated ตรงๆ ใน system prompt, missing delimiters/instructions
2. structure — system/user/assistant separation ถูก, instructions ชัด, examples ไม่ขัดกัน
3. versioning — prompts อยู่ใน code เป็น template versioned ไม่ใช่ scattered strings
4. output contract — format/schema instruction ตรงกับ parser ฝั่งรับ

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Prompt/Location`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line ของ prompt template/call site
- unsanitized user input ใน system prompt = High; style issues = Low

## Expected Outcome

- Prompt findings แยก injection/structure/versioning/contract
- Injection points พร้อม input source → prompt location
