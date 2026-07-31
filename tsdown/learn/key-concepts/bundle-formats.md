# Bundle Formats

tsdown รองรับ module formats หลากหลายสำหรับ libraries

## รูปแบบที่รองรับ

### ESM (ES Modules)
- สำหรับ modern browsers และ Node.js
- ใช้ `import` และ `export`
- เป็น format มาตรฐานปัจจุบัน
- ขอแนะนำสำหรับ libraries ใหม่

### CJS (CommonJS)
- สำหรับ legacy Node.js
- ใช้ `require` และ `module.exports`
- จำเป็นสำหรับ backward compatibility
- ใช้สำหรับ Node.js < 12

### IIFE (Immediately Invoked Function Expression)
- สำหรับ browser โดยตรง
- ไม่ต้องใช้ module loader
- เหมาะสำหรับ CDN usage
- Bundle เป็น single file

### UMD (Universal Module Definition)
- รองรับทุก environment
- ทำงานได้ทั้ง AMD, CommonJS, และ global variables
- ใช้สำหรับ libraries ที่ต้องการ maximum compatibility
- Bundle size ใหญ่กว่า formats อื่น

## การเลือก Format

| Use Case | Format |
|----------|--------|
| Modern libraries | ESM |
| Legacy Node.js | CJS |
| Browser CDN | IIFE |
| Maximum compatibility | UMD |

## การตั้งค่าใน tsdown

```typescript
// tsdown.config.ts
export default {
  format: ['esm', 'cjs'], // Bundle เป็น ESM และ CJS
}
```
