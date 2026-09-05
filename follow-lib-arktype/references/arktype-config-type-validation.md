---
title: Configuration Reference - Type & Validation
description: Configuration options สำหรับ ArkType
---

## Configuration Reference

ArkType รองรับการตั้งค่าได้ 4 levels: `default`, `global`, `scope`, และ `type` โดยแต่ละ level มีผลกับ types ที่ parse ภายใน scope นั้น

## Configuration Levels

### 1. Default

ค่าเริ่มต้นของ built-in keywords ทั่งหมด เปลี่ยนได้ผ่าน global config เท่านั้น

### 2. Global Configuration

ตั้งค่าสากลก่อน import `arktype` โดยใช้ `arktype/config` entrypoint

```typescript
import { configure } from "arktype/config"

configure({ numberAllowsNaN: true })
```

ต้อง import config file ก่อน `arktype` จึงจะมีผลกับ built-in keywords:

```typescript
import "./config.ts"
import { type } from "arktype"

type.number.allows(Number.NaN) // true
```

### 3. Scope Configuration

```typescript
import { scope } from "arktype"

const myScope = scope(
  { User: { age: "number < 100" } },
  {
    max: {
      actual: () => "unacceptably large",
    },
  }
)

const types = myScope.export()
```

### 4. Per-Type Configuration

```typescript
const Password = type("string >= 8").configure({
  actual: () => "",
})

const User = type({
  email: "string.email",
  password: Password,
})
```

## Common Configuration Options

| Option | Description |
|--------|-------------|
| `numberAllowsNaN` | อนุญาต `NaN` สำหรับ `number` |
| `dateAllowsInvalid` | อนุญาต invalid `Date` objects |
| `jitless` | ปิด JIT compilation |
| `onFail` | callback เมื่อ validation fail |
| `toJsonSchema` | กำหนด JSON Schema output options |

## Error Customization

```typescript
const Password = type("string >= 8").configure({
  actual: () => "",
})

const User = type({
  email: "string.email",
  password: Password,
})
```

## Sources

- https://arktype.io/docs/configuration
- https://arktype.io/docs/type-api
