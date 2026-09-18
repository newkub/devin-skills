# Modularity Checks

## Goal

ตรวจสอบ module boundaries, cohesion, coupling, single responsibility, และ modularity patterns

## Checks

### Module Boundaries

1. แต่ละ module มี public API ชัดเจนและเก็บ implementation details ไว้ภายใน
2. ไม่มี internal symbols ถูก import โดย module อื่น
3. layer boundaries (presentation, domain, data, infrastructure) ไม่มี bypass
4. exports ไม่ over-granular หรือ over-exposed
5. barrel exports ไม่ซ่อน circular dependencies

### Cohesion

1. แต่ละ module มี single responsibility หรือ single reason to change
2. members ใน module เกี่ยวข้องกับ feature หรือ function เดียวกัน
3. ไม่มี God module ที่รวม concerns ต่างกัน
4. feature-based folders หรือ vertical slices จัดกลุ่ม code ตาม feature
5. shared utilities แยกออกจาก business modules

### Coupling

1. dependencies ระหว่าง modules มีทิศทางชัดเจนและสอดคล้องกับ architecture
2. ไม่มี circular dependencies ระหว่าง modules
3. fan-in/fan-out อยู่ในระดับที่ยอมรับได้
4. high-level modules ไม่ขึ้นกับ low-level modules โดยตรง (dependency inversion)
5. ใช้ abstractions/interfaces สำหรับ dependencies ระหว่าง modules เมื่อเหมาะสม

### Modularity Patterns

1. barrel exports ใช้อย่างสม่ำเสมอ
2. feature-based folders จัดกลุ่ม code ตาม feature
3. vertical slices แยก feature อย่างชัดเจน
4. package-by-feature consistency

### Module Size

1. files เกิน 250 บรรทัด → flag
2. modules ที่รวมหลาย feature → flag

## Severity

- Critical: circular dependency ระหว่าง core modules, God module ที่รวมทุก concern, public API ที่ leak internal state, layer boundary bypass ใน critical path
- High: tight coupling ระหว่าง modules, SRP violation ใน module หลัก, missing dependency inversion, high fan-in/fan-out ที่ก่อ fragility
- Medium: mixed concerns ใน module, unclear public API, moderate circular dependency, inconsistent modularity patterns
- Low: minor export granularity issue, naming, missing barrel export
