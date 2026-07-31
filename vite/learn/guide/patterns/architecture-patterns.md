# Architecture Patterns

## 1. Feature-Based Architecture

จัดโครงสร้างตาม features แทนที่จะเป็น type-based

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   ├── api/
│   │   └── index.ts
│   └── settings/
│       ├── components/
│       ├── api/
│       └── index.ts
└── shared/
    ├── components/
    ├── utils/
    └── types/
```

**Benefits:**
- Easy to locate feature-related code
- Better for large teams
- Easier to delete features

## 2. Layered Architecture

แยก code ออกเป็น layers ชัดเจน

```text
src/
├── presentation/     # UI components
├── application/     # Business logic
├── domain/          # Core business rules
└── infrastructure/  # External services
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer
- Better maintainability
