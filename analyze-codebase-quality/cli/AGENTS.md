# AGENTS.md

## Project

- Project Type: `single-package`
- Package Manager: `Bun`
- Runtime: `Bun`
- Language: `TypeScript`
- Linting: `Biome`
- Build: `bunup`

## Scripts

- `bun run build` - Build the CLI and library
- `bun run lint` - Lint the source
- `bun run typecheck` - Type check the source
- `bun run test` - Run tests
- `bun run dev` - Watch mode development
- `bun run start` - Run the built CLI

## Architecture

- `src/domain/analyzers/` — Pure analyzer functions `(config) => AnalysisResult`
- `src/application/orchestrator.ts` — Runs all analyzers and consolidates results
- `src/presentation/cli/cli.ts` — CLI entry point: parses args, creates config, outputs report
- `src/adapters/filesystem/file-adapter.ts` — File system side effects (walk, read)
- `src/shared/` — Types, constants, colors, formatting, and utility functions
- `src/config.ts` — Configuration creation
