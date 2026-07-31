# Key Concept

**tsdown** เป็น library bundler ที่ใช้ Rolldown (Rust-based) สำหรับสร้าง bundle TypeScript/JavaScript libraries อย่างรวดเร็ว

## หลักการสำคัญ

### 1. Rolldown Engine
- เขียนด้วย Rust ให้ความเร็วสูง
- เป็น core engine ของ tsdown
- รองรับ module formats หลากหลาย

### 2. Format Support
- **ESM** - ES Modules (สำหรับ modern browsers and Node.js)
- **CJS** - CommonJS (สำหรับ legacy Node.js)
- **IIFE** - Immediately Invoked Function Expression (สำหรับ browser)
- **UMD** - Universal Module Definition (รองรับทุก environment)

### 3. TypeScript Declarations
- สร้าง `.d.ts` files อัตโนมัติ
- ใช้ Oxc สำหรับความเร็ว
- รองรับ complex types

### 4. Plugin Ecosystem
- รองรับ Rollup plugins
- รองรับ unplugin
- รองรับบาง Vite plugins

## ความแตกต่างจาก Rolldown

| Feature | Rolldown | tsdown |
|---------|----------|--------|
| Target | General purpose bundler | Library bundler โดยเฉพาะ |
| Configuration | ต้อง config เอง | Pre-configured สำหรับ libraries |
| DTS Generation | Manual | Automatic |
| Formats | ทั้งหมด | เน้น library formats (ESM, CJS, IIFE, UMD) |
