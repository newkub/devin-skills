# Layered Architecture Refactor

## Goal

Restructure target (default: app เดียวใน `apps/` หรือ single-app project) ให้เป็น Layered Architecture — presentation, domain, data ไม่ bypass — โดยรักษา behavior เดิม

## Canonical Sources (SSOT)

- Workflow: `/follow-layered-arch` — dispatch ผ่าน `/follow-architecture` เท่านั้น
- Pattern guide: `review-architecture/subagents/arch-reviewer/pattern-layered.md` (รวม variants + Nuxt-specific)
- File structure + layer table: `follow-layered-arch/templates/file-structure.md`

## Steps

1. ทำ `/follow-architecture` กับ target — เลือก layered pattern → dispatch `/follow-layered-arch` โดยอัตโนมัติ
2. ถ้าเจอ mixed concerns ระหว่างย้าย → ทำ `/separate-of-concerns` ก่อนจัด layer
3. หลังย้ายแต่ละชุด → ทำ `/update-references` + `/run-check`

## Rules

- ห้าม duplicate execute steps ที่นี่ — canonical อยู่ `/follow-layered-arch` เท่านั้น
- รักษา behavior เดิม — routes/pages ทำงานเหมือนก่อน restructure
