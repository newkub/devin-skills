---
title: Tool Documentation Reference
description: Reference for internal/dev-tool docs (CLIs, generators, build/test tooling)
---

# Tool Documentation Reference

Use for dev/internal tools — toolkits, generators, linters, runners. May be a CLI (`bin`) or a library consumed by other workspaces.

## Detection

- Workspace under `apps/toolkits/`, `tools/`, `apps/cli/`; or package with `bin`
- Used by developers/CI, not end users; may be private
- Often Bun/Node/Rust powered

## Index Links

`Project`, `Getting Started`, `Development`, `References` (commands or api, configuration, changelog)

## Page Groups

- `project/` — overview, features, decisions/
- `getting-started/` — quickstart, installation, usage
- `development/` — setup, architecture, workflows, testing
- `references/` — `commands/` per subcommand (if CLI) or `api.md` (if lib), `configuration.md`, `changelog.md`, `glossary.md`

## Content Focus

- `getting-started/quickstart.md` — run the tool once with real output
- `references/commands/<name>.md` — flags, args, examples per command
- `references/configuration.md` — every config field/env var
- `development/architecture.md` — pipeline/pipeline stages, file layout
