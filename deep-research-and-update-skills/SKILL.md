---
name: deep-research-and-update-skills
description: Deep research หาข้อมูลล่าสุดของ topic/library/tool แล้วอัปเดต skills ทีเกี่ยวข้อง
argument-hint: "[topic-or-skill]"
related:
  - deep-research
  - learn-from-web
  - update-devin-global-skills
  - update-devin-project-skills
  - update-dot-devin
  - report-table
  - suggest-next-action
---

## Goal

Deep research หาข้อมูลล่าสุดของ topic, library, tool หรือ framework แล้วอัปเดต skills ทีเกี่ยวข้องให้ตรงกับ current best practices, APIs, commands

## Scope

ใช้เมื่อต้อง update skill หรือสร้าง skill ใหม์ และต้องการข้อมูลล่าสุดจาก docs, changelog, repository ก่อนเขียน รองรับทั้ง global skills และ project-local skills

## Execute

### 1. Identify Target

> Goal: รู้ว่าต้อง research เรื่องอะไร

1. รับ argument `topic-or-skill`
2. ระบุ skill ทีต้อง update หรือสร้าง
3. ถ้าไม่ชัด → `/ask-me`

### 2. Deep Research

> Goal: หาข้อมูลล่าสุดและถูกต้อง

1. ทำ `/deep-research` โดยระบุ topic หรือ skill
2. ทำ `/learn-from-web` จาก official docs, changelog, repository
3. บันทึก: latest version, breaking changes, new commands, new options, deprecation
4. หาตัวอย่าง command, config, output จริง

### 3. Map Findings To Skills

> Goal: รู้ว่าต้องแก้ skills ไหนบ้าง

1. อ่าน skill ทีเกี่ยวข้อง
2. ระบุ sections ทีต้อง update: Goal, Scope, Execute, Rules, Expected Outcome
3. ระบุ references ทีต้องสร้างหรือแก้

### 4. Update Skills

> Goal: แก้ไข skill ให้ทันสมัย

1. ใช้ `/update-devin-global-skills` สำหรับ global skills
2. ใช้ `/update-devin-project-skills` สำหรับ project-local skills
3. อัปเดต commands, options, examples, env vars, URLs
4. ลบ deprecated commands
5. เพิ่ม new commands/sections ที่จำเป็นต้องรู้

### 5. Validate

> Goal: ยื่นยันว่า skill อัปเดตถูกต้อง

1. ทำ `/deep-validate`
2. ตรวจความยาวไม่เกิน 250 บรรทัด
3. ตรวจ references ไม่หักล้าม
4. ทำ `/update-references` ถ้ามีการย้าย/เปลี่ยนชื่อ

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง topic, old info, new info, skill updated
2. ทำ `/suggest-next-action`

## Rules

### 1. Official Sources First

- ใช้ official docs, changelog, repository เป็นแหล่งหลัก
- ไม่ใช้ third-party ถ้า official มี
- ระบุ source URLs

### 2. Evidence-Based Updates

- ทุกการแก้ skill ต้องมี evidence
- บันทึก version ที่ research
- ไม่เดา API หรือ command

### 3. Minimal Changes

- แก้เฉพาะสิ่งที่เปลี่ยนจริง
- ไม่ rewrite skill ทั้งหมดถ้าไม่จำเป็น
- รักษา existing conventions

### 4. No Placeholder

- ไม่ใช้ TODO/MOCK/placeholder
- ถ้าข้อมูลไม่ชัด ให้ระบุความไม่แน่นอน

## Expected Outcome

- Skill ที่ update สะท้อน latest version/best practices
- Commands, options, examples ถูกต้อง
- References อัปเดต
- Report table สรุป findings
