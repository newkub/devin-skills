# AGENTS.md - Shared Package

## Project

- Name: `@ask-requirement/shared`
- Language: `TypeScript`
- Linting: `Biome`

## Architecture

- Entry point: `src/index.ts`
- Exports: types, data, schema, generator
- `types.ts` - TypeScript type definitions (PlatformValue, IntegrationValue, ProjectLevelValue, RequirementForm, etc.)
- `data.ts` - Static option data (PLATFORM_OPTIONS, INTEGRATION_OPTIONS, PROJECT_LEVEL_OPTIONS)
- `schema.ts` - Zod schemas for runtime validation
- `generator.ts` - Summary generator (markdown + JSON output)

## Scripts

- `bun run build` - Build to `dist/`
- `bun run typecheck` - Type check
- `bun run lint` - Lint with Biome
- `bun run verify` - Typecheck + lint
