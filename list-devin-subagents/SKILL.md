---
name: list-devin-subagents
description: แสดงรายการ subagents ทั้งหมดใน devin agents repo พร้อมรายละเอียด
---

## Goal

แสดงรายการ subagents ทั้งหมดใน `%APPDATA%\devin\agents` พร้อม name, description, model และ allowed-tools

## Scope

ใช้เมื่อต้องการดูรายการ subagents ที่มีอยู่ หรือตรวจสอบว่ามี subagent ใดอยู่แล้วก่อนสร้างใหม่

## Execute

### 1. Scan Agents Directory

> Goal: หา subagents ทั้งหมด
> Goal: รายการ subagents ครบถ้วน

1. สแกน `%APPDATA%\devin\agents` หา subdirectories ที่มี `AGENT.md`
2. ข้าม `.backup/` directory
3. ถ้าไม่พบ directory → report ว่าไม่มี subagents

### 2. Extract Metadata

> Goal: ดึง metadata จากแต่ละ subagent
> Goal: ข้อมูล subagent ครบถ้วน

1. อ่าน `AGENT.md` ของแต่ละ subagent
2. ดึง frontmatter: `name`, `description`, `model`, `allowed-tools`, `permissions`
3. ถ้า frontmatter ไม่ครบ → ระบุในรายงาน

### 3. Report

> Goal: นำเสนอรายการ subagents
> Goal: ผู้ใช้ทราบ subagents ทั้งหมด

1. นำเสนอเป็นตาราง: name, description, model, allowed-tools
2. จัดเรียงตามชื่อ
3. ระบุจำนวน subagents ทั้งหมด
4. ถ้ามี subagent ที่ frontmatter ไม่ครบ → ระบุในส่วนท้าย

## Rules

### 1. Directory Scope

- สแกนเฉพาะ `%APPDATA%\devin\agents`
- ข้าม `.backup/` directory
- แสดงเฉพาะ subdirectories ที่มี `AGENT.md`

### 2. Output Format

- ใช้ตารางสำหรับรายการ
- คอลัมน์: name, description, model, allowed-tools
- จัดเรียงตามชื่อ

### 3. Completeness

- ตรวจครบทุก subdirectories
- ระบุ subagents ที่ frontmatter ไม่ครบ

## Expected Outcome

- รายการ subagents ทั้งหมดในตาราง
- แต่ละรายการมี name, description, model, allowed-tools
- จำนวน subagents ทั้งหมด
- ระบุ subagents ที่ frontmatter ไม่ครบ (ถ้ามี)
