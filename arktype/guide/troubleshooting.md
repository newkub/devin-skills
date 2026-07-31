---
title: Troubleshooting
description: ปัญหาที่พบบ่อยและวิธีแก้ไขสำหรับ ArkType
---

## Troubleshooting

ปัญหาที่พบบ่อยและวิธีแก้ไขสำหรับ ArkType

## Common Errors

### 1. Type Inference Not Working

#### Problem

Type inference ไม่ทำงาน

```typescript
const UserSchema = type({
  id: 'string',
  name: 'string'
})

type User = typeof UserSchema // ❌ ไม่ถูก
```

#### Solution

ใช้ `.infer`

```typescript
type User = typeof UserSchema.infer // ✅ ถูก
```

### 2. Schema Not Compiling

#### Problem

Schema ไม่ compile

```typescript
const Schema = type({
  field: 'invalid.type'
})
```

#### Solution

ตรวจสอบ type syntax

```typescript
const Schema = type({
  field: 'string' // ✅ ถูก
})
```

### 3. Validation Always Fails

#### Problem

Validation ล้มเหลวเสมอ

```typescript
const Schema = type({
  email: 'string.email'
})

const result = Schema('test@example.com') // ❌ ล้มเหลว
```

#### Solution

ตรวจสอบ input data

```typescript
const result = Schema({ email: 'test@example.com' }) // ✅ สำเร็จ
```

### 4. Circular Reference Error

#### Problem

Circular reference error

```typescript
const NodeSchema = type({
  value: 'string',
  children: type.array(NodeSchema) // ❌ Circular
})
```

#### Solution

ใช้ recursive type อย่างถูกต้อง

```typescript
const NodeSchema = type({
  value: 'string',
  children: type.array('NodeSchema').or('[]') // ✅
})
```

## ตารางสรุป Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Type inference not working | ไม่ใช้ `.infer` | ใช้ `typeof Schema.infer` |
| Schema not compiling | Invalid type syntax | ตรวจสอบ type syntax |
| Validation always fails | Wrong input format | ตรวจสอบ input data |
| Circular reference | Direct circular reference | ใช้ string reference |
| Type mismatch | Type ไม่ตรงกัน | ตรวจสอบ type definitions |

## Performance Issues

### 1. Slow Validation

#### Problem

Validation ช้า

```typescript
// Validate ทุกครั้ง
const validate = (data) => {
  const schema = type({...}) // ❌ Compile ทุกครั้ง
  return schema(data)
}
```

#### Solution

Compile schema ครั้งเดียว

```typescript
const schema = type({...}) // ✅ Compile ครั้งเดียว
const validate = (data) => schema(data)
```

### 2. High Memory Usage

#### Problem

ใช้ memory มาก

```typescript
// สร้าง schemas ใหม่ทุกครั้ง
const validate = (data) => {
  const schema = type({...})
  return schema(data)
}
```

#### Solution

Reuse schemas

```typescript
const schemas = {
  user: type({...}),
  product: type({...})
}
```

## Debugging

### 1. Inspect Errors

#### ดู error details

```typescript
const result = Schema(data)
if (result instanceof type.errors) {
  console.log(result.summary) // ดู error summary
  console.log(result.problems) // ดู problems ทั้งหมด
}
```

### 2. Log Validation

#### Log validation results

```typescript
const validate = (schema, data) => {
  const result = schema(data)
  console.log('Input:', data)
  console.log('Result:', result)
  return result
}
```

### 3. Type Checking

#### ตรวจสอบ types

```typescript
type User = typeof UserSchema.infer

const user: User = {
  id: '123',
  name: 'John'
}
```

## IDE Issues

### 1. No Type Inference in IDE

#### Problem

IDE ไม่แสดง type inference

#### Solution

ตรวจสอบ TypeScript version

```bash
bun add -D typescript
```

### 2. No Autocomplete

#### Problem

ไม่มี autocomplete

#### Solution

ตรวจสอบ VS Code extensions

- ติดตั้ง TypeScript Vue Plugin
- ตรวจสอบ tsconfig.json

## Build Issues

### 1. Build Fails

#### Problem

Build ล้มเหลว

```bash
bun build
# Error: Type 'string' is not assignable to type 'number'
```

#### Solution

ตรวจสอบ type definitions

```typescript
const Schema = type({
  age: 'number' // ✅ ถูก
})
```

### 2. Bundle Size Large

#### Problem

Bundle size ใหญ่

#### Solution

ใช้ tree-shaking

```typescript
// ✅ ดี - Import เฉพาะที่ใช้
import { type } from 'arktype'

// ❌ ไม่ดี - Import ทั้งหมด
import * as arktype from 'arktype'
```

## Getting Help

### 1. Documentation

- [Official Docs](https://arktype.io/) - เอกสารอย่างเป็นทางการ
- [API Reference](https://arktype.io/api) - API documentation

### 2. Community

- [Discord](https://discord.gg/arktype) - Community chat
- [GitHub Issues](https://github.com/arktypeio/arktype/issues) - Report bugs

### 3. Examples

- [GitHub Examples](https://github.com/arktypeio/arktype/tree/main/examples) - Code examples
- [Playground](https://arktype.io/playground) - Try online

## Checklist

ก่อนรายงาน issue:

- [ ] ตรวจสอบ documentation
- [ ] ค้นหาใน GitHub issues
- [ ] สร้าง minimal reproduction
- [ ] ระบุ ArkType version
- [ ] ระบุ TypeScript version
- [ ] ระบุ Node.js version
