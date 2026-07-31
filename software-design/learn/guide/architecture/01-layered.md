# Layered Architecture

## Overview

```
┌─────────────────────────────────┐
│      Presentation Layer         │
│  (Controllers, Views, APIs)      │
├─────────────────────────────────┤
│      Application Layer           │
│  (Use Cases, Services)           │
├─────────────────────────────────┤
│      Domain Layer                │
│  (Entities, Value Objects)       │
├─────────────────────────────────┤
│      Infrastructure Layer        │
│  (Database, External APIs)       │
└─────────────────────────────────┘
```

## Responsibilities

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Presentation** | Handle HTTP requests/responses | Controllers, Views, DTOs |
| **Application** | Orchestrate business logic | Services, Use Cases |
| **Domain** | Core business logic | Entities, Value Objects |
| **Infrastructure** | External integrations | Database, File System, APIs |

## Rules

- Dependencies flow downward only
- Domain layer has no dependencies
- Each layer only knows about the layer below
