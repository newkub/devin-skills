---
title: Performance
description: คุณสมบัติด้านประสิทธิภาพและการ optimize สำหรับ ArkType
---

## Performance

คุณสมบัติด้านประสิทธิภาพของ ArkType และวิธีการ optimize

## Performance Characteristics

### ความเร็ว

ArkType มีความเร็ว 20x กว่า Zod เนื่องจาก:

1. **Type-based compilation** - Compile schemas ล่วงหน้า
2. **Minimal runtime overhead** - ไม่มี validation chain ซับซ้อน
3. **Optimized parsers** - Parsers ที่ optimize ไว้เฉพาะ

### Benchmark

| Library | Ops/sec | Relative |
|---------|---------|----------|
| ArkType | 1,000,000+ | 20x |
| Zod | 50,000 | 1x |
| Yup | 30,000 | 0.6x |

## Optimization Strategies

### 1. Schema Compilation

#### Compile Schemas ล่วงหน้า

```typescript
// ❌ ไม่ดี - Compile ทุกครั้ง
const validate = (data) => {
  const schema = type({...}) // Compile ทุกครั้ง
  return schema(data)
}

// ✅ ดี - Compile ครั้งเดียว
const UserSchema = type({...}) // Compile ครั้งเดียว
const validate = (data) => UserSchema(data)
```

#### Reuse Compiled Schemas

```typescript
// ✅ ดี - Reuse schemas
const schemas = {
  user: type({...}),
  product: type({...})
}

const validateUser = (data) => schemas.user(data)
const validateProduct = (data) => schemas.product(data)
```

### 2. Type Inference

#### ใช้ Inferred Types

```typescript
// ✅ ดี - ใช้ inferred types
const UserSchema = type({...})
type User = typeof UserSchema.infer

// ใช้ type แทนการ define ซ้ำ
function processUser(user: User) {
  // ...
}
```

### 3. Minimal Validation

#### Validate เฉพาะที่จำเป็น

```typescript
// ❌ ไม่ดี - Validate ทุกอย่าง
const FullSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    zip: 'string'
  }
})

// ✅ ดี - Validate เฉพาะที่จำเป็น
const MinimalSchema = type({
  email: 'string.email',
  age: 'number'
})
```

### 4. Avoid Deep Nesting

#### ลด nesting ลึกเกินไป

```typescript
// ❌ ไม่ดี - Nesting ลึกเกินไป
const DeepSchema = type({
  level1: {
    level2: {
      level3: {
        level4: 'string'
      }
    }
  }
})

// ✅ ดี - Flatten structures
const FlatSchema = type({
  level1_level2_level3_level4: 'string'
})
```

## Memory Optimization

### 1. Schema Reuse

#### Reuse Schemas

```typescript
// ✅ ดี - Reuse schemas
const BaseSchema = type({
  id: 'string',
  createdAt: 'string'
})

const UserSchema = type({
  ...BaseSchema,
  name: 'string'
})

const ProductSchema = type({
  ...BaseSchema,
  name: 'string',
  price: 'number'
})
```

### 2. Avoid Circular References

#### หลีกเลี่ยง circular references

```typescript
// ❌ ไม่ดี - Circular reference
const NodeSchema = type({
  value: 'string',
  children: type.array(NodeSchema) // Circular
})

// ✅ ดี - ใช้ recursive type อย่างถูกต้อง
const NodeSchema = type({
  value: 'string',
  children: type.array('NodeSchema').or('[]')
})
```

## Performance Monitoring

### 1. Measure Validation Time

#### ใช้ performance API

```typescript
const measureValidation = (schema, data) => {
  const start = performance.now()
  const result = schema(data)
  const end = performance.now()
  console.log(`Validation took ${end - start}ms`)
  return result
}
```

### 2. Profile Hot Paths

#### ใช้ profiler

```typescript
// ใช้ Chrome DevTools Profiler
// หรือ Node.js profiler
const validateMany = (schema, data) => {
  for (const item of data) {
    schema(item)
  }
}
```

## ตารางสรุป Best Practices

| Practice | Impact | Example |
|----------|--------|---------|
| Compile schemas ล่วงหน้า | High | `const schema = type({...})` |
| Reuse schemas | High | Export และ import schemas |
| Minimal validation | Medium | Validate เฉพาะที่จำเป็น |
| Avoid deep nesting | Medium | Flatten structures |
| Use inferred types | Low | `type T = typeof schema.infer` |
