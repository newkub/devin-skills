# AGENTS.md

## Every Task

- Read all workflows, skills, and references, and follow them all
- Run `/refactor` after completing work
- Run `/realize-implementation` after completing work

## Project

- Project Type: `monorepo`
- Package Manager: `Bun`
- Runtime: `Bun`
- Language: `TypeScript`
- Type Checking: `tsc`
- Linting: `Biome`
- Formatting: `Biome`
- Monorepo: `Turborepo`
- Code Analysis: `ast-grep`

## Workspaces

- `apps/cli/AGENTS.md`: CLI tool (`Bun` + `MCP SDK` client + `Zod`)
- `apps/mcp-server/AGENTS.md`: MCP server (`Bun` + `MCP SDK` + `Zod`)
- `apps/web/AGENTS.md`: Web app (`SolidJS` + `SolidStart` + `UnoCSS` + `Vite`)
- `packages/shared/AGENTS.md`: Shared package (`TypeScript` + `Zod`)

## Architecture

- **Monorepo** with `Turborepo` - `apps/` and `packages/` workspaces
- **Web**: SolidStart with file-system routing, SSR, UnoCSS
- **CLI**: Bun runtime with interactive prompts, MCP client
- **MCP Server**: MCP SDK with stdio transport, Zod validation
- **Shared**: Types, schemas, data constants, summary generator

## Workflows

- Follow `/follow-bun`
- Follow `/follow-turborepo`
- Follow `/follow-biome`
- Follow `/follow-typescript`
- Follow `/follow-vite`
- Follow `/follow-solidjs`
- Follow `/follow-solid-start-architecture`
- Follow `/follow-unocss`
- Follow `/follow-zod`
- Follow `/follow-mcp-builder`
- Follow `/follow-monorepo`

## Skills

- Follow `bun`
- Follow `turborepo`
- Follow `biome`
- Follow `typescript`
- Follow `vite`
- Follow `solidjs`
- Follow `unocss`
- Follow `zod`
- Follow `mcp-builder`
