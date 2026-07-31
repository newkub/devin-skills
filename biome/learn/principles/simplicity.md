# Simplicity Principles

## Core Philosophy

Biome aims to be simple and easy to use.

## Single Tool

### All-in-One

- Formatter, linter, import organizer in one tool
- No need for multiple tools
- Unified configuration

### Easy Installation

```bash
bun add -D @biomejs/biome
```

### Simple Configuration

```json
{
  "linter": {
    "rules": {
      "recommended": true
    }
  }
}
```

## Minimal Configuration

### Sensible Defaults

- Recommended rules enabled by default
- Standard formatting options
- Works out of the box

### Zero Config

- Works without configuration
- Automatic file detection
- Smart defaults

## Clear CLI

### Intuitive Commands

```bash
bunx biome format ./src
bunx biome lint ./src
bunx biome check ./src
```

### Helpful Output

- Clear error messages
- Suggestions for fixes
- Color-coded output

## Migration

### Easy Migration

```bash
bunx biome migrate eslint --write
bunx biome migrate prettier --write
```

### Drop-in Replacement

- Compatible with existing workflows
- Similar CLI to ESLint/Prettier
- Easy adoption
