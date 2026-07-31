# Bundle Formats

## Supported Formats

Bunup รองรับหลาย formats:
- **ESM** - ES Modules (.mjs)
- **CJS** - CommonJS (.js)
- **IIFE** - Immediately Invoked Function Expression
- **UMD** - Universal Module Definition

## Format Selection

```typescript
export default {
  format: ['esm', 'cjs'], // Multiple formats
};
```

## Conditional Exports

ใช้ conditional exports ใน package.json:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```
