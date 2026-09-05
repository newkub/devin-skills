---
title: CLI Documentation Reference
description: Reference for CLI docs nav, sidebar, and content
---

# CLI Documentation Reference

Use this for command-line tools and binaries — libraries distributed as executables rather than web apps.

## Detection

A project is `cli` when any of these are true:

- `package.json` has a `bin` field
- Dependencies include `commander`, `cac`, `clipanion`, `yargs`, `citty`, `meow`, or `oclif`
- Entry points parse `process.argv` or define subcommands
- No web UI entry: no `index.html`, `src/app/`, `pages/`, or `routes/` directories

If the project also has auth → use `product` instead; `cli` takes precedence only for command-line-first projects.

## Nav

`Project`, `Getting Started`, `Commands`, `Roadmap`, `Development`, `References`

## Sidebar

- `project/` - overview, features, workspaces (monorepo)
- `getting-started/` - installation, usage
- `commands/` - index + one page per command or command group
- `roadmap/` - index, idea-features
- `development/` - shared development sidebar
- `references/` - contributing, license, troubleshooting

## Content Focus

- `commands/index.md`: command table — `Command`, `Description`, `Options`
- `commands/<name>.md`: usage line, flags table, real examples with expected output, exit codes
- `getting-started/installation.md`: install via package manager and from source
- `getting-started/usage.md`: real shell invocations with output blocks
- `references/troubleshooting.md`: common errors, debug flags, environment variables
