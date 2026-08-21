# Key Concept

## What is ArkType?

ArkType เป็น TypeScript runtime validation library ที่ใช้ type syntax ของ TypeScript โดยตรง ทำให้การ validate data สอดคล้องกับ TypeScript types 100% มาพร้อมประสิทธิภาพสูงสุด - เร็วกว่า Zod4 ถึง 20 เท่า

## Core Features

| Feature | Description |
|---------|-------------|
| **Type Syntax** | ใช้ TypeScript syntax สำหรับ define types โดยตรง |
| **Type Inference** | สร้าง TypeScript types อัตโนมัติจาก type definitions |
| **High Performance** | 20x faster than Zod4, 2000x faster than Yup |
| **Deep Introspectability** | เข้าถึง type relationships ที่ runtime |
| **Optimized Parsing** | ทุก schema ถูก normalized และ reduced อัตโนมัติ |
| **Great Errors** | Error messages ที่ clear และ customizable |

## Key Principles

- **Type-first syntax** - ใช้ type syntax ที่คุณคุ้นเคย
- **Set theory foundation** - เข้าใจ type relationships แบบ set theory
- **Intrinsic optimization** - schemas ถูก optimize อัตโนมัติ
- **1:1 validation** - runtime validation ตรงกับ compile-time types
- **No plugins** - ไม่ต้องมี build steps หรือ plugins

## Architecture

```
                    ArkType
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   Primitives      Composables    Special
        │               │               │
   "string"         object()       array()
   "number"         tuple()        record()
   "boolean"        union()        intersection
   "date"           or()           extends()
   "symbol"         and()
```

## Type Syntax Examples

```typescript
import { type } from "arktype";

// Simple types
const stringType = type("string");
const numberType = type("number");

// Object type
const User = type({
  name: "string",
  age: "number",
  email: "string",
});

// Optional fields
const Product = type({
  id: "string",
  name: "string",
  "price?": "number",  // optional
  "tags?": "string[]", // optional array
});

// Literal types
const Status = type("'active' | 'inactive' | 'pending'");

// Union types
const Response = type({
  data: "string | number",
  success: "boolean",
});
```

## When to Use

- API request/response validation
- Form data validation
- Configuration validation
- Environment variables validation
- Type narrowing with unions
- Data transformation
- Input sanitization

## Comparison

| Feature | ArkType | Zod v4 | Yup |
|---------|---------|--------|-----|
| TypeScript | Native syntax | Schema API | Limited |
| Performance | Fastest (14ns) | 281ns | 40,755ns |
| Bundle size | ~10KB | ~12KB | ~17KB |
| Tree-shaking | Yes | Yes | Partial |
| Error format | Customizable | ZodError | Generic |
| Type inference | Direct | Via infer | Limited |
| Build required | No | No | No |

## Type Safety Flow

```
┌──────────────┐    infer    ┌──────────────┐
│   Type       │ ───────────> │    Type      │
│  type({...}) │             │  TypeScript  │
└──────────────┘             └──────────────┘
       │                           ▲
       │ parse                     │
       ▼                           │
┌──────────────┐                  │
│    Input     │                  │
│  (unknown)   │ ───────────────> │
└──────────────┘                  │
                               ┌──────────────┐
                               │    Output    │
                               │   (typed)    │
                               └──────────────┘
```
