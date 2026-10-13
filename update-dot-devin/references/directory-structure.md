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

rules/ (ast-grep — project root, not inside .devin)
├── dependencies/
├── architecture/
└── glob/
```

### Monorepo

```
.devin/ (repo root only)
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

Do not create `.devin/` in sub-workspaces — `.devin/` lives at the repo root only, and ast-grep rules live at the `rules/` root (not `.devin/rules/`)
