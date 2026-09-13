---
name: follow-tool-devin
description: Devin/Cascade AI coding assistant สำหรับ autonomous software engineering
argument-hint: "[scope]"
related:
  - follow-create-plugins
  - update-devin
  - follow-devin-global-skills
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
  - deep-review
  - run-verify
---

## Goal

ใช้ skill นี้เพื่อเข้าใจและใช้งาน Devin/Cascade AI coding assistant สำหรับ autonomous software development, code generation, debugging, และ testing

## Scope

ใช้สำหรับ:
- ใช้งาน Devin Desktop และ Cascade ใน Windsurf IDE
- เข้าใจ AI models (SWE-2, SWE-1.7, SWE-1.6, SWE-1-mini, swe-grep, swe-check)
- ใช้งาน Spaces และ Agent Client Protocol (ACP)
- เขียน prompts ที่มีประสิทธิภาพสำหรับ coding agents
- Debug และ review code ที่ agents สร้าง
- จัดการ fleets ของ local และ cloud agents

- Boundary: skill นี้ครอบคลุมการใช้งาน Devin/Cascade ฝั่ง user — สำหรับอัปเดต Devin CLI/skills ของเครื่องใช้ `/update-devin`; สำหรับกฎและ conventions ของ global skills ดู `/follow-devin-global-skills`
- Latest model: `SWE-2` (released 2026-09-10, post-trained จาก Kimi K3 2.8T params) (verified 2026-09-13)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Verify Installation

> Goal: Devin CLI พร้อมใช้งานบนเครื่อง

1. รัน `devin --version` เพื่อตรวจสอบว่า CLI ติดตั้งแล้ว (ติดตั้งผ่าน Devin Desktop / Cognition distribution — ไม่มี public registry)
2. รัน `devin --help` เพื่อดู command surface ที่ version ปัจจุบันรองรับ
3. ถ้าไม่มี → ติดตั้งจาก https://devin.ai — npm package `devin` เป็น package อื่นที่ไม่เกี่ยวข้อง ห้าม install
4. สำหรับอัปเดต CLI/skills ให้ใช้ `/update-devin`

### 2. Start Session

> Goal: เปิด session บน project/branch ที่ถูกต้อง

1. รัน `devin` เพื่อเริ่ม interactive session — ระบุ `--project`, `--branch`, `--issue` ตาม context ของ task
2. ใช้ Spaces (shared context + Git worktrees) เมื่อต้องรัน agents หลายตัวพร้อมกัน
3. ใช้ Agent Client Protocol (ACP) เมื่อต้อง integrate กับ editor/agent อื่น

### 3. Select Model

> Goal: เลือก model ให้เหมาะกับ task

1. เลือกจาก Rules → Model Selection: `SWE-2` เป็น default สำหรับ coding tasks, `SWE-1-mini` สำหรับ autocomplete, `swe-grep`/`swe-check` สำหรับ retrieval และ quick review
2. ใช้ `SWE-1.7 Lightning` เมื่อต้องการ latency ต่ำโดยไม่เสีย intelligence

### 4. Write Effective Prompts

> Goal: prompt ชัดเจนและแบ่งงานได้

1. เขียน prompt เฉพาะเจาะจงพร้อม context, requirements และ constraints
2. แบ่ง task ซับซ้อนเป็น sub-tasks ที่ agents ทำทีละชิ้น
3. แนบ examples/code snippets เมื่อต้องการ output format เฉพาะ

### 5. Review And Verify Output

> Goal: code จาก agents ปลอดภัยและทำงานจริง

1. Review diff ที่ agents สร้าง — ใช้ `/deep-review` สำหรับการเปลี่ยนแปลงใหญ่
2. ใช้ `swe-check` สำหรับ quick review ระหว่างทำงาน
3. ทำ `/run-verify` (lint, typecheck, tests) ก่อน accept
4. ตรวจ security issues และ secrets ก่อน deploy

## Rules

### 1. Model Selection

- เลือก model ตาม task:
  - `SWE-2`: Flagship ล่าสุด — frontier-level coding, cost-efficient (multi-effort reasoning)
  - `SWE-1.7`: Previous flagship, software engineering agents
  - `SWE-1.7 Lightning`: SWE-1.7 บน Cerebras — latency ต่ำกว่า intelligence เท่ากัน
  - `SWE-1.6` / `SWE-1.6 Fast`: Generation ก่อนหน้า — general / speed priority
  - `SWE-1-mini`: Real-time autocomplete (Tab), low latency
  - `swe-grep`: Context retrieval และ Fast Context
  - `swe-check`: Quick Review — lightweight code review

### 2. Prompt Engineering

- เขียน prompts ที่ชัดเจนและเฉพาะเจาะจง
- ระบุ context และ requirements อย่างละเอียด
- ใช้ examples และ code snippets เมื่อจำเป็น
- แบ่ง tasks ที่ซับซ้อนเป็น sub-tasks

### 3. Code Review

- Review code จาก agents อย่างใกล้ชิด
- Test code ก่อน deploy
- Check security vulnerabilities
- Verify performance แล scalability

### 4. Security

- ไม่ใส่ sensitive data ใน prompts
- Review code สำหรับ security issues
- ใช้ environment variables สำหรับ secrets
- Follow security best practices

- ใช้ /follow-create-plugins (devin) ถ้าจำเป็น
- ใช้ /update-devin-global-subagents ถ้าจำเป็น
- ใช้ /follow-devin-global-skills ถ้าจำเป็น
- ใช้ /follow-tool-usage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น

## Expected Outcome

- เข้าใจและใช้งาน Devin/Cascade ได้อย่างมีประสิทธิภาพ
- เขียน prompts ที่ทำให้ agents ทำงานได้ดีขึ้น
- Debug และ review code จาก agents ได้อย่างมั่นใจ
- Deploy code ที่ agents สร้างได้อย่างปลอดภัย
- Optimize performance ของ agent workflows
