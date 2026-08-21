# Architecture

## Purpose

อธิบายสถาปัตยกรรมภายในของ ArkType

## Overview

ArkType ถูกออกแบบบนพื้นฐานของ set theory ทำให้สามารถ validate และ optimize types ได้อย่างมีประสิทธิภาพ

## Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                        ArkType                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │   Parser    │   │   Validator │   │ Optimizer   │     │
│  │             │   │             │   │             │     │
│  │ Type String │   │   Check    │   │  Reduce &   │     │
│  │    → AST    │   │  Type      │   │  Simplify   │     │
│  └─────────────┘   └─────────────┘   └─────────────┘     │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           ▼                                 │
│                  ┌─────────────────┐                        │
│                  │   Type Object   │                        │
│                  │                 │                        │
│                  │  .t (type)      │                        │
│                  │  .assert()      │                        │
│                  │  .extends()     │                        │
│                  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Type System

### Set Theory Foundation

ArkType ใช้ set theory เพื่ออธิบาย type relationships:

| Concept | Description |
|---------|-------------|
| **Type** | A set of possible values |
| **Subtype** | A narrower set (subset) |
| **Supertype** | A wider set (superset) |
| **Intersection** | Set intersection |
| **Union** | Set union |

### Example

```typescript
const A = type("string");       // Set of all strings
const B = type("'hello'");      // Set containing only "hello"
const C = type("string | number"); // Union of two sets

// B is a subtype of A
B.extends(A) // true

// A is not a subtype of B
A.extends(B) // false
```

## Parsing Pipeline

```
Type String → Lexer → Parser → AST → Optimizer → Final Type
```

### 1. Lexer

แปลง string เป็น tokens:

```
"string | number"
      ↓
[STRING, PIPE, STRING]
```

### 2. Parser

สร้าง AST จาก tokens:

```
{
  type: "union",
  types: [
    { type: "primitive", name: "string" },
    { type: "primitive", name: "number" }
  ]
}
```

### 3. Optimizer

Reduce และ simplify AST:

```
{
  type: "union",
  types: [
    { type: "primitive", name: "string" },
    { type: "primitive", name: "number" }
  ]
}
        ↓
// Optimized for fastest validation
```

## Type Object Structure

```typescript
interface ArkType<T = unknown> {
  // Parsing
  (data: unknown): T | type.errors;
  assert(data: unknown): T;

  // Type information
  t: T;  // TypeScript type
  name: string;

  // Introspection
  extends(other: unknown): boolean;

  // Composition
  or(other: ArkType): ArkType;
  and(other: ArkType): ArkType;

  // Utilities
  named(name: string): ArkType<T>;
  defaults(values: Partial<T>): ArkType<T>;
}
```

## Performance Characteristics

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Parsing | O(n) | n = length of type string |
| Validation | O(1) for primitives | Optimized internals |
| Union | O(k) | k = number of union members |
| Object | O(m) | m = number of properties |

## Error System

```typescript
// Error is a tuple-like structure
type typeError = {
  [0]: string[];      // path
  [1]: string;        // message
  [2]: unknown;       // actual
  [3]: string;        // expected
  [4]: string;        // branch

  // Plus helpers
  path: string[];
  message: string;
  actual: unknown;
  expected: string;
  summary: string;
};

// Errors is an array-like of typeError
type typeErrors = {
  [n: number]: typeError;
  length: number;
  summary: string;
  [Symbol.iterator](): Iterator<typeError>;
};
```

## Optimization Strategies

### Discriminated Unions

```typescript
// Input
type({
  kind: "'admin' | 'user'",
  "adminData?": "object",
  "userData?": "object",
})

// Optimized: Separate branches
// - { kind: "admin", adminData: object }
// - { kind: "user", userData: object }
```

### Property Ordering

Properties ที่ใช้บ่อยถูกตรวจสอบก่อนเพื่อลดการค้นหา
