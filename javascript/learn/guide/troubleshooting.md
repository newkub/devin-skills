# Troubleshooting

## Common Issues

### Runtime Errors

- **Undefined is not a function** - ตรวจสอบว่า function ถูก define ก่อนเรียก
- **Cannot read property of undefined** - ตรวจสอบ optional chaining ด้วย `?.`
- **this is undefined** - ตรวจสอบ arrow functions และ context binding

### Asynchronous Issues

- **Race Conditions** - ใช้ async/await และ promises อย่างถูกต้อง
- **Callback Hell** - ใช้ async/await หรือ promises แทน callbacks
- **Memory Leaks** - cleanup listeners และ intervals

### Browser Compatibility

- **ES6+ Features** - ใช้ Babel สำหรับ transpilation
- **Polyfills** - เพิ่ม polyfills สำหรับ older browsers
- **Feature Detection** - ใช้ feature detection แทน browser detection

### Performance Issues

- **Event Loop Blocking** - ใช้ Web Workers สำหรับ heavy computations
- **Memory Leaks** - ตรวจสอบ closures และ global variables
- **Large Bundle Size** - ใช้ code splitting และ tree shaking
