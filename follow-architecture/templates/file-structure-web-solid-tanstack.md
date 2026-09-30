# Web Solid + TanStack File Structure

Canonical file structure สำหรับ Solid app + TanStack Router/Query — flat layered + feature grouping ภายใน layer

## File Structure

```text
project/
│
├─ index.html (หรือ app.config.ts ถ้า SolidStart)
├─ vite.config.ts
│
├─ src/
│  ├─ main.tsx                            # entry — mount + providers
│  ├─ app.tsx                             # root — router + query client
│  │
│  ├─ routes/                             # TanStack file-based routes (presentation)
│  │  ├─ __root.tsx
│  │  ├─ index.tsx
│  │  └─ users/$userId.tsx
│  │
│  ├─ components/                         # UI components (presentation)
│  │  ├─ ui/                              # primitives — Button, Input
│  │  └─ features/                        # feature components — UserTable
│  │
│  ├─ hooks/                              # create* hooks — view logic (presentation)
│  │  └─ use-session.ts
│  │
│  ├─ queries/                            # TanStack Query options — keys + fetchers (domain boundary)
│  │  ├─ users.ts                         # userQueries.list(), .detail(id)
│  │  └─ orders.ts
│  │
│  ├─ usecases/                           # application use cases — mutations/actions (domain)
│  │  ├─ login.ts
│  │  └─ create-order.ts
│  │
│  ├─ services/                           # business rules — pure (domain)
│  │  └─ order-service.ts
│  │
│  ├─ stores/                             # client state — createStore/createSignal (domain)
│  │  └─ session.ts
│  │
│  ├─ infra/                              # API/http clients (data)
│  │  ├─ http.ts
│  │  └─ api/                             # users.ts, orders.ts
│  │
│  ├─ lib/                                # third-party singletons — queryClient, router (data)
│  │
│  ├─ utils/ types/ constants/ config/    # shared leaves (pure)
│  └─ styles/                             # global css/tokens
│
├─ tests/
│  ├─ unit/                               # usecases/, services/, utils/
│  └─ e2e/                                # routes
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `routes/` | route tree + loaders | → `components`, `queries`, `usecases` |
| 2 | presentation | `components/`+`hooks/` | UI + view logic | → `queries`, `usecases`, `stores` — ห้ามเรียก `infra/` ตรง |
| 3 | domain boundary | `queries/` | query keys/options/fetchers | → `infra/` — channel เดียวสำหรับ server reads |
| 4 | domain | `usecases/`+`services/`+`stores/` | mutations + rules + state | → `queries`, `infra` |
| 5 | data | `infra/`+`lib/` | http, api clients, third-party | leaf |
| 6 | shared leaf | `utils/`+`types/`+`constants/`+`config/` | pure/shared | leaf — ทุก layer ใช้ได้ |

## Rules

- Server reads ผ่าน `queries/` (TanStack Query options) เท่านั้น — ห้าม fetch ใน components
- Server writes/mutations ผ่าน `usecases/` — components เรียก usecase ไม่เรียก `infra/` ตรง
- `utils/`+`types/` pure — ไม่มี IO/signals side effects
- Solid conventions: fine-grained reactivity — ห้าม destructure props
- ใช้ `@/` path alias — ห้าม relative imports ข้าม folder
