# Import And Export Review

## Goal

ตรวจสอบ import/export strategy, barrel exports, import aliases, import ordering, circular dependencies และ tree-shaking

## Checks

### Module Boundaries

1. Public API แยกจาก internal implementation ชัดเจน
2. Barrel file มีเฉพาะ re-exports ไม่มี logic หรือ side effects
3. ใช้ `export ... from` แทน re-export ผ่าน `import` แล้ว `export`
4. แยก `export type` ออกจาก runtime exports
5. ไม่ export default จาก barrel file

### Import Aliases

1. `tsconfig.json` paths ตั้งไว้สอดคล้องกับ framework config
2. ใช้ `#` prefix สำหรับ TypeScript, `@/` สำหรับ framework aliases
3. ไม่มี relative paths ที่ซับซ้อน (`../../../`)

### Import Ordering

1. ลำดับ: external → internal alias → relative → type-only
2. จัดกลุ่ม imports ด้วย blank line
3. ไม่มี duplicate imports จาก same module
4. ใช้ type-only imports สำหรับ types

### Circular Dependencies

1. ไม่มี barrel file ที่ import กันและกันระหว่าง sibling modules
2. แยก shared types ออกเป็นไฟล์ต่างหากเมื่อจำเป็น
3. ใช้ `madge --circular --extensions ts,tsx` ตรวจสอบ

### Performance

1. ไม่มี unused imports/exports
2. ไม่มี side effects ใน barrel file
3. ใช้ named exports แทน `export *` ทั้งหมด
4. พิจารณา dynamic imports สำหรับ large modules

## Severity

- Critical: circular dependency ระหว่าง core modules, barrel file มี side effects, import ทั้ง folder โดยไม่จำเป็น
- High: relative paths ซับซ้อน, alias ไม่สอดคล้อง, missing type-only imports
- Medium: import ordering ไม่สม่ำเสมอ, unused exports
- Low: blank line grouping ขาด, alphabetical order ไม่สม่ำเสมอ
