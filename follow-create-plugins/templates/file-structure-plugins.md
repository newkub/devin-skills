# Plugins File Structure

Canonical file structure for a plugin package (editor/build-tool/framework plugin) — manifest + lifecycle hooks + capabilities

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API — export only the plugin factory + types
│  │
│  ├─ plugin.ts                           # plugin manifest — name, version, hooks registration
│  │
│  ├─ hooks/                              # lifecycle/transform hooks — 1 file per hook (presentation)
│  │  ├─ on-init.ts
│  │  ├─ on-load.ts
│  │  └─ transform.ts
│  │
│  ├─ usecases/                           # use cases called by hooks (domain)
│  │  ├─ resolve-asset.ts
│  │  └─ analyze-config.ts
│  │
│  ├─ services/                           # business rules — pure (domain)
│  │  └─ rule-engine.ts
│  │
│  ├─ infra/                              # host APIs, fs, external calls (data)
│  │  ├─ host.ts                          # host-context adapter — wraps the APIs the host provides
│  │  └─ fs.ts
│  │
│  ├─ utils/ types/ constants/ config/    # shared leaves (pure)
│  │
│  └─ contract.ts                         # host-facing types — must match the host plugin API (shared leaf)
│
├─ tests/
│  ├─ unit/                               # usecases/, services/ — mock host context
│  └─ e2e/                                # real runs in a host fixture project
├─ package.json                           # exports/peerDeps per the host API
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `plugin.ts`+`hooks/` | manifest + lifecycle hooks | → `usecases/` (+ leaves) — must not call `infra/` directly |
| 2 | domain | `usecases/`+`services/` | plugin behavior + rules | → `infra/` (+ leaves) |
| 3 | data | `infra/` | host API adapter, fs, external IO | leaf (+ leaves) |
| 4 | shared leaf | `contract.ts`+`utils/`+`types/`+`constants/`+`config/` | host contract + pure helpers | leaf |

## Rules

- `index.ts` exports only the plugin factory + public types — never export internal layers
- Every host API call goes through the `infra/host.ts` adapter — never call host context directly in the domain
- `contract.ts` = SSOT of the host plugin API — types must match the host version declared in peerDeps
- The domain (`usecases/`+`services/`) is pure — testable by mocking the host context only
- Hooks must not do heavy work at register time — lazily/defer to the appropriate `on-*` hook
