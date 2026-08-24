---
name: follow-content-quality
description: จัดรูปแบบและคุณภาพเนื้อหาให้ถูกต้อง อ่านง่าย สอดคล้องกัน
---

## Goal

สร้างเนื้อหาที่มีคุณภาพสูง อ่านง่าย สอดคล้องกัน และไม่ซ้ำซ้อน ครบทุกมิติ

## Scope

ใช้กับ content ทุกประเภท: markdown, documentation, workflow files, code comments, error messages, UI text

## Execute

### 1. Simplify And Remove Redundancy

> Goal: ทำเนื้อหาให้กระชับ ลบความซ้ำซ้อน และรวมส่วนที่เหมือนกัน
> Goal: เนื้อหากระชับ ไม่ซ้ำซ้อน เก็บ context ครบ

1. ทำ `/simplify` เพื่อลดความซับซ้อนโดยไม่สูญเสีย context — ลบ sections ที่ไม่จำเป็น รวม sections ที่คล้ายกัน
2. ลบข้อมูลที่ซ้ำซ้อนระหว่าง Execute และ Rules — ใช้ references แทนการเขียนซ้ำ — รวบรวมรายละเอียดที่เหมือนกันไว้ที่เดียว
3. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal — ถ้าเนื้อหาไม่มีปัญหาซ้ำซ้อน → ข้าม step นี้

### 2. Make Content Explicit

> Goal: เขียน content ให้ชัดเจน explicit มากกว่า implicit
> Goal: ทุกประโยคตีความได้ทางเดียว ไม่กำกวม

1. ตรวจสอบ active voice, ระบุ subject/object ชัดเจน, หลีกเลี่ยงคำกำกวม (should, could, might) — เปลี่ยนเป็นคำเฉพาะเจาะจง
2. ให้ตัวอย่าง concrete แทน abstract, ระบุ exceptions และ edge cases, อธิบาย "why" ไม่ใช่แค่ "what"
3. ตรวจสอบ error messages และ UI text: บอกสิ่งที่ผิด ทำไม และแก้ยังไง — หลีกเลี่ยง generic messages
4. ตรวจสอบว่าไม่มี assumptions ที่ไม่ได้ระบุ — ถ้าพบ content กำกวม → rewrite แล้ว recheck (max 3 → stop/report)

### 3. Improve Content Dimensions

> Goal: ปรับปรุง content ครบทุกมิติ
> Goal: ครอบคลุม readability, completeness, correctness, accessibility, maintainability, relevance, actionability

1. ตรวจสอบ Readability, Completeness, Correctness — explanations ชัดเจน/formatting เหมาะสม, รวม use cases/examples/edge cases, ตรวจสอบ structure/flow/assumptions
2. ตรวจสอบ Accessibility, Maintainability, Relevance, Actionability — screen reader friendly/alt text, organized structure/consistent patterns, address audience needs, actionable steps/clear instructions
3. ตรวจสอบ Consistency, Tone And Voice, Terminology — cross-reference consistency, tone สม่ำเสมอ, ใช้คำศัพท์เดียวกันทั่วทั้งเอกสาร
4. ตรวจสอบ Link Quality, Searchability, Freshness — links ไม่ broken/anchor ถูกต้อง, headings/keywords ช่วย search, เนื้อหาไม่ล้าสมัย
5. ถ้าเป็น documentation → ตรวจสอบ Visual Content: code blocks มี syntax highlighting, diagrams ชัดเจน, screenshots มี alt text

### 4. Validate Structure And Format

> Goal: ตรวจสอบโครงสร้างและรูปแบบให้สม่ำเสมอ
> Goal: โครงสร้างสม่ำเสมอ hierarchy ชัดเจน format ถูกต้อง

1. ตรวจสอบ spacing/indentation/headings สม่ำเสมอ, หัวขอ่ม Title Case ภาษาอังกฤษ รายการภาษาไทย, grouping และ hierarchy logical
2. ถ้า format ไม่ผ่าน → fix และ recheck (max 3 → stop/report)

## Rules

### 1. Format And Structure

- ใช้ spacing, indentation, headings สม่ำเสมอ — หัวข้อ Title Case ภาษาอังกฤษ รายการภาษาไทย
- ลบ subsections ที่ไม่จำเป็นให้เป็น bullet points — รวม Execute steps ที่ทำงานคล้ายกัน
- Grouping และ hierarchy ชัดเจน logical — numbering ต่อเนื่องถูกต้อง

### 2. Explicit Content

- ใช้ภาษาตรงไปตรงมา ระบุ subject และ object ชัดเจน — หลีกเลี่ยง pronouns ที่ไม่ชัดเจน
- ใช้ active voice แทน passive voice — ระบุเงื่อนไขและข้อจำกัดชัดเจน
- ให้ตัวอย่าง concrete แทน abstract descriptions — ระบุ exceptions และ edge cases
- ใช้คำที่เฉพาะเจาะจงแทนคำทั่วไป — หลีกเลี่ยงคำที่มีหลายความหมาย
- อธิบาย "why" ไม่ใช่แค่ "what" — เขียน error messages ที่บอก context (สิ่งที่ผิด, ทำไม, แก้ยังไง)

### 3. Non-Redundancy

- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules — ใช้ references แทนการเขียนซ้ำ
- Single source of truth — รวบรวมรายละเอียดที่เหมือนกันไว้ที่เดียว
- ความยาวเหมาะสมกับเนื้อหา — ใช้ `/dont-over-engineer` เสมอเมื่อเริ่มทำงาน

### 4. Content Dimensions

- Readability: explanations ชัดเจน, formatting เหมาะสม, หลีกเลี่ยง jargon
- Completeness: รวม use cases, examples, edge cases
- Correctness: ตรวจสอบ structure, flow, edge cases, assumptions
- Accessibility: screen reader friendly, keyboard navigation, alt text
- Maintainability: organized structure, consistent patterns, documentation
- Relevance: address audience needs, solve real problems
- Actionability: actionable steps, clear instructions, examples ปฏิบัติได้
- Consistency: cross-reference consistency, ใช้คำศัพท์เดียวกันทั่วทั้งเอกสาร
- Tone And Voice: tone สม่ำเสมอทั่วทั้งเอกสาร
- Terminology: ใช้คำศัพท์เดียวกันทั่วทั้งเอกสาร
- Link Quality: links ไม่ broken, anchor ถูกต้อง
- Searchability: headings/keywords ช่วย search
- Freshness: เนื้อหาไม่ล้าสมัย — ตรวจสอบวันที่และ version
- Visual Content: code blocks มี syntax highlighting, diagrams ชัดเจน, screenshots มี alt text

## Expected Outcome

- เนื้อหาอ่านง่าย กระชับ ตรงประเด็น ไม่ซ้ำซ้อน — เป็น single source of truth
- ชัดเจน เข้าใจง่าย ไม่กำกวม — ทุกประโยคตีความได้ทางเดียว
- สอดคล้องกันทั้งหมด — terminology, tone, format สม่ำเสมอ
- ครบทุกมิติ quality: readability, completeness, correctness, accessibility, maintainability, relevance, actionability, consistency, tone, terminology, link quality, searchability, freshness, visual content
- โครงสร้างไฟล์เป็นระเบียบ hierarchy ชัดเจน — ทุก step มี `, ` markers สำหรับ parallel execution
