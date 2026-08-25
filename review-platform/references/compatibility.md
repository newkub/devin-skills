# Compatibility Checks

## Browser Support

1. ตรวจสอบ target browsers ที่รองรับ: ระบุใน `browserslist`, `caniuse`, หรือ config
2. ตรวจสอบ polyfills สำหรับ features ที่ browser เก่าไม่รองรับ
3. ตรวจสอบ feature detection: `typeof`, `in` operator, `@supports`, แทนการสุ่ม browser
4. ตรวจสอบ transpilation config: `target` ใน `tsconfig.json`, `browserslist` ใน Babel/SWC

## Platform Compatibility

1. ตรวจสอบ OS versions ที่รองรับ: Windows, macOS, Linux versions
2. ตรวจสอบ Node.js versions ที่รองรับ: `engines` ใน `package.json`, `.nvmrc`
3. ตรวจสอบ runtime requirements: Bun, Deno, browser extensions, embedded runtime
4. ตรวจสอบ architecture support: x64, arm64, และ cross-compilation config

## API Compatibility

1. ตรวจสอบ deprecated APIs และ migration path
2. ตรวจสอบ vendor prefixes: `-webkit-`, `-moz-`, `-ms-`
3. ตรวจสอบ browser-specific behavior: Safari quirks, Firefox differences, Chrome flags
4. ตรวจสอบ `caniuse` coverage สำหรับ APIs ที่ใช้

## CSS Compatibility

1. ตรวจสอบ flexbox, grid, custom properties การรองรับข้าม browsers
2. ตรวจสอบ `backdrop-filter`, `aspect-ratio`, `gap` ใน flexbox
3. ตรวจสอบ vendor prefixes สำหรับ CSS properties
4. ตรวจสอบ `@supports` fallback สำหรับ features ใหม่

## Severity

- Critical: ใช้ API ที่ browser หลักไม่รองรับ, broken บน target platform, ไม่มี fallback สำหรับ feature สำคัญ
- High: missing polyfill สำหรับ feature สำคัญ, inconsistent behavior ข้าม browsers, deprecated API ที่จะถูก remove
- Medium: suboptimal transpilation target, missing vendor prefix, inconsistent CSS rendering
- Low: minor prefix gap, cosmetic difference ข้าม browsers, documentation gap
