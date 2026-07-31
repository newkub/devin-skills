# Declare

## Purpose

Define types ที่ match กับ external TypeScript types ด้วย autocomplete และ type-level error checking

## Overview

`declare()` API ช่วยให้ define ArkType types ที่ match กับ TypeScript types ที่มีอยู่แล้ว

## Basic Usage

```typescript
import { type } from "arktype"

type Expected = { a: string; b?: number }

const T = type.declare<Expected>().type({
  a: "string",
  "b?": "number"
})
```

## Type Safety

- TypeScript จะ error ถ้า ArkType definition ไม่ match กับ expected type
- Autocomplete จะแสดง expected structure
- Type inference จะ match กับ original type

## Use Cases

### External Library Types

```typescript
import { type } from "arktype"
import { Request } from "express"

const RequestSchema = type.declare<Request>().type({
  body: "unknown",
  query: "unknown",
  params: "unknown"
})
```

### Database Models

```typescript
import { type } from "arktype"
import { User } from "@prisma/client"

const UserSchema = type.declare<User>().type({
  id: "string",
  name: "string",
  email: "string"
})
```

### API Contracts

```typescript
import { type } from "arktype"

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

const ResponseSchema = type.declare<ApiResponse<string>>().type({
  success: "boolean",
  data: "string",
  "error?": "string"
})
```

## Benefits

- **Type Safety**: TypeScript validates ว่า ArkType schema match กับ expected type
- **Autocomplete**: IDE แสดง expected structure
- **Refactoring**: TypeScript refactoring จะ update ArkType definitions
- **Documentation**: External types serve as documentation

## Limitations

- ต้องมี TypeScript type ที่ declare ไว้ก่อน
- ไม่สามารถใช้กับ types ที่ generated จาก ArkType เอง
- Complex types อาจต้อง simplify ก่อน declare

## Migration

จาก manual type definitions:

```typescript
// Before
const User = type({
  id: "string",
  name: "string",
  email: "string"
})

// After
interface User {
  id: string
  name: string
  email: string
}

const UserSchema = type.declare<User>().type({
  id: "string",
  name: "string",
  email: "string"
})
```
