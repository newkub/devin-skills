# Declaration Files & Module Augmentation

## Overview

TypeScript มีระบบ declaration files (.d.ts) สำหรับ describe types ของ JavaScript libraries ที่ไม่มี built-in types

## Declaration Files

### Global Declarations

```typescript
// global.d.ts
declare const APP_VERSION: string;
declare function greet(name: string): string;
declare class Logger {
  log(message: string): void;
}
```

### Module Declarations

```typescript
// my-library.d.ts
declare module "my-library" {
  export function doSomething(input: string): void;
  export class MyClass {
    constructor(name: string);
    doTask(): Promise<void>;
  }
}
```

### Ambient Declarations

```typescript
// custom.d.ts
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}
```

## Module Augmentation

เพิ่ม types ให้ existing modules:

### Extending Libraries

```typescript
// extended-string.d.ts
declare global {
  interface String {
    capitalize(): string;
    trim(): string;
  }
}

export {};
```

### Augmenting Third-party Types

```typescript
// express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: "admin" | "user";
  }
}
```

### Practical Example

```typescript
// Augmenting a library's types
declare module "lodash" {
  interface LoDashStatic {
    chunk<T>(array: T[], size: number): T[][];
    groupBy<T>(
      collection: T[],
      iteratee: (value: T) => string
    ): Record<string, T[]>;
  }
}
```

## Type Definition Files (.d.ts)

### Bundled Definitions

```typescript
// index.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserRole = "admin" | "user" | "guest";

export class UserService {
  constructor(apiUrl: string);
  getUser(id: string): Promise<User>;
  createUser(user: Omit<User, "id">): Promise<User>;
}
```

### Triple-slash Directives

```typescript
/// <reference types="node" />
/// <reference path="./my-types.d.ts" />

import { Something } from "./my-types";
```

## best practices

1. ใช้ `.d.ts` extension สำหรับ declaration files
2. ใช้ `declare module` สำหรับ augment existing modules
3. ใช้ `declare global` สำหรับ global scope
4. export empty object `{}` จาก declaration files
5. ใช้ `/// <reference types="..." />` สำหรับ type dependencies