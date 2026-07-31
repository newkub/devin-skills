---
name: follow-my-cli
description: เช็คและเลือกใช้ CLI tools ที่ติดตั้ง (mise, scoop, winget, bun)
---

## Goal

เช็ค CLI tools ที่ติดตั้งในเครื่องและเลือกใช้ตามความเหมาะสมกับงาน

## Scope

ครอบคลุมการเช็ค mise, scoop, winget, bun และเลือกใช้ CLI tools ตามความเหมาะสม — เบี่ยงเบนจาก `follow-*` template เพราะไม่ใช่ implementation ของ library แต่เป็นการเลือกใช้ installed CLI tools

## Execute

### 1. Check Installed CLI Tools

เช็ค CLI tools ที่ติดตั้งในเครื่อง

> Goal: ทราบ CLI tools ทั้งหมดที่ติดตั้งและพร้อมใช้งาน

1. รัน `mise list`, รัน `scoop list`, รัน `winget list`, รัน `bun --version`
2. รวบรวมรายการ CLI tools ทั้งหมดเป็นตาราง (tool name, version, manager)
3. ถ้า manager ไม่ได้ติดตั้ง → ข้ามและระบุในผลลัพธ์

### 2. Analyze Task Requirements

วิเคราะห์งานที่ต้องทำ

> Goal: ระบุประเภทงานและ constraints ชัดเจนเพื่อเลือก tool ที่เหมาะสม

1. ระบุประเภทงาน (file operations, code analysis, automation, data processing)
2. ระบุ performance requirements (lightweight, heavy, streaming)
3. ระบุ platform requirements (Windows, cross-platform)

### 3. Select Appropriate CLI Tool

เลือก CLI tool ตามความเหมาะสม

> Goal: เลือก tool ที่เหมาะสมที่สุดจากที่ติดตั้งไว้และ task requirements

1. File operations: ใช้ Windsurf file operations หรือ PowerShell
2. Code analysis: ใช้ `/use-ast-grep` สำหรับ AST-based analysis
3. Data processing: ใช้ `/use-scripts` สำหรับ Bun scripts
4. npm CLI tools: ใช้ `bunx <tool>` แทน `npx <tool>` — เร็วกว่า ใช้ Bun cache
5. CLI automation: ใช้ mise สำหรับ cross-platform tasks
6. Windows-specific: ใช้ scoop หรือ winget สำหรับ Windows tools

### 4. Execute Task

ทำงานด้วย tool ที่เลือก

> Goal: งานเสร็จสมบูรณ์ด้วย tool ที่เหมาะสม ผลลัพธ์ถูกต้อง

1. ใช้ tool ที่เลือกตามความเหมาะสม
2. ตรวจสอบผลลัพธ์ — ถ้าไม่ผ่าน → ปรับปรุงและ retry (max 3 → stop/report)

## Rules

### 1. Tool Selection Criteria

- mise: cross-platform task/version management (Linux, macOS, Windows)
- scoop: Windows package management เท่านั้น
- winget: Windows app installation จาก Microsoft Store เท่านั้น
- Windsurf file ops: file operations ใน IDE — ใช้แทน external CLI สำหรับ workspace operations
- Bun scripts: heavy data processing และ automation — cross-platform
- bunx: ใช้แทน `npx` สำหรับ npm CLI tools — เร็วกว่า ไม่ต้องติดตั้ง global

### 2. High Impact Content

- เก็บเฉพาะ tools ที่ติดตั้งจริง — ถ้า manager ไม่มี → ข้าม
- ทุก bullet ใน Rules ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ไม่แนะนำติดตั้ง tools ใหม่โดยไม่ได้รับอนุญาต — เฉพาะ tools ที่มีอยู่แล้ว

## Expected Outcome

- ตาราง CLI tools ที่ติดตั้ง (tool name, version, manager)
- เลือกใช้ CLI tool ที่เหมาะสมกับงาน
- ทำงานอย่างมีประสิทธิภาพ
