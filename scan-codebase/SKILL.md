---
name: scan-codebase
description: Scan codebase อย่างรวดเร็วเพื่อเข้าใจ structure, patterns, และ quality ใน 3 นาที
---

## Goal

Scan codebase อย่างรวดเร็วเพื่อเข้าใจ structure, patterns, และ quality ใน 3 นาที

## Scope

ครอบคลุม file structure, code patterns, structural analysis, quality metrics, text search, file search, AST-based search, และ structure navigation ด้วย minimal AI token

## Execute

### 1. File Structure Discovery (30 วินาที)

> Goal: File Structure Discovery (30 วินาที)

ค้นพบ structure ของ codebase

1. ทำ `find_by_name` หา manifest files (`package.json`, `tsconfig.json`, `Cargo.toml`, `pyproject.toml`)
2. ทำ `find_by_name` หา directory structure (`src/`, `app/`, `lib/`, `components/`, `utils/`)
3. ระบุ project type จาก manifest files
4. ตรวจสอบ monorepo structure (workspaces, packages/)

### 2. Pattern Search (1 นาที)

> Goal: Pattern Search (1 นาที)

ค้นหา patterns ทั่วไปด้วย Grep

1. ทำ `Grep` หา `import` patterns (parallel)
2. ทำ `Grep` หา `export` patterns (parallel)
3. ทำ `Grep` หา `function`, `class`, `const`, `interface` (parallel)
4. ทำ `Grep` หา key terms ที่เกี่ยวข้องกับ domain (parallel)
5. รวบรวม results และ count frequencies

### 3. Structural Analysis (1 นาที)

> Goal: Structural Analysis (1 นาที)

วิเคราะห์ structure ด้วย ast-grep ผ่าน `/use-scripts`

1. ทำ `/use-scripts` สร้าง Bun script ใน `.devin/scripts/` สำหรับรัน ast-grep patterns:
   ```typescript
   await $`ast-grep run -p 'function $NAME($$ARGS) {$$BODY}' --json`
   await $`ast-grep run -p 'const $NAME = $VALUE' --json`
   await $`ast-grep run -p 'class $NAME {$$BODY}' --json`
   await $`ast-grep run -p 'interface $NAME {$$BODY}' --json`
   ```
2. รัน script ใน dry run mode ก่อนเพื่อตรวจสอบผลลัพธ์
3. รัน script จริงและรวบรวม results และ group ตาม file type
4. ลบ script หลังใช้งาน

### 4. Structure Navigation (30 วินาที)

> Goal: สำรวจ structure ด้วย `ast-grep outline` โดยไม่ต้องอ่านทั้งไฟล์

1. ทำ `/use-ast-grep-outline` เพื่อเข้าใจวิธีใช้งาน `ast-grep outline`
2. รัน `ast-grep outline <path> --items structure` สำหรับ top-level symbols
3. รัน `ast-grep outline <path> --items exports` สำหรับ exported surface
4. รัน `ast-grep outline <path> --items imports` สำหรับ imports และ boundary crossing
5. ใช้ `--type` หรือ `--match` ลด noise ถ้า scope ใหญ่
6. ใช้ `--view expanded` สำหรับ top-level symbols พร้อม members
7. ทำ `/use-ast-grep` สำหรับ ad-hoc AST patterns ที่ต้องการ semantic search

### 5. Quality Check (30 วินาที)

> Goal: ตรวจสอบคุณภาพโค้ด

1. ทำ `/review-quality` หา duplicate code
2. ทำ `Grep` หา anti-patterns (`any`, `console.log`, nested ternary)
3. ตรวจสอบ biome/gritql config ถ้ามี
4. รัน biome/gritql ถ้ามี config

### 6. Structured Data Generation (30 วินาที)

> Goal: สร้าง structured data สำหรับ AI ด้วย `/use-scripts`

1. ทำ `/use-scripts` สร้าง Bun script ใน `.devin/scripts/` สำหรับรวบรวม findings และสร้าง structured data:
   ```typescript
   {
     structure: { files, directories, projectType },
     patterns: { imports, exports, functions, classes },
     quality: { duplicates, antiPatterns, issues },
     metrics: { complexity, coupling }
   }
   ```
