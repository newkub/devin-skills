---
name: follow-tool-clippy
description: ตั้งค่า Clippy lint rules และ error handling standards
argument-hint: "[scope]"
related:
  - analyze-project
  - run-verify
---

## Goal

ตั้งค่า Clippy lint rules และ error handling standards เพื่อลด manual error fixing

## Scope

ใช้ `follow-tool-clippy` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

### 1. Analyze Project

> Goal: ตรวจสอบโครงสร้าง project และ config ที่มีอยู่

1. รัน `/analyze-project` เพื่อดูโครงสร้างโปรเจกต์
2. ตรวจสอบ `Cargo.toml` ที่มีอยู่
3. ตรวจสอบว่ามี `clippy.toml` หรือไม่
4. ตรวจสอบ workspace configuration

### 2. Setup Clippy Configuration

> Goal: สร้าง `clippy.toml` พร้อม lint categories และ thresholds

1. สร้าง `clippy.toml` ที่ root ของ workspace หรือ crate
2. ตั้งค่า lint categories ที่เหมาะสม:
   - `correctness`: deny (catch bugs)
   - `style`: warn (code style)
   - `complexity`: warn (simplify code)
   - `suspicious`: warn (potential issues)
   - `restriction`: allow (optional strict rules)
   - `pedantic`: allow (opinionated rules)
3. ตั้งค่า lint configuration options เช่น:
   - `too-many-arguments-threshold`: 7
   - `type-complexity-threshold`: 250
   - `cognitive-complexity-threshold`: 30
4. เพิ่ม exceptions สำหรับ test code:
   - `allow-unwrap-in-tests = true`
   - `allow-panic-in-tests = true`
   - `allow-dbg-in-tests = true`

### 3. Setup Error Handling Standards

> Goal: กำหนดมาตรฐาน error handling สำหรับ Rust code

1. สร้าง error type ที่เป็นมาตรฐาน (ใช้ `thiserror` หรือ `anyhow`)
2. ใช้ `Result<T, E>` แทนการ unwrap ใน production code
3. เพิ่ม lint rules สำหรับ error handling:
   - `unwrap_used = "deny"`
   - `expect_used = "warn"`
   - `panic = "warn"`
4. ตั้งค่า `missing-docs-in-private-items = false` ถ้าจำเป็น

### 4. Verify Configuration

> Goal: รัน verification เพื่อยืนยัน lint rules ทำงานถูกต้อง

1. รัน `cargo clippy --all-targets -- -D warnings`
2. ตรวจสอบว่า lint rules ทำงานได้ถูกต้อง
3. แก้ไข warnings ที่เกิดขึ้น
4. รัน `/run-verify` เพื่อยืนยันว่าทุกอย่างทำงานได้

## Rules

### 1. Lint Categories

- correctness: deny เสมอ (catch bugs ที่แน่นอน)
- suspicious: warn (potential issues ที่อาจเป็น bug)
- style: warn (code style consistency)
- complexity: warn (simplify complex code)
- perf: warn (performance optimizations)
- restriction: allow (optional strict rules)
- pedantic: allow (opinionated rules ใช้เฉพาะที่ต้องการ)
- nursery: allow (experimental lints)

### 2. Configuration Thresholds

```toml
too-many-arguments-threshold = 7
type-complexity-threshold = 250
cognitive-complexity-threshold = 30
max-struct-bools = 3
max-fn-params-bools = 3
```

### 3. Test Exceptions

```toml
allow-unwrap-in-tests = true
allow-panic-in-tests = true
allow-dbg-in-tests = true
allow-print-in-tests = true
allow-mixed-uninlined-format-args = true
```

### 4. Error Handling Standards

- ห้ามใช้ `unwrap()` ใน production code
- ใช้ `expect()` เฉพาะกรณีที่ควร panic จริงๆ
- ใช้ `Result<T, E>` สำหรับ error handling
- ใช้ `thiserror` สำหรับ custom error types
- ใช้ `anyhow` สำหรับ application-level errors

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Clippy lint rules ตั้งค่าอัตโนมัติ
- Error handling standards ถูกนำไปใช้
- ลดการแก้ error แบบ manual
- Code quality สม่ำเสมอทั่วทั้งโปรเจกต์