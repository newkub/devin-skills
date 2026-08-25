# Docs Structure Check

ตรวจ `docs/` directory structure ครบถ้วน

## Required Location

- `docs/` ต้องอยู่ที่ project root (ไม่ใช่ `apps/docs/`)
- ห้ามสร้าง `docs/` ในแต่ละ workspace (monorepo)

## Required Directories

- `docs/.vitepress/` — VitePress config directory
- `docs/project/` — project overview, features, workspaces
- `docs/getting-started/` — installation, usage
- `docs/development/` — setup, architecture, workflows, testing
- `docs/references/` — references index
- `docs/roadmap/` — roadmap index, idea-features

## Required Pages

- `docs/index.md` — homepage
- `docs/project/overview.md` — project summary
- `docs/project/features.md` — features table
- `docs/getting-started/installation.md` — install steps
- `docs/getting-started/usage.md` — usage examples
- `docs/development/setup.md` — dev environment
- `docs/development/architecture.md` — architecture, conventions
- `docs/development/workflows.md` — slash commands, scripts, CI/CD
- `docs/development/testing.md` — test, lint, typecheck
- `docs/references/index.md` — references summary
- `docs/roadmap/index.md` — roadmap summary

## Monorepo Additional Pages

- `docs/project/workspaces.md` — workspace list
- `docs/workspaces/<name>.md` — one page per workspace

## Scoring

- Critical: ไม่มี `docs/`, ไม่มี `docs/.vitepress/`
- High: ขาด required pages สำคัญ (index, overview, features)
- Medium: ขาด development pages, references
- Low: ขาด monorepo workspace pages
