# Architecture

## Project Structure

```
src/
├── index.ts           # Entry point
├── types/             # Type definitions
│   ├── api.ts
│   └── user.ts
├── utils/             # Utility functions
│   ├── format.ts
│   └── validation.ts
├── services/          # API/Web services
│   ├── api-client.ts
│   └── auth.ts
├── components/        # Reusable components
│   ├── Button.ts
│   └── Modal.ts
└── config/            # Configuration
    └── constants.ts
```

## Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Components, Pages, UI)            │
├─────────────────────────────────────┤
│         Application Layer           │
│   (Hooks, State, Business Logic)     │
├─────────────────────────────────────┤
│          Domain Layer               │
│   (Types, Interfaces, Entities)      │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (API, Storage, External Services) │
└─────────────────────────────────────┘
```

## Type Organization

### Domain Types

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type UserRole = "admin" | "user" | "guest";
```

### API Types

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Form Types

```typescript
// src/types/form.ts
export interface UserFormData {
  name: string;
  email: string;
  password: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
```

## Module System

### Single Module

```typescript
// src/services/user.ts
export interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: CreateUserDto): Promise<User>;
  updateUser(id: string, data: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

### Barrel Export

```typescript
// src/types/index.ts
export * from "./user";
export * from "./api";
export * from "./form";
```

## Configuration

### Environment Types

```typescript
// src/config/env.ts
interface Env {
  readonly NODE_ENV: "development" | "production" | "test";
  readonly API_URL: string;
  readonly API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
```

## Project References

### Monorepo Structure

```
packages/
├── core/              # @myapp/core
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
├── utils/             # @myapp/utils
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
└── apps/
    └── web/           # Main application
        ├── package.json
        ├── tsconfig.json
        └── src/index.ts
```

### Type Sharing

```json
// packages/web/tsconfig.json
{
  "references": [
    { "path": "../core" },
    { "path": "../utils" }
  ]
}
```