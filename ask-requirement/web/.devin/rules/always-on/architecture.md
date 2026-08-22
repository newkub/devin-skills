# Devin Rules

## Architecture

- Monorepo with Turborepo - `apps/` and `packages/` workspaces
- Use `workspace:*` protocol for internal dependencies
- Shared code goes in `packages/shared/`
- Never create circular dependencies between workspaces

## Code Style

- Use TypeScript strict mode
- Use Biome for linting and formatting
- Never use `any` - use Zod schemas and type inference
- Files must not exceed 250 lines
- Use `interface` for object shapes, `type` for unions

## Naming Conventions

- Files: `camelCase.ts` for utilities, `PascalCase.tsx` for components
- Types: `PascalCase` (e.g., `RequirementForm`)
- Functions: `camelCase` (e.g., `generateSummary`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `PLATFORM_OPTIONS`)

## MCP Server

- Use `@modelcontextprotocol/sdk` for MCP server implementation
- Use Zod for all tool input validation
- Server entry point is `src/index.ts`
- Use `StdioServerTransport` for stdio communication

## Web

- Use SolidJS with SolidStart for the web app
- Use file-system based routing in `src/routes/`
- Use UnoCSS for styling - never use plain CSS
- Use `@iconify-json/mdi` for icons

## CLI

- Use Bun runtime for CLI
- Use ANSI escape codes for terminal colors
- Interactive prompts with multi-select, list, and text input
