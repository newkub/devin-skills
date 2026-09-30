# Plugins File Structure

Canonical file structure สำหรับ plugin package (editor/build-tool/framework plugin) — manifest + lifecycle hooks + capabilities

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API — export plugin factory + types เท่านั้น
│  │
│  ├─ plugin.ts                           # plugin manifest — name, version, hooks registration
│  │
│  ├─ hooks/                              # lifecycle/transform hooks — 1 file ต่อ hook (presentation)
│  │  ├─ on-init.ts
│  │  ├─ on-load.ts
│  │  └─ transform.ts
│  │
│  ├─ usecases/                           # use cases ที่ hooks เรียก (domain)
│  │  ├─ resolve-asset.ts
│  │  └─ analyze-config.ts
│  │
│  ├─ services/                           # business rules — pure (domain)
│  │  └─ rule-engine.ts
│  │
│  ├─ infra/                              # host APIs, fs, external calls (data)
│  │  ├─ host.ts                          # host-context adapter — ห่อ APIs ที่ host ให้
│  │  └─ fs.ts
│  │
│  ├─ utils/ types/ constants/ config/    # shared leaves (pure)
│  │
│  └─ contract.ts                         # host-facing types — ต้องตรง host plugin API (shared leaf)
│
├─ tests/
│  ├─ unit/                               # usecases/, services/ — mock host context
│  └─ e2e/                                # run จริงใน host fixture project
├─ package.json                           # exports/peerDeps ตาม host API
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `plugin.ts`+`hooks/` | manifest + lifecycle hooks | → `usecases/` (+ leaves) — ห้ามเรียก `infra/` ตรง |
| 2 | domain | `usecases/`+`services/` | plugin behavior + rules | → `infra/` (+ leaves) |
| 3 | data | `infra/` | host API adapter, fs, external IO | leaf (+ leaves) |
| 4 | shared leaf | `contract.ts`+`utils/`+`types/`+`constants/`+`config/` | host contract + pure helpers | leaf |

## Rules

- `index.ts` export เฉพาะ plugin factory + public types — ห้าม export internal layers
- Host API ทุก call ผ่าน `infra/host.ts` adapter — ห้ามเรียก host context ตรงใน domain
- `contract.ts` = SSOT ของ host plugin API — types ต้องตรง host version ที่ peerDeps ระบุ
- domain (`usecases/`+`services/`) pure — testable โดย mock host context เท่านั้น
- Hooks ห้ามทำงานหนักตอน register — lazy/defer ไป `on-*` hook ที่เหมาะ
