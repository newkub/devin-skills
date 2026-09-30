# Clean Architecture Refactor

## Goal

Restructure target (default: ทุก package ใน `packages/` หรือ `crates/` หรือหลาย `apps/*` ที่ต้อง unified support) ให้เป็น Clean Architecture — โดยรักษา behavior และ public API เดิม

## Canonical Sources (SSOT)

- Workflow: `/follow-clean-arch` — dispatch ผ่าน `/follow-architecture` เท่านั้น
- Pattern guide: `review-architecture/subagents/arch-reviewer/pattern-clean.md`
- File structure + layer table: `follow-clean-arch/templates/file-structure.md`

## Steps

1. ทำ `/follow-architecture` กับ target — เลือก clean pattern → dispatch `/follow-clean-arch` โดยอัตโนมัติ
2. ถ้าเจอ mixed concerns ระหว่างย้าย → ทำ `/separate-of-concerns` ก่อนจัด layer
3. หลังย้ายแต่ละชุด → ทำ `/update-references` + `/run-check`

## Rules

- ห้าม duplicate execute steps ที่นี่ — canonical อยู่ `/follow-clean-arch` เท่านั้น
- รักษา behavior เดิม — ทดสอบต้องผ่านเหมือนก่อน restructure
