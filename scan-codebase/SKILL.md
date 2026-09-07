---
name: scan-codebase
description: Scan codebase อย่างรวดเร็วเพื่อเข้าใจ structure, patterns, และ quality
argument-hint: "[scope]"
related:
  - deep-analyze
  - check-code-structure
  - use-astgrep
  - use-scripts
  - report-table
---

## Goal

Scan codebase อย่างรวดเร็วเพื่อเข้าใจ structure, patterns, และ quality ใน 3 นาที

## Scope

ใช้สำหรับ quick overview ก่อน `/deep-analyze` หรือ standalone snapshot เร็ว (sub-step ของ `/deep-analyze` Step 2)

## Execute

### 1. File Structure Discovery (30 วินาที)

> Goal: เข้าใจโครงสร้าง project, project type และ workspace layout

1. ทำ `find_by_name` หา manifest files
2. ทำ `find_by_name` หา directory structure (`src/`, `app/`, `lib/`, `components/`)
3. ระบุ project type และ monorepo structure

### 2. Pattern Search (1 นาที)

> Goal: ค้นพบ code patterns และ key terms ของ domain

1. ทำ `Grep` หา `import`, `export`, `function`, `class`, `const`, `interface` แบบ parallel
2. ทำ `Grep` หา key terms ที่เกี่ยวข้องกับ domain

### 3. Structural Analysis (1 นาที)

> Goal: ได้ภาพรวม structure ระดับ symbols และ outline

1. ทำ `/check-code-structure` เพื่อใช้ `ast-grep outline`
2. ทำ `/use-astgrep` สำหรับ ad-hoc AST patterns

### 4. Quality Check (30 วินาที)

> Goal: พบ quality issues และ anti-patterns พร้อม priority

1. ทำ `/review-quality` หา duplicate code
2. ทำ `Grep` หา anti-patterns (`any`, `console.log`, nested ternary)

### 5. Structured Data And Report (30 วินาที)

> Goal: สรุปผล scan เป็น structured data และรายงานที่อ่านง่าย

1. ทำ `/use-scripts` สร้าง structured data
2. ทำ `/report-table` สรุปผล

## Rules

- ประมวลผลแบบ parallel เพื่อความเร็ว
- ใช้ `Grep` สำหรับ text search
- ใช้ `ast-grep` สำหรับ semantic search
- ใช้ `/deep-analyze` ถ้าต้องการวิเคราะห์ลึก
- จำกัด scope ด้วย path, type, glob เพื่อลด noise

## Expected Outcome

- Project structure ที่ชัดเจน
- Code patterns ที่ใช้บ่อย
- Structure overview ผ่าน `ast-grep outline`
- Quality issues พร้อม priority
- Recommendations ตาม impact
