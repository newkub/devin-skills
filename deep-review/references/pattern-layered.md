# Pattern: Layered Architecture


Implement Layered Architecture สำหรับ Frontend projects โดยแยก concerns ตาม layers และ enforce dependency rules — เหมาะกับ Frontend projects (Vue/Nuxt/React/Solid) ขนาดเล็ก-กลาง

#### Execute — Layered

##### 1. Select Pattern

1. ประเมิน project size และ team experience
2. เลือก pattern: traditional layered, feature-based, 4-layer, หรือ hybrid
3. พิจารณา project lifecycle และ migration path
4. ทำ `/follow-tool-vite` สำหรับ build tooling setup

##### 2. Create Structure

Flat Type-Grouped (canonical — canonical template: `follow-architecture/templates/file-structure-layered.md`):

```
src/
├── app/              // entry, routes/pages, middleware, server
├── components/       // UI components (PascalCase, presentational)
├── hooks/            // composables / hooks — UI state + view logic
├── usecases/         // application use cases — orchestration entry
├── services/         // domain services — business rules
├── features/         // feature-level logic เฉพาะ domain (optional)
├── infra/            // repositories, database/, external APIs
├── lib/              // third-party wrappers / singleton clients
├── utils/            // pure utilities — no IO
├── types/            // shared types — pure types only
├── constants/        // app constants
├── config/           // env/app config
└── index.ts          // barrel — public API
```

- Flat เท่านั้น — ห้าม nest ตาม capability; prefix ชื่อไฟล์ตาม domain (`user-service.ts`)
- layer mapping: presentation = `app/`+`components/`+`hooks/`; domain = `usecases/`+`services/`+`features/`; data = `infra/`+`lib/`; shared leaves = `types/`+`constants/`+`utils/`+`config/`
- framework flat conventions (frontend เล็ก-กลาง): `stores/` (Pinia/Zustand), `middleware/`, `plugins/` เพิ่มได้ตาม framework — จัดเข้า layer ตาม role

Alternative Variants (เลือกเฉพาะเมื่อ flat ไม่พอ):

Feature-Based (features ชัดเจน แยกกันได้ — ยอม nest ตาม feature):

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

##### 3. Enforce Dependencies And Public APIs

1. ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
2. ถ้า project มี `Biome` → เพิ่ม restricted import rules
3. ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
4. หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 4. Align Tests With Layers

1. `Domain` tests: pure functions และ policies
2. `Application` tests: use cases กับ fake repositories
3. `Infrastructure` tests: adapters และ mapping (contract tests)
4. `Presentation` tests: behavior และ composition
5. ถ้า project มี `Vitest` → ทำตาม `/follow-tool-vitest`

##### 5. Setup And Migrate

1. สร้าง folder structure ตาม pattern ที่เลือก
2. ตั้งค่า import alias ใน `tsconfig` หรือ `nuxt.config`
3. ย้าย code ทีละ feature เพื่อลด risk
4. ถ้า project มี `Nuxt Layers` → ใช้ `extends` ใน `nuxt.config.ts`
5. ทำ `/refactor` หลังจากเสร็จ
6. ถ้า project โตขึ้น (3+ devs) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)

#### Rules — Layered

##### 1. Pattern Selection

- `flat type-grouped` = canonical default สำหรับ app เดียวทุกขนาด — grouping by type ไม่ nest ตาม capability
- `feature-based` เหมาะกับโปรเจกต์ที่มี features ชัดเจนและแยกกันได้ (ยอม nest ตาม feature)
- `4-layer` เหมาะกับโปรเจกต์ที่ต้องการ separation of concerns แบบชัดเจน (nested layers)
- `hybrid` (vertical slices + internal layering) เหมาะกับโปรเจกต์ขนาดใหญ่
- พิจารณา team experience และ project lifecycle

##### 2. Dependency Discipline

- presentation folders (`app/`, `components/`, `hooks/`) → domain folders เท่านั้น — ห้ามเรียก `infra/`/`lib/` ตรง
- domain folders (`usecases/` → `services/`/`features/` → `infra/`) — `app/` เรียก `usecases/`/`features/` เท่านั้น
- data folders (`infra/`, `lib/`) = leaf — ห้าม import presentation/domain
- `types/`/`constants/`/`utils/`/`config/` = shared leaves — ทุก layer ใช้ได้ ห้าม import กลับ; `utils/`/`types/` ต้อง pure
- ใช้ path aliases (`@/usecases/...`, `@/services/...`) เพื่อให้ layer transitions ชัดเจน
- ถ้า project มี `Biome` → เพิ่ม restricted import rules
- ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
- หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 3. Public API Rules

- แต่ละ layer/feature ต้องมี `index.ts` เป็น public API entry point
- ห้าม deep imports ข้าม layer (ใช้ `@/domain/order` ไม่ใช่ `@/domain/order/entities/User`)
- ใช้ barrel export pattern ทั้งหมด
- composables ใช้ prefix `use` เสมอ
- import ผ่าน alias ไม่ใช้ relative path

##### 4. Nuxt-Specific Guidelines

- ใช้ `Nuxt Layers` สำหรับ share configuration, components, และ composables ข้ามโปรเจกต์
- `srcDir` ค่าเริ่มต้นคือ `app/` ใน Nuxt 4
- auto-imported directories: `components/`, `composables/`, `utils/`
- ใช้ `shared/` สำหรับ code ที่ใช้ร่วมระหว่าง app และ server
- ลำดับ priority: project files > auto-scanned layers > `extends` config layers

##### 5. Common Pitfalls

- หลีกเลี่ยง `shared/` กลายเป็น escape hatch — shared ต้องมีเฉพาะ code ที่ใช้จริงข้าม layers
- หลีกเลี่ยง business layer กลายเป็น mega-service — แยก use cases ให้เล็กและ focused
- หลีกเลี่ยง features กระจายข้าม layers จนค้นหายาก — ใช้ `feature-based` ถ้าจำเป็น
- หลีกเลี่ยง manual enforcement โดยไม่มี lint หรือ CI checks

##### 6. Migration Path

- ถ้า project โตขึ้น (3+ devs, high testability) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)
- ถ้า project ต้องการ modular boundaries → ใช้ module structure ใน `src/modules/<feature>/` ตาม `### Pattern: Clean Architecture`
- Domain logic ต้อง framework-agnostic เพื่อให้ migrate ได้ง่าย

- ใช้ /follow-lib-vue ถ้าจำเป็น
- ใช้ /follow-create-web-nuxt ถ้าจำเป็น
- ใช้ /follow-create-web-svelte ถ้าจำเป็น
- ใช้ /follow-create-web-nextjs ถ้าจำเป็น
- ใช้ /follow-lib-react ถ้าจำเป็น

#### Expected Outcome — Layered

- เลือก pattern ที่เหมาะสมกับโปรเจกต์
- Folder structure ชัดเจนตาม pattern ที่เลือก
- Dependency rules ถูก enforce ผ่าน aliases และ lint
- Code แยกตาม domain หรือ technical layer
- Tests จัดเรียงตาม layers
- Migration path ชัดเจนเมื่อ project โตขึ้น

