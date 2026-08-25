# Layered Architecture

> Reference pattern for `/follow-architecture` — Implement Layered Architecture สำหรับ Frontend projects ขนาดเล็ก-กลาง

## Goal

Implement Layered Architecture สำหรับ Frontend projects โดยแยก concerns ตาม layers และ enforce dependency rules

## Scope

ใช้สำหรับ Frontend projects (Vue/Nuxt/React/Solid) ขนาดเล็ก-กลาง ที่ต้องการโครงสร้างแบบ layered หรือ feature-based

## Execute

### 1. Select Pattern

> Goal: เลือก pattern ตาม Pattern Selection ในส่วน Rules

1. ประเมิน project size และ team experience
2. เลือก pattern: traditional layered, feature-based, 4-layer, หรือ hybrid
3. พิจารณา project lifecycle และ migration path
4. ทำ `/follow-tool-vite` สำหรับ build tooling setup

### 2. Create Structure

> Goal: สร้าง folder structure ตาม pattern ที่เลือก

Traditional Layered (โปรเจกต์ขนาดเล็ก หรือ classic):

```
src/
├── components/        // UI components (global)
├── composables/      // Vue composables / React hooks
├── stores/           // state management (Pinia/Zustand)
├── services/         // API calls and business logic
├── utils/            // pure utility functions
├── types/            // TypeScript types
├── constants/        // app constants
├── middleware/       // route middleware
└── plugins/          // framework plugins
```

Feature-Based (features ชัดเจน แยกกันได้):

```
src/
├── features/          // feature-based organization
│   ├── auth/         // authentication feature
│   │   ├── composables/  // Vue composables
│   │   ├── components/  // Vue components
│   │   ├── api/          // API calls
│   │   ├── stores/ (optional)   // state management
│   │   ├── hooks/ (optional)     // custom hooks
│   │   ├── middleware/ (optional) // route middleware
│   │   └── types/        // TypeScript types
│   └── dashboard/    // dashboard feature
└── shared/           // shared utilities
    ├── utils/        // utility functions
    ├── stores/ (optional)     // global state
    ├── plugins/ (optional)    // framework plugins
    ├── constants/ (optional)  // app constants
    └── types/ (optional)      // shared types
```

4-Layer (separation of concerns แบบชัดเจน):

```
src/
├── presentation/     // UI components, pages, routing, layout
│   ├── components/   // reusable UI (Button, Card)
│   ├── pages/        // page-level components
│   └── hooks/        // UI-specific hooks
├── application/      // state orchestration, workflows
│   ├── stores/       // TanStack Query, Zustand, Pinia
│   ├── useCases/     // application workflows
│   └── utils/        // app-wide utilities
├── domain/           // business entities and pure logic
│   ├── entities/     // models (User, Product)
│   ├── repositories/ // interfaces for data access
│   └── services/     // pure business logic functions
├── infrastructure/   // external integrations
│   ├── api/          // API clients
│   ├── storage/      // LocalStorage, IndexedDB wrappers
│   └── config/       // environment configs
└── shared/           // cross-layer utilities (types, constants)
```

### 3. Enforce Dependencies And Public APIs

> Goal: ดู Dependency Discipline และ Public API Rules ในส่วน Rules

1. ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
2. ถ้า project มี `Biome` → เพิ่ม restricted import rules
3. ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
4. หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

### 4. Align Tests With Layers

> Goal: จัดเรียง tests ตาม layers

1. `Domain` tests: pure functions และ policies
2. `Application` tests: use cases กับ fake repositories
3. `Infrastructure` tests: adapters และ mapping (contract tests)
4. `Presentation` tests: behavior และ composition
5. ถ้า project มี `Vitest` → ทำตาม `/follow-tool-vitest`

### 5. Setup And Migrate

> Goal: ย้าย code ทีละ feature และมี migration path ชัดเจน

1. สร้าง folder structure ตาม pattern ที่เลือก
2. ตั้งค่า import alias ใน `tsconfig` หรือ `nuxt.config`
3. ย้าย code ทีละ feature เพื่อลด risk
4. ถ้า project มี `Nuxt Layers` → ใช้ `extends` ใน `nuxt.config.ts`
5. ทำ `/refactor` หลังจากเสร็จ
6. ถ้า project โตขึ้น (3+ devs) → migrate ไป Clean Architecture ([clean-architecture.md](clean-architecture.md))

## Rules

### 1. Pattern Selection

- `traditional layered` เหมาะกับโปรเจกต์ขนาดเล็ก หรือต้องการโครงสร้าง classic
- `feature-based` เหมาะกับโปรเจกต์ที่มี features ชัดเจนและแยกกันได้
- `4-layer` เหมาะกับโปรเจกต์ที่ต้องการ separation of concerns แบบชัดเจน
- `hybrid` (vertical slices + internal layering) เหมาะกับโปรเจกต์ขนาดใหญ่
- พิจารณา team experience และ project lifecycle

### 2. Dependency Discipline

- `Presentation` → `Application` / `Domain` เท่านั้น
- `Application` → `Domain` เท่านั้น
- `Infrastructure` → `Domain` (สำหรับ mapping) เท่านั้น
- `Domain` ห้าม import จาก layer อื่นทั้งหมด
- ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
- ถ้า project มี `Biome` → เพิ่ม restricted import rules
- ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
- หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

### 3. Public API Rules

- แต่ละ layer/feature ต้องมี `index.ts` เป็น public API entry point
- ห้าม deep imports ข้าม layer (ใช้ `@/domain/order` ไม่ใช่ `@/domain/order/entities/User`)
- ใช้ barrel export pattern ทั้งหมด — ทำ `/follow-import-export`
- composables ใช้ prefix `use` เสมอ
- import ผ่าน alias ไม่ใช้ relative path

### 4. Nuxt-Specific Guidelines

- ใช้ `Nuxt Layers` สำหรับ share configuration, components, และ composables ข้ามโปรเจกต์
- `srcDir` ค่าเริ่มต้นคือ `app/` ใน Nuxt 4
- auto-imported directories: `components/`, `composables/`, `utils/`
- ใช้ `shared/` สำหรับ code ที่ใช้ร่วมระหว่าง app และ server
- ลำดับ priority: project files > auto-scanned layers > `extends` config layers

### 5. Common Pitfalls

- หลีกเลี่ยง `shared/` กลายเป็น escape hatch — shared ต้องมีเฉพาะ code ที่ใช้จริงข้าม layers
- หลีกเลี่ยง business layer กลายเป็น mega-service — แยก use cases ให้เล็กและ focused
- หลีกเลี่ยง features กระจายข้าม layers จนค้นหายาก — ใช้ `feature-based` ถ้าจำเป็น
- หลีกเลี่ยง manual enforcement โดยไม่มี lint หรือ CI checks

### 6. Migration Path

- ถ้า project โตขึ้น (3+ devs, high testability) → migrate ไป Clean Architecture ([clean-architecture.md](clean-architecture.md))
- ถ้า project ต้องการ modular boundaries → ใช้ module structure ใน `src/modules/<feature>/` ตาม `/follow-architecture`
- Domain logic ต้อง framework-agnostic เพื่อให้ migrate ได้ง่าย

## Expected Outcome

- เลือก pattern ที่เหมาะสมกับโปรเจกต์
- Folder structure ชัดเจนตาม pattern ที่เลือก
- Dependency rules ถูก enforce ผ่าน aliases และ lint
- Code แยกตาม domain หรือ technical layer
- Tests จัดเรียงตาม layers
- Migration path ชัดเจนเมื่อ project โตขึ้น
