# Tree Shaking

## Purpose

เข้าใจวิธีการ tree-shaking ใน Rolldown เพื่อลดขนาด bundle โดยลบ code ที่ไม่ถูกใช้

## Scope

- Tree-shaking algorithm
- Side effects
- Module annotations
- Configuration options

## Overview

Tree-shaking คือการลบ code ที่ไม่ถูกใช้ (dead code) ออกจาก bundle

```typescript
// Before Tree Shaking
export const used = 'used'
export const unused = 'unused'

// After Tree Shaking
export const used = 'used' // unused ถูกลบ
```

## How Tree Shaking Works

### 1. Symbol Analysis

Rolldown ติดตาม symbols จาก entry points:

```typescript
// main.ts (entry)
import { foo } from './utils'

// utils.ts
export const foo = 'foo'      // ถูกใช้ → รักษา
export const bar = 'bar'      // ไม่ถูกใช้ → ลบ
export const baz = 'baz'      // ไม่ถูกใช้ → ลบ
```

### 2. Statement Marking

แต่ละ statement ถูก mark ว่าถูกใช้หรือไม่:

```typescript
// StmtInfo
{
  sideEffects: false,
  references: [SymbolRef(...)],
  included: true  // ถูกใช้
}
```

### 3. Dead Code Elimination

Statements ที่ไม่ถูกใช้ถูกลบ:

```typescript
// Before
export function used() { return 'used' }
export function unused() { return 'unused' }

// After
export function used() { return 'used' }
```

## Side Effects

Side effects คือ effects ที่เกิดขึ้นเมื่อ module ถูก evaluate:

```typescript
// Has side effects
console.log('Module loaded')
window.globalVar = 'value'

// No side effects
export const value = 'value'
export function fn() {}
```

### Module Side Effects Options

```typescript
export default defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external', // default
  },
})
```

| Option | Description |
|--------|-------------|
| `'all'` | ทุก modules มี side effects (ไม่ tree-shake) |
| `'no-external'` | เฉพาะ external modules มี side effects |
| `false` | ไม่มี side effects (tree-shake ทั้งหมด) |

### Package Annotations

**package.json:**
```json
{
  "name": "my-package",
  "sideEffects": false
}
```

**Selective Side Effects:**
```json
{
  "sideEffects": [
    "./src/polyfill.ts",
    "*.css"
  ]
}
```

## Tree Shaking Options

### Enable/Disable

```typescript
export default defineConfig({
  treeshake: true,   // enable (default)
  treeshake: false,  // disable
})
```

### Tree-shake Literals

```typescript
export default defineConfig({
  treeshake: {
    treeshakeLiterals: true,  // default
  },
})
```

Tree-shake object literals ที่ไม่ถูกใช้:

```typescript
// Before
const config = { foo: 'foo', bar: 'bar' }
export const used = config.foo

// After
const config = { foo: 'foo' }  // bar ถูกลบ
export const used = config.foo
```

### Tree-shake Class Static Blocks

```typescript
export default defineConfig({
  treeshake: {
    treeshakeClassStaticBlocks: true,  // default
  },
})
```

## Common Patterns

### Re-export Tree Shaking

```typescript
// utils.ts
export const foo = 'foo'
export const bar = 'bar'

// index.ts
export * from './utils'

// main.ts
import { foo } from './index'

// Result: bar ถูก tree-shake ออก
```

### Property Access Tree Shaking

```typescript
// object.ts
export const obj = {
  foo: 'foo',
  bar: 'bar',
}

// main.ts
import { obj } from './object'
console.log(obj.foo)

// Result: bar ถูก tree-shake ออก (ถ้า treeshakeLiterals: true)
```

### Class Method Tree Shaking

```typescript
// class.ts
export class MyClass {
  used() { return 'used' }
  unused() { return 'unused' }
}

// main.ts
import { MyClass } from './class'
const instance = new MyClass()
instance.used()

// Result: unused() ถูก tree-shake ออก
```

## Limitations

### Dynamic Imports

Dynamic imports ไม่สามารถ tree-shake:

```typescript
// Cannot tree-shake
const module = await import('./utils')
```

### Side Effects

Modules ที่มี side effects ไม่สามารถ tree-shake:

```typescript
// Cannot tree-shake
console.log('Side effect')
export const value = 'value'
```

### Global Mutations

Mutations ที่ global ไม่สามารถ tree-shake:

```typescript
// Cannot tree-shake
window.globalVar = 'value'
```

## Best Practices

1. **Use ES Modules**: Tree-shaking ทำงานได้ดีกับ ES Modules
   ```typescript
   // Good
   export const foo = 'foo'

   // Bad (CommonJS)
   module.exports.foo = 'foo'
   ```

2. **Avoid Side Effects**: หลีกเลี่ยง side effects ใน modules
   ```typescript
   // Good
   export const value = 'value'

   // Bad
   console.log('Side effect')
   export const value = 'value'
   ```

3. **Annotate Side Effects**: ระบุ side effects ใน package.json
   ```json
   {
     "sideEffects": false
   }
   ```

4. **Use Re-exports**: ใช้ re-exports สำหรับ barrel files
   ```typescript
   // index.ts
   export * from './utils'
   export * from './components'
   ```

## Debugging Tree Shaking

### Visualize Output

ตรวจสอบ output เพื่อดูว่าอะไรถูก tree-shake:

```bash
bunx rolldown --config rolldown.config.ts
```

### Use Source Maps

Source maps ช่วย debug ว่า code มาจากไหน:

```typescript
export default defineConfig({
  output: {
    sourcemap: true,
  },
})
```

## Comparison

| Feature | Rolldown | Rollup | esbuild |
|---------|----------|--------|---------|
| Tree Shaking | Advanced | Advanced | Basic |
| Side Effects | Yes | Yes | Limited |
| Property Access | Yes | Yes | No |
| Class Methods | Yes | Yes | Limited |

## Summary

| Concept | Description |
|---------|-------------|
| **Symbol Analysis** | ติดตาม symbols จาก entry points |
| **Side Effects** | Effects ที่เกิดเมื่อ module ถูก evaluate |
| **Dead Code Elimination** | ลบ code ที่ไม่ถูกใช้ |
| **Module Annotations** | ระบุ side effects ใน package.json |

## See Also

- [Three-Stage Pipeline](./three-stage-pipeline.md)
- [Code Splitting](./code-splitting.md)
- [Configuration Reference](../../references/configuration.md)
