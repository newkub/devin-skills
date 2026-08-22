# AGENTS.md

## Project

- Project Type: `monorepo`
- Package Manager: `Bun`
- Runtime: `Bun`
- Language: `TypeScript`
- Linting: `Biome`
- Monorepo: `Turborepo`
- Build: `bunup`

## Workspaces

- `apps/cli`: CLI application with 8 analyzers and orchestrator
- `packages/shared`: Shared types, constants, and utilities

## Scripts

- `bun run build` - Build all packages
- `bun run lint` - Lint all packages
- `bun run typecheck` - Type check all packages
- `bun run test` - Run tests
- `bun run verify` - Run typecheck, lint, test, build in sequence
- `bun run dev` - Watch mode development

## Architecture

- Each analyzer is a pure function: `(config) => AnalysisResult`
- Orchestrator runs all analyzers and consolidates results
- CLI parses args, creates config, runs analysis, outputs report
- Shared package provides types, constants, and utility functions
