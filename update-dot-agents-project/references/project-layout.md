# Project Layout — `.agents/`

The project-level tree mirrors the global `~/.agents` layout and lives at the repo root only.

## Single Project

```text
.agents/
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
├── skills/ (optional)
├── rules/
│   ├── architecture/
│   │   └── <workspace-type>/
│   ├── dependencies/
│   └── business/
├── mcp/
│   └── mcp_config.json (optional)
└── references/ (optional, generated)

rules/ (ast-grep YAML — project root, not inside .agents)
├── dependencies/
├── architecture/
└── glob/
```

## Monorepo

```text
.agents/ (repo root only)
├── hooks/
│   ├── hooks.json
│   ├── run-lint.ts
│   └── run-typecheck.ts
├── rules/
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

## Notes

- `.agents/` lives at the repo root only — never create `.agents/` in a sub-workspace
- Each workspace gets its own `AGENTS.md`; the root `AGENTS.md` says those files must be followed
- Two rule systems coexist: `.agents/rules/*.md` is natural-language guidance, ast-grep `rules/*.yml` is machine enforcement
- No `.agents/workflows/` directory — project workflows belong inside a skill package
- `mcp/mcp_config.json` holds project-scoped servers; shared servers live in `~/.agents/mcp/mcp_config.json`
- `references/` holds generated tables only — never edit them by hand
