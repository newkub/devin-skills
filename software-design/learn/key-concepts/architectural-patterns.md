# Architectural Patterns

## รูปแบบสถาปัตยกรรม

Architectural patterns เป็น solutions สำหรับการออกแบบ software architecture ในระดับสูง

### Layered Architecture

```
┌─────────────────┐
│  Presentation   │
├─────────────────┤
│  Application    │
├─────────────────┤
│  Domain         │
├─────────────────┤
│  Infrastructure  │
└─────────────────┘
```

**Responsibilities**:

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Presentation** | Handle HTTP requests/responses | Controllers, Views, DTOs |
| **Application** | Orchestrate business logic | Services, Use Cases |
| **Domain** | Core business logic | Entities, Value Objects |
| **Infrastructure** | External integrations | Database, File System, APIs |

**Rules**:
- Dependencies flow downward only
- Domain layer has no dependencies
- Each layer only knows about the layer below

### Clean Architecture

```
┌─────────────────────────────────┐
│         Application              │
├─────────────────────────────────┤
│         Domain                  │
├─────────────────────────────────┤
│         Infrastructure           │
└─────────────────────────────────┘
```

**Key Principles**:
1. **Dependency Rule**: Dependencies point inward
2. **Domain Independence**: Domain has no dependencies
3. **Framework Independence**: Business logic independent of frameworks

### Microservices Architecture

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Service │  │ Service │  │ Service │
│    A    │  │    B    │  │    C    │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┴────────────┘
                  │
         ┌────────┴────────┐
         │   API Gateway   │
         └─────────────────┘
```

**Components**:

| Component | Description |
|-----------|-------------|
| **API Gateway** | Single entry point, routing, authentication |
| **Service Discovery** | Dynamic service registration |
| **Message Broker** | Async communication between services |
| **Database per Service** | Each service has its own database |

### Event-Driven Architecture

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Producer│───→│  Event  │───→│Consumer │
└─────────┘    │  Bus    │    └─────────┘
               └─────────┘
```

**Components**:

| Component | Description |
|-----------|-------------|
| **Event Bus** | Central hub for events |
| **Producer** | Publishes events |
| **Consumer** | Subscribes to events |
| **Event Store** | Persistent event storage |

**Event Types**:

**Domain Events**:
```typescript
class OrderCreatedEvent {
  constructor(
    public orderId: string,
    public createdAt: Date
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

### Hexagonal Architecture

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

**Components**:

| Component | Description |
|-----------|-------------|
| **Domain** | Core business logic |
| **Ports** | Interfaces for external communication |
| **Adapters** | Implementations of ports |

### CQRS (Command Query Responsibility Segregation)

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

**Components**:

| Component | Description |
|-----------|-------------|
| **Command Side** | Handle writes (commands) |
| **Query Side** | Handle reads (queries) |
| **Write DB** | Database for writes |
| **Read DB** | Database for reads (optimized for queries) |
