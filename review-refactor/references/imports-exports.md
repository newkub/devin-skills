# Import/Export Complexity Checks

## Checks

### Relative Import Complexity

- pass: ไม่มี relative imports ที่ซับซ้อน (`../../../`)
- warning: มี `../../` 1-2 ครั้ง
- fail: มี `../../../` หรือลึกกว่า

### Barrel Export Quality

- pass: barrel file มีเฉพาะ re-exports ไม่มี logic, ไม่มี side effects
- warning: barrel file มี `export *` จาก module ที่มี exports จำนวนมาก
- fail: barrel file มี logic, side effects, หรือ import และ re-export ในบรรทัดเดียวกัน

### Circular Dependencies

- pass: ไม่มี circular dependencies
- fail: มี circular dependencies ใดๆ

### Unused Exports

- pass: ไม่มี unused exports
- warning: มี unused exports 1-3 ตัว
- fail: มี unused exports >3 ตัว

### Import Ordering

- pass: external → internal alias → relative → type-only
- warning: ไม่ได้เรียงตามลำดับแต่ consistent
- fail: ไม่ได้เรียงและ inconsistent

### Deep Imports

- pass: ใช้ barrel exports ไม่มี deep imports ข้าม module boundary
- warning: มี deep imports 1-2 ครั้ง
- fail: มี deep imports ข้าม module boundary หลายครั้ง

## Detection Tools

- `sg outline --items imports <paths>` สำหรับ import patterns
- `sg outline --items exports <paths>` สำหรับ exported surface
- `madge --circular --extensions ts,tsx` สำหรับ circular dependencies
- `knip` สำหรับ unused exports
- `biome` หรือ `eslint` สำหรับ import ordering

## Severity

- Critical: circular dependency, barrel file ที่มี side effects
- High: `../../../` imports จำนวนมาก, unused exports จำนวนมาก
- Medium: import ordering ไม่ consistent, `export *` จาก module ใหญ่
- Low: minor ordering inconsistency
