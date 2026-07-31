---
name: report-format-terminal
description: จัดรูปแบบ terminal output, logs, errors, progress และ ANSI visuals
---

## Goal

จัดรูปแบบ terminal-style output (logs, errors, progress, ANSI art) ให้สวยงามและอ่านง่าย

## Scope

ใช้สำหรับการจัดรูปแบบ:
- CLI output และ dev server logs
- Error messages และ stack traces
- Progress indicators และ status
- ANSI art และ box drawings สำหรับ chat

## Execute

### 1. Detect Terminal Capabilities

1. ตรวจสอบ terminal support สำหรับ ANSI codes และ colors
2. ตรวจสอบ terminal width สำหรับ layout planning
3. กำหนด fallback strategy สำหรับ terminal ที่ไม่รองรับ
4. สำหรับ chat output ใช้ Unicode characters แทน raw ANSI escape codes

### 2. Format Logs

1. แยก log levels (`INFO`, `WARN`, `ERROR`, `DEBUG`)
2. ใช้ consistent timestamp format พร้อม timezone
3. ใช้ proper indentation สำหรับ stack traces
4. กรอง logs ตาม levels, time ranges, หรือ keywords

### 3. Format Errors

1. ระบุ error types และ categories
2. แยก error messages และ stack traces
3. ใช้ code blocks สำหรับ stack traces
4. เพิ่ม context: timestamps, locations, causes, suggestions
5. จัดลำดับตาม severity (critical ก่อน)

### 4. Format Progress

1. ระบุ total items, completed items, และ remaining steps
2. ใช้ progress bars สำหรับ visual indicators (`████████░░░░ 50%`)
3. ใช้ percentages สำหรับ quick overview
4. ใช้ status indicators (✅, ⏳, ❌)
5. เพิ่ม ETA และ blockers พร้อม solutions

### 5. Build ANSI Layout

1. ใช้ box drawing characters (`┌─┐`, `│ │`, `└─┘`, `├┤`, `┬┴`) สำหรับ borders
2. ใช้ `╔═╗`, `║ ║`, `╚═╝` สำหรับ double-line borders (headers, important sections)
3. จัด padding และ alignment ให้สมมาตร
4. ใช้ indentation สำหรับ nested content

### 6. Add Visual Elements

1. ใช้ status indicators: `✅`, `❌`, `⚠️`, `ℹ️`, `🔄`
2. ใช้ tree characters (`├──`, `└──`, `│`) สำหรับ hierarchy
3. ใช้ separators (`─`, `═`, `━`) สำหรับแยก sections
4. ใช้ text markers แทนสีสำหรับ chat output (`[PASS]`, `[FAIL]`, `[WARN]`, `[INFO]`)

### 7. Handle Overflow

1. ใช้ ellipsis สำหรับ content ที่ยาวเกิน width
2. ใช้ text wrapping สำหรับ long lines
3. ใช้ pagination สำหรับ output ที่ยาวมาก
4. ใช้ scroll indicators ถ้าจำเป็น

## Rules

### Chat Compatibility

- ใช้ Unicode characters ที่แสดงได้ใน chat
- ไม่ใช้ raw ANSI escape codes ใน chat output
- ใช้ box drawing characters และ emoji แทนสี
- ทดสอบ layout ใน chat output

### Log Formatting

- ใช้ consistent colors สำหรับ log levels
- ใช้ clear labels สำหรับ levels
- ใช้ proper ordering ตาม severity
- ใช้ metadata ที่เป็นประโยชน์

### Error Formatting

- ใช้ clear error messages
- ใช้ consistent formatting
- ใช้ proper indentation สำหรับ stack traces
- แสดง critical errors ก่อน

### Progress Formatting

- ใช้ real-time updates
- ใช้ accurate percentages
- ใช้ realistic ETAs
- ระบุ blockers พร้อม solutions

### Layout Consistency

- ใช้ box style เดียวกันทั้ง report
- จัด alignment สม่ำเสมอ
- ใช้ consistent spacing ระหว่าง sections
- ไม่ใส่ข้อมูลเกินไปใน box เดียว

## Expected Outcome

- Terminal output ที่สวยงามและอ่านง่าย
- Logs ที่จัดรูปแบบชัดเจนตาม levels
- Errors ที่ debug ได้พร้อม context
- Progress ที่ accurate และ up-to-date
- ANSI layout ที่ consistent ใน chat