2. รัน script ใน dry run mode ก่อนเพื่อตรวจสอบผลลัพธ์
3. รัน script จริงและทำ `/report-markdown-table` สร้าง table summary
4. ลบ script หลังใช้งาน

### 7. AI Summarization (Minimal Token)

> Goal: สรุป findings ด้วย AI

1. ส่ง structured data ให้ AI
2. ขอ summary ของ codebase
3. ขอ recommendations ตาม priority
4. ทำ `/report` สรุปผลลัพธ์

## Rules

### 1. Parallel Processing

ประมวลผลแบบ parallel เพื่อความเร็ว

- รัน Grep patterns พร้อมกัน
- รัน ast-grep patterns พร้อมกัน
- รัน quality checks พร้อมกัน

### 2. Tool Selection

เลือก tools ที่เหมาะสมกับแต่ละ use case

- Text Search: ใช้ `Grep` สำหรับข้อความ, strings, comments — รองรับ regex patterns
- File Search: ใช้ `find_by_name` สำหรับไฟล์, directories — รองรับ glob patterns, extensions, type filter
- Semantic Search: ใช้ `ast-grep` สำหรับ code structures (functions, classes, imports) — ใช้ meta variables `$VAR`
- Structure Navigation: ใช้ `ast-grep outline` สำหรับ explore structure โดยไม่ต้องอ่านทั้งไฟล์
- Phase 1: `find_by_name` สำหรับ file discovery
- Phase 2: `Grep` สำหรับ pattern matching
- Phase 3: `/use-scripts` + ast-grep สำหรับ structural analysis
- Phase 4: `ast-grep outline` สำหรับ structure navigation
- Phase 5: `/review-quality`, `biome/gritql` สำหรับ quality
- Phase 6: `/use-scripts` สำหรับ structured data generation
- Phase 7: AI สำหรับ summarization
- ทำ `/update-project-rules` สำหรับสร้าง ast-grep rules

### 3. AI Token Minimization

ใช้ AI token อย่างประหยัด

- ส่ง structured data แทน raw code
- ใช้ AI เฉพาะ summarization
- ใช้ AI เฉพาะ generate recommendations

### 4. Coverage Standards

ครอบคลุมทุกมิติที่สำคัญ

- Structure: files, directories, project type
- Patterns: imports, exports, functions, classes
- Quality: duplicates, anti-patterns, issues
- Metrics: complexity, coupling

### 5. Pattern Precision

ใช้ patterns ที่ precise

- ใช้ regex patterns ที่ specific ใน Grep
- ใช้ meta variables ใน ast-grep: `$VAR` สำหรับ single node, `$$$ARGS` สำหรับ multiple nodes
- ใช้ `kind` ใน ast-grep สำหรับ specific AST node types
- ใช้ glob patterns ที่ specific ใน find_by_name
- ใช้ `Extensions` แทน glob patterns สำหรับ extension filtering

### 6. Search Scope

กำหนด scope ของการค้นหา

- ใช้ `path` ใน Grep เพื่อจำกัด directory
- ใช้ `SearchDirectory` ใน find_by_name เพื่อจำกัด directory
- ใช้ `type` หรือ `glob` เพื่อ filter file types
- ใช้ `MaxDepth` เพื่อจำกัด depth
- ใช้ `Excludes` เพื่อ skip files/directories

### 7. Performance Optimization

ปรับปรุง performance

- ค้นหาแบบ parallel เมื่อมีหลาย patterns
- จำกัด scope ด้วย path, type, glob
- ใช้ `head_limit` เพื่อจำกัด results
- ใช้ `files_with_matches` ก่อน แล้วค่อยอ่าน content

### 8. Actionable Output

สร้างผลลัพธ์ที่นำไปปฏิบัติได้จริง

- ระบุ project type และ structure
- ระบุ patterns ที่ใช้บ่อย
- ระบุ quality issues พร้อม priority
- ให้ recommendations ตาม impact

## Expected Outcome

- Project structure ที่ชัดเจน
- Code patterns ที่ใช้บ่อย
- Structure overview ผ่าน `ast-grep outline`
- Quality issues พร้อม priority
- Recommendations ตาม impact
- เลือก tools ที่เหมาะสมกับแต่ละ use case ได้ถูกต้อง
