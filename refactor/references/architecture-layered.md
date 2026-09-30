# Layered Architecture Refactor

## Goal

Restructure target (default: app เดียวใน `apps/` หรือ single-app project) ให้เป็น Layered Architecture — flat type-grouped folders, presentation → domain → data ไม่ bypass — โดยรักษา behavior เดิม

## Canonical Sources (SSOT)

- Workflow: `/follow-architecture` `### Pattern: Layered` (merged จาก `/follow-layered-arch` เดิม) — dispatch ผ่าน `/follow-architecture` เท่านั้น
- Pattern guide: `deep-review` `references/pattern-layered.md`
- File structure + layer table: `follow-architecture/templates/file-structure-layered.md`

## Steps

1. ทำ `/follow-architecture` กับ target — เลือก layered pattern → ทำตาม `### Pattern: Layered` โดยอัตโนมัติ
2. ถ้าเจอ mixed concerns ระหว่างย้าย → ทำ `/separate-of-concerns` ก่อนจัด layer
3. หลังย้ายแต่ละชุด → ทำ `/update-references` + `/run-check`

## Rules

- ห้าม duplicate execute steps ที่นี่ — canonical อยู่ `/follow-architecture` เท่านั้น
- รักษา behavior เดิม — routes/pages ทำงานเหมือนก่อน restructure
