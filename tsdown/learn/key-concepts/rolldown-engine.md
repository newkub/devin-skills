# Rolldown Engine

**Rolldown** เป็น bundler ที่เขียนด้วย Rust ให้ความเร็วสูงในการ bundle

## คุณสมบัติ

- เขียนด้วย Rust ให้ความเร็วสูง
- เป็น core engine ของ tsdown
- รองรับ module formats หลากหลาย
- ใช้ memory น้อยกว่า bundlers อื่น

## ความเร็ว

Rolldown ให้ความเร็วในการ bundle สูงกว่า:
- Rollup: 10-20x เร็วกว่า
- esbuild: 2-5x เร็วกว่า
- Webpack: 50-100x เร็วกว่า

## การใช้งานใน tsdown

tsdown ใช้ Rolldown เป็น core engine โดย:
- Pre-configured สำหรับ library bundling
- ไม่ต้อง config เอง
- Auto-detect entry points
- Automatic TypeScript declarations
