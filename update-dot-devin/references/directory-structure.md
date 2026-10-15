## Directory Structure

### Single Project

```
.devin/
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
├── skills/ (optional)
├── rules/ (markdown agent-guidance rules — via /update-devin-project-rules)
│   ├── architecture/
│   ├── dependencies/
│   └── business/
└── mcp_config.json (optional)

rules/ (ast-grep YAML — project root, not inside .devin)
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
├── rules/ (markdown agent-guidance rules — via /update-devin-project-rules)
│   ├── architecture/
│   ├── dependencies/
│   └── business/
apps/<workspace>/
├── AGENTS.md
integrations/<workspace>/
├── AGENTS.md
tools/<workspace>/
├── AGENTS.md

rules/ (ast-grep YAML — repo root)
├── dependencies/
├── architecture/
└── glob/
```

Do not create `.devin/` in sub-workspaces — `.devin/` lives at the repo root only. Two rule systems coexist: `.devin/rules/*.md` (natural-language agent guidance — `architecture/<workspace-type>/`, `dependencies/`, `business/`, owned by `/update-devin-project-rules`) and the ast-grep `rules/*.yml` at the repo root (machine-enforced AST lint — owned by `/update-astgrep-rules`). They have distinct purposes and do not replace each other.
