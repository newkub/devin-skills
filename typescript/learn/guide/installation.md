# Installation - TypeScript

## Node.js Requirements

TypeScript requires Node.js. Install from https://nodejs.org/

```bash
node --version
bun --version
```

## Installation Methods

### Via Bun (Recommended)

```bash
# Local installation per project
bun add -D typescript

# Global installation
bun add -g typescript

# Verify installation
tsc --version
```

## Project Setup

### Initialize Bun Project

```bash
bun init -y
bun add -D typescript
bunx tsc --init
```

### Create tsconfig.json

```bash
# Or manually create with basic settings:
bunx tsc --init --target ES2020 --module NodeNext --outDir ./dist
```

## Essential Tools

### Type Definitions

```bash
# Install type definitions
bun add -D @types/node @types/react @types/jest

# Search for types
bun search @types/
```

### Development Tools

| Tool | Purpose | Install |
|------|---------|---------|
| ts-node | Run TypeScript directly | `bun add -D ts-node` |
| tsx | Fast TypeScript runner | `bun add -D tsx` |
| vitest | Testing framework | `bun add -D vitest` |
| ts-jest | Jest with TypeScript | `bun add -D ts-jest @types/jest` |

## IDE Setup

### VS Code

Install extensions:
- TypeScript Vue Plugin (Volar)
- TypeScript errors in workspace

### IntelliJ IDEA / WebStorm

Built-in TypeScript support

### Neovim

```vim
-- Using lazy.nvim
{ "neovim/nvim-lspconfig", opts = { /* ... */ } }
{ "jose-elias-alvarez/typescript.nvim" }
```

## Verify Installation

```bash
# Check TypeScript version
tsc --version

# Run TypeScript compiler
tsc your-file.ts

# Run with ts-node
ts-node your-file.ts
```

## Update TypeScript

```bash
# Update to latest
bun update typescript

# Install specific version
bun add typescript@5.3
```