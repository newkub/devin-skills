---
name: follow-context-engineering
description: จัดการ context ของ AI agent อย่างมีประสิทธิภาพ ลด context rot เพิ่มคุณภาพการทำงาน
related:
  - follow-math-set-theory
  - follow-math-information-theory
---

## Goal

จัดการ context ของ AI coding agent อย่างมีประสิทธิภาพ เพื่อรักษาคุณภาพการทำงานตลอด long-horizon tasks โดยใช้หลักการ context engineering จาก Anthropic

## Scope

ใช้สำหรับ AI coding assistant ที่ทำงานหลายขั้นตอน มี tool calls หลายรอบ หรือทำงาน multi-session เพื่อจัดการ context window อย่างเป็นระบบ

## Execute

### 1. Curate System Context

> Goal: คัดเลือก context เริ่มต้นให้มี high-signal tokens น้อยที่สุดเท่าที่จำเป็น

1. เขียน system instructions ที่ชัดเจน ใช้ภาษาตรงประเด็น ไม่กำกวม
2. จัดระเบียบ instructions เป็น sections ชัดเจน (background, instructions, tool guidance, output description)
3. ใช้ XML tags หรือ Markdown headers แบ่ง sections เพื่อให้ model แยกบริบทได้ชัดเจน
4. ถ้ามี `AGENTS.md` ให้อ่านและทำตาม เพราะเป็น project-level context หลัก
5. คัดเลือกเฉพาะข้อมูลที่จำเป็นต่อ task ปัจจุบัน ไม่ใส่ข้อมูลที่ไม่เกี่ยวข้อง

### 2. Optimize Tool Usage

> Goal: ใช้ tools อย่างมีประสิทธิภาพเพื่อลด context consumption

1. ใช้ tools ที่ return ข้อมูลกระชับ ไม่ bloated output
2. หลีกเลี่ยง tools ที่มี functionality ซ้ำซ้อนกัน
3. ถ้ามี tool ที่ทำงานคล้ายกัน ให้เลือกใช้ tool ที่ token-efficient ที่สุด
4. รวม independent tool calls เป็น parallel calls เพื่อลดจำนวนรอบและ context accumulation
5. ใช้ `code_search` แทนการอ่านไฟล์ทีละไฟล์เพื่อค้นหา
6. ใช้ `offset` และ `limit` เพื่ออ่านเฉพาะส่วนไฟล์ที่จำเป็น

### 3. Apply Compaction

> Goal: ใช้ compaction เมื่อ context ใกล้เต็มเพื่อรักษา conversational flow

1. สรุป message history โดย preserve: architectural decisions, unresolved bugs, implementation details
2. ทิ้ง: redundant tool outputs, verbose error messages, ข้อมูลที่ไม่เกี่ยวข้อง
3. ใช้ tool result clearing: ลบ raw tool results เก่าที่ไม่จำเป็นต้องดูซ้ำ
4. หลัง compaction ให้เริ่ม context ใหม่พร้อม summary + 5 files ล่าสุดที่เกี่ยวข้อง
5. ทำ `/follow-context-rot` เมื่อตรวจพบสัญญาณ context degradation

### 4. Use Structured Note-Taking

> Goal: ใช้ agentic memory เพื่อ maintain progress นอก context window

1. สร้างและอัปเดต `progress.txt` หรือ `NOTES.md` สำหรับ track progress ข้าม session
2. บันทึก: goal หลัก, sub-tasks ที่เสร็จ, decisions สำคัญ, dependencies, ปัญหาที่เจอ
3. ใช้ `create_memory` tool สำหรับบันทึก context ที่ต้องใช้ข้าม project
4. อ่าน notes ก่อนเริ่มทำงานต่อเพื่อ restore context อย่างรวดเร็ว
5. อัปเดต notes ทุกครั้งหลังเสร็จ sub-task สำคัญ

### 5. Decompose With Sub-Agent Pattern

