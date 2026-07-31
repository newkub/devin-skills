# Structure

## Project Structure

```
my-effect-app/
├── src/
│   ├── effects/
│   │   ├── user.effect.ts
│   │   └── auth.effect.ts
│   ├── services/
│   │   ├── database.service.ts
│   │   └── logger.service.ts
│   ├── layers/
│   │   ├── database.layer.ts
│   │   └── logger.layer.ts
│   ├── models/
│   │   └── user.model.ts
│   └── index.ts
├── test/
│   ├── effects/
│   │   └── user.effect.test.ts
│   └── mocks/
│       └── database.mock.ts
├── tsconfig.json
└── package.json
```

## File Organization

| Directory | Purpose | Description |
|-----------|---------|-------------|
| `effects/` | Effect definitions | Business logic และ operations |
| `services/` | Service interfaces | Service contracts และ tags |
| `layers/` | Layer implementations | Dependency injection และ mocks |
| `models/` | Type definitions | Domain models และ types |
| `test/` | Test files | Unit และ integration tests |

## Naming Conventions

- **Effects**: `*.effect.ts` - สำหรับ effect definitions
- **Services**: `*.service.ts` - สำหรับ service interfaces
- **Layers**: `*.layer.ts` - สำหรับ layer implementations
- **Models**: `*.model.ts` - สำหรับ type definitions
