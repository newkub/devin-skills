---
name: follow-devin
description: Devin/Cascade AI coding assistant สำหรับ autonomous software engineering
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

ใช้ skill นี้เพื่อเข้าใจและใช้งาน Devin/Cascade AI coding assistant สำหรับ autonomous software development, code generation, debugging, และ testing

## Scope

ใช้สำหรับ:
- ใช้งาน Devin Desktop และ Cascade ใน Windsurf IDE
- เข้าใจ AI models (SWE-1.6, SWE-1.5, SWE-1, swe-grep)
- ใช้งาน Spaces และ Agent Client Protocol (ACP)
- เขียน prompts ที่มีประสิทธิภาพสำหรับ coding agents
- Debug และ review code ที่ agents สร้าง
- จัดการ fleets ของ local และ cloud agents

## Execute

### 1. เริ่มต้นใช้งาน
> Goal: เริ่มต้นใช้งาน

อ่าน `guide/getting-started.md` เพื่อเรียนรู้:
- การติดตั้งและ setup Devin Desktop
- การเชื่อมต่อกับ Windsurf IDE
- การเลือกและใช้งาน AI models
- การสร้างและจัดการ Spaces
- การเขียน prompt แรกของคุณ

### 2. เข้าใจ Core Concepts
> Goal: เข้าใจ Core Concepts

อ่าน `key-concepts/` เพื่อเข้าใจ:
- `SWE Models`: SWE-1.6, SWE-1.5, SWE-1, SWE-1-mini, swe-grep
- `Agent Client Protocol (ACP)`: Protocol สำหรับ communication ระหว่าง agents
- `Spaces`: Shared context และ Git worktrees สำหรับ agents
- `Supercomplete`: Intelligent autocomplete ที่ predict next thought
- `Tool Calling`: Parallel tool calls สำหรับ efficient execution
- `Context Awareness`: Fast Context และ context retrieval

### 3. ปฏิบัติตาม Best Practices
> Goal: ปฏิบัติตาม Best Practices

อ่าน `principles/` เพื่อเรียนรู้:
- Prompt engineering สำหรับ coding agents
- Debugging และ review code จาก agents
- Managing agent fleets
- Security และ privacy considerations
- Performance optimization

### 4. ใช้ Workflows
> Goal: ใช้ Workflows

ใช้ `workflows/` สำหรับ tasks เฉพาะ:
- `setup-devin.md`: Setup Devin Desktop และ Windsurf
- `create-agent.md`: สร้าง custom agents
- `debug-with-agent.md`: Debug ด้วย agents
- `review-code.md`: Review code จาก agents
- `deploy-with-agent.md`: Deploy ด้วย agents

## Rules

### 1. Model Selection

- เลือก model ตาม task:
  - `SWE-1.6`: General coding tasks, high intelligence
  - `SWE-1.6 Fast`: Fast coding tasks, speed priority
  - `SWE-1.5`: Legacy support, near Claude 4.5 performance
  - `SWE-1-mini`: Real-time autocomplete, low latency
  - `swe-grep`: Context retrieval และ search

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

## Expected Outcome

- เข้าใจและใช้งาน Devin/Cascade ได้อย่างมีประสิทธิภาพ
- เขียน prompts ที่ทำให้ agents ทำงานได้ดีขึ้น
- Debug และ review code จาก agents ได้อย่างมั่นใจ
- Deploy code ที่ agents สร้างได้อย่างปลอดภัย
- Optimize performance ของ agent workflows
