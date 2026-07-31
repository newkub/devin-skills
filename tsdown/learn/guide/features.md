# Features

## ฟีเจอร์หลักของ tsdown

### 1. Blazing Fast Performance
- ใช้ Rolldown (Rust-based bundler) ที่เร็วมาก
- ใช้ Oxc สำหรับ declaration generation
- Parallel processing สำหรับ large projects

### 2. Multiple Format Support
| Format | Extension | Use Case |
|--------|-----------|----------|
| ESM | `.mjs` | Modern browsers, Node.js, bundlers |
| CJS | `.cjs` | Legacy Node.js environments |
| IIFE | `.global.js` | Browser direct usage |
| UMD | `.umd.js` | Universal usage (Node + Browser) |

### 3. Automatic TypeScript Declarations
- สร้าง `.d.ts` files อัตโนมัติ
- รองรับ complex types
- รักษา type safety
- ไม่ต้องใช้ `tsc --emitDeclarationOnly`

### 4. Powerful Plugin Ecosystem
- รองรับ Rollup plugins
- รองรับ unplugin (universal plugin)
- รองรับบาง Vite plugins
- Easy integration กับ tools อื่นๆ

### 5. Zero Configuration
- Pre-configured สำหรับ libraries
- Auto-detect entry points
- Smart defaults
- Minimal setup required

### 6. Tree Shaking
- ลบ code ที่ไม่ได้ใช้ออก
- Reduce bundle size
- Optimize dependencies
- Dead code elimination

### 7. Source Maps
- สร้าง source maps อัตโนมัติ
- Debugging ง่าย
- Support ทั้ง development และ production

### 8. Watch Mode
- Auto-rebuild เมื่อมีการเปลี่ยนแปลง
- Fast incremental builds
- Ideal สำหรับ development

### 9. TypeScript Support
- Full TypeScript support
- Type checking
- Path aliases
- Project references

### 10. Monorepo Support
- รองรับ monorepos (bun, yarn workspaces)
- Shared configurations
- Efficient caching
- Parallel builds

## ฟีเจอร์เพิ่มเติม

### Code Splitting
- Split code ออกเป็น chunks
- Lazy loading
- Dynamic imports

### Minification
- Reduce bundle size
- Remove whitespace
- Optimize code

### External Dependencies
- Mark dependencies as external
- Reduce bundle size
- Avoid bundling node_modules

### Entry Points
- Multiple entry points
- Auto-detection
- Custom entry points

### Target Environments
- ES2015, ES2020, ESNext
- Node.js versions
- Browser targets
