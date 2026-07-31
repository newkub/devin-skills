# CQRS (Command Query Responsibility Segregation)

## Overview

```
┌─────────────┐
│   Command   │
│   Side      │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Write DB  │
└─────────────┘

┌─────────────┐
│   Query     │
│   Side      │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Read DB   │
└─────────────┘
```

## Components

| Component | Description |
|-----------|-------------|
| **Command Side** | Handle writes (commands) |
| **Query Side** | Handle reads (queries) |
| **Write DB** | Database for writes |
| **Read DB** | Database for reads (optimized for queries) |

## Example

```typescript
// Command
class CreateUserCommand {
  constructor(
    public email: string,
    public name: string
  ) {}
}

class CreateUserCommandHandler {
  handle(command: CreateUserCommand): void {
    // Write to write DB
  }
}

// Query
class GetUserQuery {
  constructor(
    public userId: string
  ) {}
}

class GetUserQueryHandler {
  handle(query: GetUserQuery): User {
    // Read from read DB
  }
}
```
