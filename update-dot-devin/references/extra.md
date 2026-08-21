## Directory Structure

### Single Project

```
.devin/
├── rules/
│   ├── always-on/
│   ├── model_decision/
│   └── glob/
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
├── skills/ (optional)
└── mcp/ (optional)
```

### Monorepo

```
.devin/
├── rules/
│   ├── always-on/
│   ├── model_decision/
│   └── glob/
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

ไม่สร้าง `.devin/` ใน sub-workspace — rules ทั้งหมดอยู่ที่ root `.devin/rules/` เท่านั้น
