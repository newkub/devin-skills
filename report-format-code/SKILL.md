---
name: report-format-code
description: จัดรูปแบบ code blocks, diffs, JSON และ markdown documents
allowed-tools:
- read
- write
- edit
- grep
- glob
- exec
- ask_user_question
triggers:
- user
- model
related:
- report-format-table
- suggest-next-action
- report-format-terminal
---

## Goal

จัดรูปแบบ code/text output (codeblocks, diffs, JSON, markdown) ให้สวยงามและอ่านง่าย

## Scope

ใช้สำหรับการจัดรูปแบบ:
- Code snippets พร้อม syntax highlighting
- Code diffs และ changes
- JSON output สำหรับ API responses และ structured data
- Markdown documents สำหรับ documentation และ README

## Execute

### 1. Format Code Blocks

1. ระบุ programming language สำหรับ syntax highlighting
2. ใช้ language tags ที่ถูกต้อง (`typescript`, `python`, `rust`, ฯลฯ)
3. ใช้ proper indentation (2 หรือ 4 spaces)
4. เพิ่ม comments สำหรับ code ที่ซับซ้อน

### 2. Format Diffs

1. ใช้ standard unified diff format (`+`, `-`, context)
2. จัดกลุ่ม changes ตาม files
3. เพิ่ม file paths และ change statistics (additions, deletions)
4. ใช้ context lines สำหรับ readability

### 3. Format JSON

1. ใช้ pretty print ด้วย indentation 2 spaces
2. ใช้ consistent naming conventions (`camelCase` หรือ `snake_case`)
3. ใช้ `null` แทน undefined หรือ empty strings
4. เพิ่ม metadata: `timestamp`, `version`, `status`

### 4. Format Markdown

1. ใช้ hierarchy ของ headings (H1-H6) อย่างเหมาะสม
2. ใช้ H1 สำหรับ document title (เพียง 1 ครั้ง)
3. ใช้ H2-H3 สำหรับ main sections, H4-H6 สำหรับ subsections
4. ไม่ข้าม heading levels

### 5. Add Metadata

1. เพิ่ม filename หรือ path ด้านบน code block
2. เพิ่ม line numbers ถ้าจำเป็น
3. เพิ่ม commit hash สำหรับ diffs
4. เพิ่ม timestamp สำหรับ JSON output

### 6. Highlight Key Parts

1. ใช้ bold สำหรับ keywords สำคัญ
2. ใช้ comments สำหรับ explanations ใน code
3. ใช้ markers สำหรับ function/class changes ใน diffs
4. ใช้ inline annotations ถ้าจำเป็น

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Code Formatting

- ใช้ language tags ที่ถูกต้องและ standard
- ใช้ consistent indentation ทั้ง code block
- ใช้ consistent code style
- ใช้ plain text ถ้าไม่มี language ที่เหมาะสม

### Diff Format

- ใช้ standard unified diff format
- ใช้ consistent markers สำหรับ additions/deletions
- ใช้ sufficient context สำหรับ readability
- ระบุ change type (added, modified, deleted)

### JSON Format

- ใช้ consistent naming conventions ทั้ง JSON
- จัดลำดับ fields ตามความสำคัญ
- ใช้ nested objects สำหรับ data ที่เกี่ยวข้องกัน
- ตรวจสอบไม่มี circular references

### Markdown Format

- ใช้ bold สำหรับ keywords, italic สำหรับ emphasis
- ใช้ code blocks พร้อม language tags
- ใช้ backticks สำหรับ inline code
- ใช้ descriptive link text และ alt text

## Expected Outcome

- Code blocks ที่มี syntax highlighting ถูกต้อง
- Diffs ที่ชัดเจนและอ่านง่าย
- JSON output ที่ valid และ consistent
- Markdown documents ที่อ่านง่ายและ well-structured
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
