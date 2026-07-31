# Clean Architecture

## Overview

```
┌─────────────────────────────────┐
│      Application Layer           │
│  (Use Cases, DTOs)               │
├─────────────────────────────────┤
│      Domain Layer                │
│  (Entities, Interfaces)          │
├─────────────────────────────────┤
│      Infrastructure Layer        │
│  (Implementations)               │
└─────────────────────────────────┘
```

## Key Principles

1. **Dependency Rule**: Dependencies point inward
2. **Domain Independence**: Domain has no dependencies
3. **Framework Independence**: Business logic independent of frameworks

## Example

```typescript
// Domain Layer (no dependencies)
interface IUserRepository {
  getById(id: string): User;
  save(user: User): void;
}

class User {
  constructor(
    public id: string,
    public email: string
  ) {}
}

// Application Layer
class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}
  
  execute(request: CreateUserRequest): void {
    const user = new User(request.email);
    this.repository.save(user);
  }
}

// Infrastructure Layer
class SqlUserRepository implements IUserRepository {
  getById(id: string): User {
    /* SQL implementation */
  }
  
  save(user: User): void {
    /* SQL implementation */
  }
}
```
