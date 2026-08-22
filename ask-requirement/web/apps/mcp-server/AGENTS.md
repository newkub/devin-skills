# AGENTS.md - MCP Server

## Project

- Name: `@ask-requirement/mcp-server`
- Runtime: `Bun`
- Language: `TypeScript`
- Linting: `Biome`

## Architecture

- Entry point: `src/index.ts`
- MCP server with stdio transport
- Tools: `get-platforms`, `get-integrations`, `get-project-levels`, `generate-requirement`, `generate-markdown-only`
- Uses Zod for input validation
- Uses shared types and data from `@ask-requirement/shared`

## Scripts

- `bun run dev` - Run MCP server in development mode
- `bun run build` - Build to `dist/`
- `bun run typecheck` - Type check
- `bun run lint` - Lint with Biome
- `bun run verify` - Typecheck + lint
