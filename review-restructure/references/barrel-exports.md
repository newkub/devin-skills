# Barrel Export And Alias Complexity Checks

## Barrel Export Checks

### Barrel File Quality

- pass: barrel file มีเฉพาะ re-exports ไม่มี logic, ไม่มี side effects
- warning: barrel file มี `export *` จาก module ที่มี exports จำนวนมาก
- fail: barrel file มี logic, side effects, หรือ import และ re-export ในบรรทัดเดียวกัน

### Export Strategy

- pass: ใช้ named exports, ซ่อน internal symbols
- warning: มี `export default` จาก barrel file
- fail: ใช้ `export *` แบบไม่เลือกจาก module ใหญ่

### Type-Only Exports

- pass: แยก `export type` จาก `export` ธรรมดา
- warning: ไม่ได้แยกแต่ยังใช้ได้
- fail: ไม่มี type-only exports ทั้งที่ควรมี

### Barrel Coverage

- pass: ทุก module ที่มีหลายไฟล์มี barrel file
- warning: บาง module ไม่มี barrel file
- fail: ไม่มี barrel file ทั้งโปรเจกต์

## Import Alias Complexity Checks

### Relative Import Complexity

- pass: ไม่มี `../../../` imports
- warning: มี `../../` 1-2 ครั้ง
- fail: มี `../../../` หรือลึกกว่า

### Alias Configuration

- pass: alias ตั้งค่าใน `tsconfig.json`, `vite.config.ts`, `package.json` สอดคล้องกัน
- warning: alias ตั้งค่าในบาง config แต่ไม่ครบ
- fail: ไม่มี alias configuration

### Alias Naming

- pass: ใช้ naming conventions สม่ำเสมอ (`#` prefix สำหรับ TypeScript, `@/` สำหรับ frameworks)
- warning: ใช้ naming ไม่สม่ำเสมอ
- fail: ไม่มี naming convention

### Deep Imports

- pass: ใช้ barrel imports ไม่มี deep imports ข้าม module
- warning: มี deep imports 1-2 ครั้ง
- fail: มี deep imports ข้าม module จำนวนมาก

## Detection Tools

- `sg outline --items imports <paths>` สำหรับ import patterns
- `sg outline --items exports <paths>` สำหรับ exported surface
- `madge --circular --extensions ts,tsx` สำหรับ circular dependencies
- `/follow-import-export` สำหรับ comprehensive import/export analysis

## Severity

- Critical: circular dependency, barrel file ที่มี side effects
- High: `../../../` imports จำนวนมาก, ไม่มี alias configuration
- Medium: import ordering ไม่ consistent, `export *` จาก module ใหญ่
- Low: minor alias naming inconsistency
