# Best Practices

## แนวทางปฏิบัติที่ดีกับ tsdown

### 1. Package.json Configuration

**✅ ดี:**
```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "prepublishOnly": "bun run build"
  }
}
```

**❌ ไม่ดี:**
```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.esm.js"
}
```

### 2. Entry Point Organization

**✅ ดี:**
```
src/
├── index.ts          # Main entry
├── utils/
│   └── index.ts      # Utils entry
└── types/
    └── index.ts      # Types entry
```

**❌ ไม่ดี:**
```
src/
├── main.ts
├── helper.ts
└── stuff.ts
```

### 3. External Dependencies

**✅ ดี:**
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  external: [
    'react',
    'react-dom',
    'lodash',
  ],
});
```

**❌ ไม่ดี:**
```typescript
// ไม่ต้อง bundle dependencies ที่มีขนาดใหญ่
// ให้ user install เอง
```

### 4. TypeScript Configuration

**✅ ดี:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

### 5. Build Scripts

**✅ ดี:**
```json
{
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "prepublishOnly": "bun run build",
    "typecheck": "tsc --noEmit"
  }
}
```

**❌ ไม่ดี:**
```json
{
  "scripts": {
    "build": "tsc && rollup -c"
  }
}
```

### 6. Source Maps

**✅ ดี:**
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  sourcemap: true,  // Production
});
```

**❌ ไม่ดี:**
```typescript
// ไม่สร้าง source maps ใน production
```

### 7. Clean Builds

**✅ ดี:**
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,  // Clean ก่อน build
});
```

**❌ ไม่ดี:**
```typescript
// ไม่ clean ทำให้มีไฟล์เก่าค้างอยู่
```

### 8. Multiple Formats

**✅ ดี:**
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['esm', 'cjs'],  // รองรับทั้งสอง formats
});
```

**❌ ไม่ดี:**
```typescript
// Export เฉพาะ ESM จะทำให้ใช้ไม่ได้ในบาง environments
```

### 9. Path Aliases

**✅ ดี:**
```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';
import path from 'path';

export default defineConfig({
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    }),
  ],
});
```

### 10. CI/CD Integration

**✅ ดี:**
```yaml
# .github/workflows/build.yml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run typecheck
```

### 11. Testing

**✅ ดี:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### 12. Documentation

**✅ ดี:**
```typescript
/**
 * Adds two numbers together
 * @param a - First number
 * @param b - Second number
 * @returns Sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

### 13. Version Management

**✅ ดี:**
```json
{
  "scripts": {
    "release": "bunx release-it",
    "version": "bun run build && git add dist"
  }
}
```

### 14. Monorepo Best Practices

**✅ ดี:**
```json
{
  "scripts": {
    "build": "tsdown",
    "build:all": "bun run build --filter=...*"
  }
}
```

### 15. Performance Tips

- ใช้ `external` สำหรับ dependencies ที่มีขนาดใหญ่
- ใช้ watch mode สำหรับ development
- ใช้ parallel builds สำหรับ monorepos
- เปิด source maps เฉพาะเมื่อจำเป็น
