# AGENTS.md - CLI Tool

## Project

- Name: `@ask-requirement/cli`
- Runtime: `Bun`
- Language: `TypeScript`
- Linting: `Biome`

## Architecture

- Entry point: `src/index.ts`
- Interactive CLI with multi-select, list, and text prompts
- MCP client that connects to `@ask-requirement/mcp-server` via stdio
- Uses shared types and data from `@ask-requirement/shared`

## Scripts

- `bun run dev` - Run CLI in development mode
- `bun run build` - Build to `dist/`
- `bun run typecheck` - Type check
- `bun run lint` - Lint with Biome
- `bun run verify` - Typecheck + lint
