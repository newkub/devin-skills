# TypeScript Declarations

tsdown สร้าง TypeScript declarations อัตโนมัติ

## คุณสมบัติ

- สร้าง `.d.ts` files อัตโนมัติ
- ใช้ Oxc สำหรับความเร็ว
- รองรับ complex types
- ไม่ต้องใช้ tsc แยก

## การเปิดใช้งาน

```typescript
// tsdown.config.ts
export default {
  dts: true, // เปิดใช้งาน TypeScript declarations
}
```

## Output

tsdown จะสร้าง:
- `.d.ts` files สำหรับแต่ละ bundle format
- `.d.mts` สำหรับ ESM
- `.d.cts` สำหรับ CJS

## ประโยชน์

- **ความเร็ว**: Oxc เร็วกว่า tsc
- **ความง่าย**: ไม่ต้อง config แยก
- **ความถูกต้อง**: รองรับ complex types
- **ความสมบูรณ์**: รองรับ all TypeScript features

## การตั้งค่าใน package.json

```json
{
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```
