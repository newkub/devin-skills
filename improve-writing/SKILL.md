---
name: improve-writing
description: ปรับปรุงคุณภาพการเขียนเอกสาร, comments, commit messages, changelogs ให้ชัดเจน กระชับ สม่ำเสมอ
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ปรับปรุงคุณภาพการเขียนเอกสารทั่ว project ให้ชัดเจน กระชับ สม่ำเสมอ และสื่อสารได้ตรงประเด็น

## Scope

ใช้สำหรับปรับปรุงคุณภาพการเขียน: documentation (README, docs, API docs), code comments, commit messages, changelogs, technical writing — ไม่รวม UX copy (อยู่ใน `/improve-ux-writing`) และ content coverage (อยู่ใน `/improve-content-coverage`)

## Execute

### 1. Audit Current Writing

ตรวจสอบการเขียนที่มีอยู่ทั้งหมด

> Goal: รู้ว่ามี writing issues อะไรบ้าง จัดลำดับตาม severity

1. ทำ `/scan-codebase` เพื่อหาเอกสารทั้งหมด: README, docs, comments, changelogs, commit messages
2. ทำ `/review-codebase` เพื่อ review documentation quality
3. จัดประเภท writing issues: unclear, verbose, inconsistent terminology, missing context, passive voice, jargon overuse, broken structure
4. จัดลำดับตาม severity: README/docs > API docs > code comments > changelogs > commit messages — ถ้าไม่มี issues → stop และ report

### 2. Improve Documentation

ปรับปรุง documentation ให้ชัดเจนและอ่านง่าย

> Goal: documentation ชัดเจน กระชับ สื่อสารได้ตรงประเด็น

1. ทำ `/update-readme` สำหรับ README — ใช้ `/follow-content-quality` เพื่อ review คุณภาพ
2. ทำ `/update-docs` สำหรับ documentation site — ตรวจสอบ structure, heading hierarchy, navigation
3. ปรับปรุง API docs: ครอบคลุม parameters, returns, examples, edge cases — ใช้ active voice
4. ปรับปรุง technical guides: แบ่งเป็นขั้นตอนชัดเจน, มี examples ที่ใช้งานได้จริง, อธิบาย why ไม่ใช่แค่ what
5. ลดความซ้ำซ้อน: ทำ `/simplify` เพื่อตัด noise และ redundant content

### 3. Improve Code Comments

ปรับปรุง code comments ให้มีคุณค่า

> Goal: comments สื่อความหมาย ไม่ใช่ noise

1. ทำ `/improve-comment` สำหรับ comments ที่ขาดหายไปใน complex logic
2. ลบ comments ที่ไม่จำเป็น: obvious comments, commented-out code, noise comments
3. ปรับปรุง comments ที่มี: เปลี่ยนจาก what → why, อธิบาย intent ไม่ใช่ implementation
4. ตรวจสอบ TODO/FIXME: มี context, มี owner, มี deadline หรือ clear action
5. ปรับปรุง JSDoc/TSDoc: ครอบคลุม params, returns, throws, examples — ใช้ active voice

### 4. Improve Commit Messages And Changelogs

ปรับปรุง commit messages และ changelogs ให้สื่อสารชัดเจน

> Goal: commit messages และ changelogs บอก what และ why อ่านง่าย

1. ตรวจสอบ commit messages: ใช้ conventional commits format, active voice, กระชับ, บอก why ไม่ใช่แค่ what
2. ทำ `/update-changelog-md` สำหรับ changelog — ตรวจสอบ format, grouping, user-facing language
3. ปรับปรุง changelog: จัดกลุ่มตาม category (Features, Bug Fixes, Breaking Changes), ใช้ user-facing language
4. ตรวจสอบ breaking changes: ระบุชัดเมื่อมี breaking change, บอก migration path

### 5. Improve Writing Consistency

ปรับปรุงความสม่ำเสมอของการเขียนทั่ว project

> Goal: terminology, voice, tone สม่ำเสมอทั่วทั้ง project

1. สร้าง glossary: ระบุคำศัพท์ที่ใช้ทั่ว project และคำที่ควรหลีกเลี่ยง
2. ตรวจสอบ terminology consistency: ใช้คำเดียวกันสำหรับ concept เดียวกันทั่วทั้งเอกสาร
3. ตรวจสอบ voice: active voice สำหรับ instructions, passive voice เฉพาะเมื่อจำเป็น
4. ตรวจสอบ tone: professional แต่เข้าถึงได้, ไม่ใช้ jargon โดยไม่จำเป็น, อธิบาย jargon เมื่อใช้
5. ตรวจสอบ formatting consistency: heading levels, bullet styles, code block languages, link formats

### 6. Validate And Report

ตรวจสอบผลลัพธ์และรายงาน

> Goal: writing ดีขึ้น ผ่าน validation และมี report ชัดเจน

1. ทำ `/follow-content-quality` เพื่อ review คุณภาพเนื้อหาหลังปรับปรุง
2. รัน `tsc --noEmit`, รัน `bunx biome lint`, ทำ `/run-verify` — ถ้าแก้ไขเอกสารที่เกี่ยวข้องกับ code
3. เทียบ before/after: unclear count, verbose count, inconsistent count, missing context count
4. ถ้า validation fail → ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)
5. รายงานเป็นตาราง: category | issues found | issues fixed | status — ทำ `/suggest-next-action`

## Rules

### 1. Writing Priority

- แก้ README และ docs ก่อนเสมอ — impact สูงสุดต่อผู้ใช้และ contributors
- แก้ API docs ก่อน code comments — API docs ใช้โดยผู้ใช้, comments ใช้โดย developers
- แก้ changelogs ก่อน commit messages — changelogs ใช้โดยผู้ใช้, commit messages ใช้โดย developers

### 2. Writing Principles

- ชัดเจนก่อนสวยงาม — เข้าใจง่ายก่อน แล้วค่อยคิดเรื่อง style
- กระชับ — เขียนสั้นที่สุดเท่าที่จะยังเข้าใจได้ — ตัด noise และ redundant content
- active voice — ใช้ active voice แทน passive voice สำหรับ instructions
- อธิบาย why ไม่ใช่แค่ what — บอกเหตุผลและบริบท ไม่ใช่แค่ผลลัพธ์
- หลีกเลี่ยง jargon — ใช้ศัพท์เทคนิคเมื่อจำเป็น และอธิบายเมื่อใช้

### 3. Safety And Scope Control

- การแก้ไข API docs ที่เกี่ยวข้องกับ public API ต้องมี dry run และ user confirmation
- ถ้าแก้ไขเอกสารที่เกี่ยวข้องกับ code → รัน typecheck และ lint หลังแก้ไข
- ไม่ลบเนื้อหาสำคัญ — ทำ `/simplify` เก็บ context ครบ ไม่ลบข้อมูลสำคัญ

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder — ไม่ปล่อยเอกสารไม่สมบูรณ์
- ปรับปรุงเมื่อ writing มีปัญหาจริง — ไม่ rewrite เพราะ style เปลี่ยนอย่างเดียว

## Expected Outcome

- documentation ชัดเจน กระชับ สื่อสารได้ตรงประเด็น
- code comments สื่อความหมาย ไม่ใช่ noise
- commit messages และ changelogs บอก what และ why
- terminology, voice, tone สม่ำเสมอทั่วทั้ง project
- ตาราง report: category | issues found | issues fixed | status
