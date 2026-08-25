---
title: Safety And Security Checks
description: กฎตรวจสอบ safety และ security ของ subagent
---

# Safety And Security Checks

## Secrets Check

ตรวจว่าไม่มี secrets หรือ credentials hardcoded ใน `AGENT.md`:

- API keys
- passwords
- tokens
- private keys
- connection strings

### Patterns To Flag

- คำว่า `password`, `secret`, `token`, `api_key` ตามด้วยค่าจริง
- string ที่ดูเหมือน base64 หรือ hex ยาวผิดปกติ
- ถ้าพบ → flag เป็น Critical

## Permissions Deny Risky Paths

`permissions` ต้องระบุ `deny` สำหรับ system paths ที่เสี่ยง:

- `%APPDATA%` นอก scope
- `C:\Windows`
- `C:\Program Files`
- `C:\Program Files (x86)`
- `/etc`, `/usr`, `/bin` (สำหรับ Linux/macOS)
- `~/.ssh`
- `~/.aws`

### Rules

- ถ้าขาด `permissions` → flag เป็น High
- ถ้ามี `permissions` แต่ไม่มี `deny` → flag เป็น High
- ถ้า `deny` ไม่ครอบคลุม risky paths → flag เป็น High

## Allowed-Tools Appropriateness

`allowed-tools` ต้องเหมาะสมกับ scope ของ subagent:

- ห้ามให้ tools ที่กว้างเกินจำเป็น เช่น `*` หรือ `all`
- ห้ามให้ tools ที่เสี่ยง เช่น `exec` ถ้า subagent ไม่จำเป็นต้องรัน command
- ถ้า `allowed-tools` กว้างเกินไป → flag เป็น Medium

## Severity Mapping

| Finding | Severity |
|---|---|
| secrets/credentials hardcoded | Critical |
| ขาด `permissions` หรือ `deny` | High |
| `deny` ไม่ครอบคลุม risky paths | High |
| `allowed-tools` กว้างเกินจำเป็น | Medium |

## Evidence Format

บันทึก finding พร้อม:

- file path ของ `AGENT.md`
- line number ที่พบ
- เนื้อหาที่เสี่ยง
- action ที่แนะนำ เช่น ลบ secret, เพิ่ม `deny` path
