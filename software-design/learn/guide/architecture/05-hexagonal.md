# Hexagonal Architecture

## Overview

```
        ┌──────────┐
        │  Ports   │
        └────┬─────┘
             │
    ┌────────┴────────┐
    │    Domain       │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │  Adapters       │
    └─────────────────┘
```

## Components

| Component | Description |
|-----------|-------------|
| **Domain** | Core business logic |
| **Ports** | Interfaces for external communication |
| **Adapters** | Implementations of ports |

## Example

```typescript
// Domain
interface IUserRepository {
  getById(id: string): User;
  save(user: User): void;
}

// Port (Interface)
interface IEmailSender {
  sendEmail(to: string, subject: string, body: string): void;
}

// Adapter (Implementation)
class SmtpEmailSender implements IEmailSender {
  sendEmail(to: string, subject: string, body: string): void {
    // SMTP implementation
  }
}
```
