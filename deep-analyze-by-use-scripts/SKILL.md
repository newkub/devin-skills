---
name: deep-analyze-by-use-scripts
description: Alias for deep-analyze — scripts-driven analysis merged into canonical skill
argument-hint: "[scope|report]"
related:
  - deep-analyze
  - use-scripts
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-analyze` แล้ว (merged from `deep-analyze-by-use-scripts`) — ใช้ `/deep-analyze` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill
การวิเคราะห์ด้วย scripts อยู่ใน `/deep-analyze` แล้ว (Step 1, Step 5, Rules ข้อ 7: `tools/review-codebase`, `tools/analyze`, `@ast-grep/napi`, knip, biome, madge, `ast-grep outline`, `eza --tree`)

## Execute

1. ทำ `/deep-analyze` ตามขอบเขตและ workflow เดิมทั้งหมด โดยใช้ `/use-scripts` เป็นวิธีหลักในการรวบรวม metrics

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/deep-analyze`
