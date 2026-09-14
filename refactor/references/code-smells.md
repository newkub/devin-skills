# Code Smells And Techniques

## Goal

Catalog smell → symptom → refactoring technique — ใช้ตอน Detect Scope/Deep Analysis เพื่อเลือก transformation ที่ตรง root cause ไม่ใช่ patch symptom

## Smell To Technique

| Smell | Symptom | Technique |
|-------|---------|-----------|
| Long Method | function ยาว ทำหลายอย่าง comment เยอะ | Extract Method, Decompose Conditional |
| Long Parameter List | params >3-4 ตัว ส่งชุดเดิมซ้ำ | Introduce Parameter Object, Preserve Whole Object |
| Feature Envy | method ใช้ data ของ class อื่นมากกว่าตัวเอง | Move Method/Field ไป owner ของ data |
| Data Clumps | กลุ่ม fields ติดกันเสมอ (start/end, x/y) | Extract Class / value object |
| Primitive Obsession | string/number แทน domain concept | Replace Primitive with Object (value type) |
| Divergent Change | class เดียวเปลี่ยนจากหลายเหตุ | Extract Class ตาม axis of change (SRP) |
| Shotgun Surgery | เปลี่ยนเรื่องเดียวต้องแก้หลายไฟล์ | Move Method/Field รวมไว้ที่เดียว (SSOT) |
| Duplicated Code | block/logic เดียวกันหลายจุด | Extract Function/Module — canonical เดียวตาม `/follow-single-of-source` |
| Speculative Generality | abstraction ที่ไม่มี consumer จริง | Inline/Collapse — `/dont-over-engineer` |
| Dead Code | unreachable/unused | Remove — `/check-repo-hygiene unused` ยืนยันก่อน |
| Switch/Conditional Sprawl | switch/if-chain กระจายตาม type | Replace Conditional with Polymorphism หรือ dispatch table |
| Comments As Deodorant | comment อธิบาย intent เยอะ | Rename/Extract ให้ code อธิบายตัวเอง ลบ comment |
| Mutable Globals | shared state แก้จากหลายที่ | Encapsulate, inject dependency, narrow scope |
| Leaky Abstraction | caller ต้องรู้ internal detail | แก้ interface boundary — ซ่อน implementation |

## Rules

- เลือก technique ที่แก้ **cause** ของ smell ไม่ใช่ mask symptom
- ทีละ technique เดียว → verify green → commit checkpoint
- smell ที่เป็น emergent (architecture-level) → `/review-architecture` ไม่ใช่ file refactor
