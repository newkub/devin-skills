# Event-Driven Architecture

## Overview

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Producer│───→│  Event  │───→│Consumer │
└─────────┘    │  Bus    │    └─────────┘
               └─────────┘
```

## Components

| Component | Description |
|-----------|-------------|
| **Event Bus** | Central hub for events |
| **Producer** | Publishes events |
| **Consumer** | Subscribes to events |
| **Event Store** | Persistent event storage |

## Event Types

**Domain Events**:
```typescript
class OrderCreatedEvent {
  constructor(
    public orderId: string,
    public createdAt: Date
  ) {}
}

class OrderShippedEvent {
  constructor(
    public orderId: string,
    public shippedAt: Date
  ) {}
}
```

**Integration Events**:
```typescript
class UserRegisteredEvent {
  constructor(
    public userId: string,
    public email: string
  ) {}
}
```
