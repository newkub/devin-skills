## Directory Structure

### Single Project

```
.devin/
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
├── skills/ (optional)
└── mcp_config.json (optional)

rules/ (ast-grep — project root, ไม่ใช่ใน .devin)
├── dependencies/
├── architecture/
└── glob/
```

### Monorepo

```
.devin/ (repo root เท่านั้น)
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
apps/<workspace>/
├── AGENTS.md
integrations/<workspace>/
├── AGENTS.md
tools/<workspace>/
├── AGENTS.md
```

ไม่สร้าง `.devin/` ใน sub-workspace — `.devin/` อยู่ที่ repo root เท่านั้น และ ast-grep rules อยู่ที่ `rules/` root (ไม่ใช่ `.devin/rules/`)
