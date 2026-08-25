# Implementation Gaps Detection Criteria

## Placeholder Patterns

### TODO/FIXME/HACK Comments

- สแกนหา `TODO`, `FIXME`, `HACK`, `XXX`, `WARN` comments ใน source code
- ระบุ context: อยู่ใน function, class, module ใด
- ระบุ critical path: อยู่ใน production path หรือ non-critical path

### MOCK/FAKE/STUB Implementations

- สแกนหา `MOCK`, `FAKE`, `STUB`, `mock`, `fake`, `stub` patterns
- ตรวจสอบ: อยู่ใน `mock/` directory (acceptable) หรือใน production path (critical)
- ระบุ: function ที่ return hardcoded data แทน real implementation
- ระบุ: interface ที่มี empty implementation หรือ `throw new Error('not implemented')`

### Placeholder Code

- สแกนหา `placeholder`, `not implemented`, `coming soon`, `WIP`, `TBD`
- ตรวจสอบ: function ที่ return empty array, null, หรือ default value โดยไม่มี logic
- ตรวจสอบ: component ที่ render placeholder text แทน real content

## Unfinished Features

- ตรวจหา unimplemented interfaces: interface ที่ประกาศแต่ไม่มี implementation
- ตรวจหา missing types: type definitions ที่อ้างถึง types ที่ไม่มี
- ตรวจหา missing error handling: try/catch ที่ catch แล้วไม่ handle หรือ swallow errors

## Detection Tools

- `/deep-analyze` สำหรับวิเคราะห์หลายมิติ
- `/run-review` สำหรับรัน review CLI
- `sg` (ast-grep) สำหรับ pattern matching
- `grep` สำหรับ text pattern search

## Severity

- Critical: MOCK/FAKE/STUB ใน production path, core feature ไม่สมบูรณ์
- High: STUB ที่ถูกเรียกใช้, error handling ไม่สมบูรณ์
- Medium: TODO ใน non-critical path, partial implementation
- Low: FIXME ใน non-critical path, cosmetic placeholder
