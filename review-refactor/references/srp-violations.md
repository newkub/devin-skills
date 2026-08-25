# SRP Violations Detection Criteria

## Detection Criteria

### File-Level SRP Violations

- ไฟล์มี top-level symbols เกิน 5 อันที่ไม่เกี่ยวข้องกัน
- ไฟล์มี symbols จากหลาย domain หรือ layer ปนกัน
- ไฟล์มี exports ที่ไม่ควรเป็น public (internal utilities, helper types)
- ไฟล์มี imports ข้าม boundary หรือ layer

### Function-Level SRP Violations

- function ทำหลาย operation (read + write + validate + transform)
- function มีหลาย reasons to change
- function มี body ที่ mix concerns ของหลาย domain

### Class/Type-Level SRP Violations

- class/type มี public members เกิน 10
- class/type ทำหลายหน้าที่ (God class)
- class/type มี methods จากหลาย domain

## Detection Tools

- `sg outline --view expanded --items structure <paths>` สำหรับ top-level symbols
- `sg outline --items imports <paths>` สำหรับ import boundary crossing
- `sg outline --items exports <paths>` สำหรับ exported surface
- `sg outline --pub-members <paths>` สำหรับ public members

## Violation Patterns

- Mixed concerns: file มีทั้ง domain logic, UI, utils, types
- Cross-layer import: domain import UI, UI import infrastructure
- Leaky abstraction: internal exports ที่ไม่ควรเป็น public API
- God class: class ที่รวมหลาย responsibilities

## Severity

- Critical: SRP violation ใน critical path, cross-layer import, circular dependency
- High: file เกิน 5 top-level symbols ที่ไม่เกี่ยวข้อง, type/class เกิน 10 public members
- Medium: file มี 4-5 top-level symbols, type มี 6-10 members
- Low: naming ไม่สะท้อน responsibility
