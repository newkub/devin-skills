# How It Works

## Purpose

อธิบายการทำงานภายในของ ArkType เพื่อให้เข้าใจกลไกและ flow การทำงาน

## Scope

- Type Definition Flow
- Parsing Pipeline
- Error Handling Mechanism
- Type Inference Mechanism
- Optimization System

## Type Definition Flow

ArkType ใช้ type syntax strings เพื่อสร้าง types แบบ declarative

```
┌─────────────────────────────────────────────────────────────┐
│                    Type Definition                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   const User = type({                                       │
│     name: "string",              ──┐                        │
│     age: "number",                │ Primitive types         │
│     email: "string",             ──┘                        │
│     status: "'active'",         ──┘ Literal type            │
│   })                              ──┘ Object type            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ infer
┌─────────────────────────────────────────────────────────────┐
│                  TypeScript Type                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   type User = {                                             │
│     name: string;                                           │
│     age: number;                                            │
│     email: string;                                          │
│     status: "active";                                       │
│   }                                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Parsing Pipeline

เมื่อเรียก type(data) หรือ type.assert(data) ArkType จะทำการ validate ผ่าน pipeline

```
 Input (unknown)                            Output (typed)
      │                                         ▲
      │    ┌────────────────────────────────────┤
      │    │                                    │
      ▼    ▼                                    │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Normalization│ ──> │  Validation  │ ──> │ Optimization │
│  (internal)  │     │  (required)  │     │   (apply)    │
└──────────────┘     └──────────────┘     └──────────────┘
      │                    │                    │
      │   Parse string     │   Check type      │   Return
      │   to AST           │   constraints     │   typed
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Example |
|---------|----------|---------|
| **1. Normalization** | แปลง type string เป็น internal AST | `"string \| number"` → union |
| **2. Optimization** | reduce types ให้เล็กและเร็วที่สุด | `string \| string` → `string` |
| **3. Validation** | ตรวจสอบว่า data ผ่านเงื่อนไขหรือไม่ | `type({ x: "number" })` |
| **4. Error Collection** | เก็บ errors ทั้งหมดในครั้งเดียว | ไม่ throw แค่เก็บ |
| **5. Output** | คืนค่า typed result หรือ errors | `{ ... } \| type.errors` |

## Error Handling

ArkType มี 2 วิธีหลักสำหรับ handling:

```typescript
const User = type({
  name: "string",
  age: "number",
});

// Method 1: Check for errors
const result = User({
  name: "Alan",
  age: "not-a-number",
});

if (result instanceof type.errors) {
  console.log(result.summary);
  // "Expected number, received string"
}

// Method 2: Assert (throws on error)
try {
  const user = User.assert({
    name: "Alan",
    age: 42,
  });
} catch (e) {
  // handle error
}
```

## Type Relationships

ArkType ใช้ set theory เพื่ออธิบาย type relationships:

```typescript
const User = type({
  name: "string",
  age: "number",
});

// Check type relationships
User.extends("object") // true
User.extends("string") // false

// Narrow/wide check
User.extends({ name: "unknown" }) // true (string extends unknown)
User.extends({ name: "'Alan'" })   // false (string is wider)
```

## Performance Optimization

ทุก type ถูก optimize อัตโนมัติ:

```
┌─────────────────────────────────────────────────────────────┐
│                    Input Type                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   type({                                                    │
│     kind: "'admin' | 'user' | 'guest'",                   │
│     "data?": "string"                                      │
│   })                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ Optimize
┌─────────────────────────────────────────────────────────────┐
│                  Optimized Type                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Internal: Discriminated union with                        │
│   separate branches for each literal                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Error Message Structure

```typescript
const result = User({ name: 123, age: "old" });

if (result instanceof type.errors) {
  // Access different error levels
  result[0].path    // ["name"]
  result[0].message // "Expected string, received number"
  result[0].actual  // 123

  // Summary for display
  result.summary    // Full formatted message
}
```