> Goal: แบ่งงานใหญ่เป็น sub-tasks เพื่อจำกัด context ของแต่ละส่วน

1. แบ่ง task ใหญ่เป็น sub-tasks ที่มี context แยกอิสระ
2. แต่ละ sub-task ทำงานใน context สะอาด ไม่สะสม context จาก sub-task อื่น
3. แต่ละ sub-task ส่งกลับเฉพาะ condensed summary (1,000-2,000 tokens) ไม่ใช่ raw context
4. ใช้ `/deep-plan` สำหรับวางแผน sub-tasks ก่อนเริ่ม
5. ใช้ `/loop-until-complete` สำหรับแต่ละ sub-task

### 6. Manage Context Lifecycle

> Goal: จัดการ context ตลอด conversation lifecycle

1. เริ่มต้น: คัดเลือก minimal context ที่จำเป็นต่อ task
2. ระหว่างทำงาน: ย้ำ goal ทุก 5-10 tool calls เพื่อรักษา goal alignment
3. ก่อน reset: สรุปและ preserve context สำคัญ
4. หลัง reset: อ่าน notes และ restore context อย่างรวดเร็ว
5. ตรวจสอบสัญญาณ context rot ทุก 10 tool calls

## Rules

### 1. Minimal High-Signal Context

ใช้ context น้อยที่สุดเท่าที่จำเป็น

- คัดเลือกเฉพาะ high-signal tokens ที่ maximize โอกาสได้ผลลัพธ์ที่ดี
- หลีกเลี่ยง bloated tool outputs และ verbose error messages
- ใช้ `offset`, `limit` สำหรับอ่านไฟล์ใหญ่
- รวม independent tool calls เป็น parallel calls
- ไม่อ่านไฟล์เดิมซ้ำหลายครั้ง

### 2. Compaction Strategy

ใช้ compaction เมื่อ context ใกล้เต็ม

- สรุปโดย preserve: decisions, bugs, implementation details
- ทิ้ง: redundant tool outputs, verbose messages
- ใช้ tool result clearing สำหรับ lightest compaction
- หลัง compaction ให้เริ่ม context ใหม่พร้อม summary + recent files
- ทำ `/follow-context-rot` เมื่อตรวจพบ context degradation

### 3. Persistent Memory

ใช้ structured note-taking สำหรับข้าม session

- บันทึก progress ลง `progress.txt` หรือ `NOTES.md`
- ใช้ `create_memory` สำหรับข้อมูลข้าม project
- อ่าน notes ก่อนเริ่มทำงานต่อ
- อัปเดต notes หลังเสร็จ sub-task สำคัญ
- บันทึก: goal, progress, decisions, dependencies, ปัญหา

### 4. Task Decomposition

แบ่งงานเพื่อจำกัด context ของแต่ละส่วน

- แต่ละ sub-task มี context แยกอิสระ
- ส่งกลับเฉพาะ condensed summary ไม่ใช่ raw context
- ใช้ `/deep-plan` สำหรับวางแผน sub-tasks
- ใช้ `/loop-until-complete` สำหรับแต่ละ sub-task

### 5. Goal Alignment

รักษา goal alignment ตลอด conversation

- ย้ำ goal หลักทุก 5-10 tool calls
- ตรวจสอบว่า output ยังสอดคล้องกับ goal
- ปรับ goal ถ้า requirements เปลี่ยน
- ใช้ `/suggest-next-action` เมื่อไม่แน่ใจทิศทาง

## Expected Outcome

- Context window ใช้อย่างมีประสิทธิภาพ ลด context rot
- High-signal tokens ครบถ้วน ไม่มี bloated context
- Progress ถูก preserve ข้าม session ผ่าน structured notes
- Long-horizon tasks ถูกแบ่งเป็น sub-tasks ที่จัดการได้
- Goal alignment รักษาไว้ตลอด conversation
