# Naming Conventions

## Rationale

Consistent naming ช่วยให้ code readable, maintainable, และ easier to understand สำหรับทีม

## General Rules

### 1. Use PascalCase for Types and Classes

```typescript
// ✅
type UserProfile = { ... };
class ApiClient { ... }
interface PaymentProcessor { ... }

// ❌
type userProfile = { ... };
type user_profile = { ... };
```

### 2. Use camelCase for Variables and Functions

```typescript
// ✅
const userName = "John";
const isActive = true;
function getUserById(id: string) { ... }

// ❌
const user_name = "John";
const UserName = "John";
function GetUserById(id: string) { ... }
```

### 3. Use PascalCase for Constants (when meaningful)

```typescript
// ✅
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;

// ❌
const max_retry_count = 3;
const maxRetryCount = 3;
```

### 4. Use kebab-case for File Names

```
// ✅
user-service.ts
payment-processor.ts
auth-helper.ts

// ❌
userService.ts
UserService.ts
user_service.ts
```

## Interface and Type Naming

### Interfaces (with I prefix optional)

```typescript
// ✅ Common pattern - no I prefix
interface User {
  id: string;
  name: string;
}

interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
}

// ❌
interface IUser {
  id: string;
}
```

### Type Aliases

```typescript
// ✅
type UserId = string;
type ApiResponse<T> = { data: T; status: number };
type EventHandler = (event: Event) => void;

// ❌
type userId = string;
type TUserId = string;
```

## Function Naming

### Use Verb or Verb Phrase

```typescript
// ✅
function getUser(): User { ... }
function validateEmail(email: string): boolean { ... }
function calculateTotal(items: Item[]): number { ... }
function handleClick(event: Event): void { ... }

// ❌
function user(): User { ... }
function email(email: string): boolean { ... }
function total(items: Item[]): number { ... }
```

### Async Functions

```typescript
// ✅ Prefix with get/fetch/load
async function getUser(id: string): Promise<User> { ... }
async function fetchProducts(): Promise<Product[]> { ... }
async function loadSettings(): Promise<Settings> { ... }
```

## Boolean Naming

### Prefix with is/are/has/should

```typescript
// ✅
const isActive = true;
const hasPermission = false;
const shouldUpdate = true;
const isLoading = false;

// ❌
const active = true;
const permission = false;
const update = true;
```

## Private Members

```typescript
// ✅ Use _ prefix for private fields
class UserService {
  private _db: Database;
  private _cache: Cache;

  private _validateUser(user: User): boolean {
    // ...
  }
}

// ❌
class UserService {
  private db: Database;
  private validateUser(user: User): boolean {
    // ...
  }
}
```

## Generic Type Parameters

```typescript
// ✅ Use meaningful names
function map<T, R>(items: T[], fn: (item: T) => R): R[] { ... }

interface Repository<T, ID extends string | number> {
  findById(id: ID): Promise<T>;
  save(entity: T): Promise<void>;
}

// ❌
function map<T, U>(items: T[], fn: (item: T) => U): U[] { ... }
```

## References

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Airbnb JavaScript Style Guide - Naming](https://github.com/airbnb/javascript#naming-conventions)