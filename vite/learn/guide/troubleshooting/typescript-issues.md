# TypeScript Issues

## 1. Type Errors

**Problem:**
TypeScript errors ใน Vite

**Solution:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": false,  // Temporarily disable strict mode
    "skipLibCheck": true,
  }
}
```

## 2. Module Declaration Errors

**Problem:**
Cannot find module declarations

**Solution:**
```typescript
// vite-env.d.ts
/// <reference types="vite/client" />
```
