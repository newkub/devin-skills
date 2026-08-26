# Analyzer Structure And Coverage

## Required Analyzer Files

ตรวจว่า `src/domain/analyzers/` มี analyzer files ครบ 5 ไฟล์:

- `user-facing.ts` — UX, accessibility, UI patterns
- `security.ts` — security vulnerabilities, auth, input validation
- `backend-data.ts` — data layer, API, database
- `infrastructure.ts` — deployment, CI/CD, config
- `code-arch.ts` — code quality, architecture, patterns

ถ้าขาด analyzer file → flag เป็น `High` severity

## CategoryResult Contract

ตรวจว่าทุก analyzer return `CategoryResult` พร้อม fields:

- `status` — `pass` | `fail` | `warn`
- `score` — ตัวเลข 0-100
- `findings` — array ของ finding objects

ถ้า analyzer ไม่ return `CategoryResult` → flag เป็น `High` severity

## Review Workflow Map

ตรวจว่าทุก analyzer มี `reviewWorkflow` map:

- map จาก category ไปยัง `/update-review-cli-and-run` หรือ references
- ระบุ action ที่ต้องทำเมื่อพบ issue

ถ้าขาด `reviewWorkflow` → flag เป็น `Medium` severity

## Shared Utilities

ตรวจว่า analyzers ใช้ shared utilities จาก `src/adapters/`:

- ห้าม duplicate utility code ระหว่าง analyzer files
- ใช้ shared helpers สำหรับ file reading, pattern matching, scoring

ถ้าพบ duplicated code → flag เป็น `Medium` severity

## Category Coverage

ตรวจว่ามี 60+ categories จาก `/run-review`:

- อ่าน `run-review` เพื่อทราบ category list ทั้งหมด
- ตรวจว่า analyzers ครอบคลุม categories ครบ

ถ้า category coverage ไม่ครบ → flag เป็น `Medium` severity

## Domain Coverage

ตรวจว่ามี 5 domains ครบ:

- `user-facing`
- `security`
- `backend-data`
- `infrastructure`
- `code-arch`

ถ้าขาด domain → flag เป็น `High` severity

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review-codebase/src/domain/analyzers/security.ts`
- line number
- code snippet ที่เป็นปัญหา
