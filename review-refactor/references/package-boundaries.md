# Package/Module Boundary Checks

## Checks

### Boundary Integrity

- pass: แต่ละ module/package มี barrel file (`index.ts`) เป็น public API
- warning: บาง module ไม่มี barrel file
- fail: มี deep imports ข้าม module boundary โดยไม่ผ่าน barrel

### Dependency Direction

- pass: high-level modules พึ่งพา low-level modules เท่านั้น
- warning: มี 1-2 กรณีที่ direction ไม่ชัด
- fail: มี circular dependencies หรือ reverse dependency direction

### Coupling

- pass: low coupling — module พึ่งพากันน้อย
- warning: moderate coupling — มีบางส่วนพึ่งพากัน
- fail: high coupling — module พึ่งพากันมาก ยากต่อการเปลี่ยนแปลง

### Cohesion

- pass: high cohesion — code ใน module เปลี่ยนด้วยกัน, deploy ด้วยกัน
- warning: moderate cohesion — บางส่วนเปลี่ยนแยกกัน
- fail: low cohesion — code ใน module เปลี่ยนแยกกัน, ไม่เกี่ยวข้อง

### Public API Surface

- pass: internal code private, public API ชัดเจนผ่าน barrel exports
- warning: มี internal exports ที่ไม่ควรเป็น public
- fail: ไม่มี boundary ระหว่าง public และ internal

### Module Size

- pass: module มีขนาดเหมาะสม (ไม่ใหญ่เกินไป ไม่เล็กเกินไป)
- warning: module ใหญ่เกินไป หรือเล็กเกินไป (micro-module)
- fail: module ใหญ่มาก หรือ fragmentation สูง

## Detection Tools

- `/scan-codebase` สำหรับ module/package structure
- `sg outline --items imports <paths>` สำหรับ cross-boundary imports
- `madge --circular --extensions ts,tsx` สำหรับ dependency graph
- `/check-code-structure` สำหรับ cohesion analysis

## Refactor Signals

- Refactor: หลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, duplication ข้าม modules
- ไม่ refactor: single responsibility ชัด, cohesive สูง, เปลี่ยนด้วยกัน, deploy ด้วยกัน

## Severity

- Critical: circular dependency, cross-layer import, boundary แตก
- High: high coupling, low cohesion, ไม่มี public API boundary
- Medium: moderate coupling, มี deep imports บางส่วน
- Low: minor boundary inconsistency
