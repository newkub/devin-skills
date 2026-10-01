# Library File Structure

Canonical file structure สำหรับ library package (pure utils → domain lib) — flat modules + single barrel

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API barrel — export เท่าที่ใช้ภายนอก
│  │
│  ├─ modules/                            # feature modules — 1 folder ต่อ capability
│  │  ├─ parser/
│  │  │  ├─ index.ts                      # module barrel — public API ของ module
│  │  │  ├─ parse.ts                      # entry functions
│  │  │  ├─ ast.ts                        # internal types/logic — ไม่ export นอก module
│  │  │  └─ options.ts
│  │  ├─ format/
│  │  │  ├─ index.ts
│  │  │  └─ format.ts
│  │  └─ validate/
│  │     ├─ index.ts
│  │     └─ rules.ts
│  │
│  ├─ types/                              # public shared types (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ errors.ts                           # typed errors (shared leaf)
│  │
│  └─ utils/                              # internal pure helpers — ไม่ export (shared leaf)
│     └─ internal.ts
│
├─ tests/
│  ├─ unit/                               # per-module tests
│  └─ api/                                # public API surface tests — import จาก index เท่านั้น
├─ package.json                           # exports map, types, sideEffects:false
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | public API | `index.ts` | barrel — re-export module APIs | → `modules/*/index`, leaves |
| 2 | domain | `modules/<name>/` | feature capability — barrel + internals | → modules อื่นผ่าน barrel เท่านั้น (+ leaves) |
| 3 | shared leaf | `types/`+`errors`+`utils/` | public types + pure helpers | leaf — ทุก module ใช้ได้ |

## Rules

- Modules ข้ามกันผ่าน `<module>/index.ts` barrel เท่านั้น — ห้าม deep import internals
- `index.ts` export เท่าที่ public API contract ต้องการ — internals ห้าม leak (ใช้ `exports` map + api-extractor/attw check)
- ทุก module pure ตาม default — side effects ต้อง explicit (init function, opt-in)
- ถ้า lib โตเกิน threshold (modules ต้องการ ports/adapters, external IO หลายแหล่ง) → พิจารณา Clean (`follow-architecture/templates/file-structure-clean.md`)
- `sideEffects: false` + tree-shakable exports — ห้าม top-level side effects ใน `src/`
