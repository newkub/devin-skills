---
name: my-persona
description: กำหนดและจัดการ personal persona สำหรับ AI assistant interaction
argument-hint: "[action]"
---

## Goal

กำหนด personal persona ของผู้ใช้ เพื่อให้ AI assistant เข้าใจ preferences, working style, และ communication style อย่างชัดเจน

## Scope

ครอบคลุมการกำหนดและจัดการ persona: identity, preferences, communication style, working style, tech stack, และ context ที่เกี่ยวข้อง

## Execute

### 1. Define Identity

> Goal: Define Identity

1. ระบุชื่อหรือ nickname ที่ต้องการให้ AI ใช้เรียก
2. ระบุ role หรือ profession (เช่น developer, architect, founder)
3. ระบุ timezone และ working hours
4. ระบุภาษาหลักที่ใช้สื่อสาร (ไทย/อังกฤษ) — ใช้ `/translate-to-lang-th` หรือ `/translate-to-lang-en`

### 2. Define Communication Style

> Goal: Define Communication Style

1. ระบุระดับความละเอียดของการตอบ (concise, balanced, detailed)
2. ระบุ tone (formal, casual, technical)
3. ระบุว่าต้องการให้ AI ถามคำถามก่อนทำ หรือทำเลยแล้วแจ้งผล
4. ระบุว่าต้องการให้ AI อธิบายเหตุผลก่อนทำ หรือทำเลย
5. ระบุ preference เรื่อง proactive vs careful — ใช้ `/ask-me` เมื่อต้องการยืนยัน

### 3. Define Working Style

> Goal: Define Working Style

1. ระบุ workflow ที่ต้องการให้ AI ทำตามเสมอ (อ้างอิง `/follow-devin-skills`)
2. ระบุระดับ automation ที่ต้องการ (manual approval, semi-auto, full-auto)
3. ระบุว่าต้องการให้ AI commit อัตโนมัติหรือไม่
4. ระบุว่าต้องการให้ AI รันคำสั่งที่อาจมี side effects อัตโนมัติหรือไม่
5. ระบุ preference เรื่อง minimal changes vs comprehensive changes

### 4. Define Tech Stack Preferences

> Goal: Define Tech Stack Preferences

1. ระบุ tech stack หลักที่ใช้ — อ้างอิง `/follow-my-tech-stack`
2. ระบุ package manager และ runtime ที่ต้องการ (เช่น Bun)
3. ระบุ framework preferences
4. ระบุ linting/formatting preferences
5. ระบุ testing preferences

### 5. Define Project Context

> Goal: Define Project Context

1. ระบุประเภทโปรเจกต์ที่ทำอยู่ (เช่น SaaS, monorepo, open source)
2. ระบุ stage ของโปรเจกต์ (early, growth, mature)
3. ระบุ constraints สำคัญ (เช่น budget, timeline, team size)
4. ระบุ priorities (speed, quality, maintainability, scalability)

### 6. Save Persona

> Goal: Save Persona

1. บันทึก persona ลง memory ด้วย `create_memory`
2. ตั้งค่า tags: `persona`, `user-preferences`, `communication-style`
3. อ้างอิง persona นี้ในทุก task ที่ทำต่อไป
4. อัปเดต persona เมื่อ preferences เปลี่ยนแปลง

## Rules

### Persona Completeness

- กำหนด persona ให้ครบทุก dimension: identity, communication, working style, tech stack, context
- ใช้ persona นี้เป็น default สำหรับทุก task
- อัปเดต persona เมื่อมีการเปลี่ยนแปลง preferences

### Communication

- ถ้าผู้ใช้กำหนดภาษาไทย ให้คุยภาษาไทยทุกครั้ง — ใช้ `/translate-to-lang-th`
- ถ้าผู้ใช้กำหนดภาษาอังกฤษ ให้คุยภาษาอังกฤษทุกครั้ง — ใช้ `/translate-to-lang-en`
- ถ้าผู้ใช้กำหนด concise ให้ตอบสั้นและตรงประเด็น
- ถ้าผู้ใช้กำหนด detailed ให้อธิบายครบถ้วน

### Working Style

- ถ้าผู้ใช้กำหนด proactive ให้ทำเลยแล้วแจ้งผล
- ถ้าผู้ใช้กำหนด careful ให้ใช้ `/ask-me` ก่อนทำสิ่งที่มี risk
- ถ้าผู้ใช้กำหนด minimal changes ให้แก้น้อยที่สุด
- ถ้าผู้ใช้กำหนด comprehensive ให้แก้ให้ครบถ้วน

### Non-Redundancy

- รายละเอียด tech stack อยู่ใน `/follow-my-tech-stack` แล้ว
- รายละเอียด system env อยู่ใน `/list-system-env` แล้ว
- รายละเอียด understanding อยู่ใน `/understand-me` แล้ว
- persona นี้เป็น summary และ reference point ไม่ซ้ำกับ workflows อื่น

## Expected Outcome

- Persona ที่ชัดเจนและบันทึกใน memory
- AI assistant เข้าใจ preferences และ working style
- การสื่อสารและการทำงานสม่ำเสมอตาม persona
- อัปเดต persona ได้เมื่อ preferences เปลี่ยน