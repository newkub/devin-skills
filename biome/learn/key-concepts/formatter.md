# Biome Formatter

## Overview

Biome formatter is a fast code formatter written in Rust that supports multiple languages.

## Key Concepts

### Deterministic Formatting

- Same input always produces same output
- No opinionated style choices where multiple valid options exist
- Consistent across all files

### Language Support

- JavaScript / TypeScript
- JSX / TSX
- JSON
- CSS
- HTML
- GraphQL

### Formatting Philosophy

- **Safe**: Never changes code behavior
- **Fast**: 10-20x faster than Prettier
- **Configurable**: Customizable via biome.json

## Core Options

### Indentation

- `indentStyle`: "tab" or "space"
- `indentWidth`: Number of spaces (default: 2)

### Line Width

- `lineWidth`: Maximum characters per line (default: 80)
- Applies to all supported languages

### Quote Style

- `quoteStyle`: "single" or "double"
- Language-specific overrides available

## Usage

```bash
# Format files
bunx biome format --write ./src

# Check formatting without writing
bunx biome format ./src

# Format with custom options
bunx biome format --indent-style=space --line-width=100 ./src
```

## Integration

- Pre-commit hooks
- Editor integration (VS Code, Neovim, etc.)
- CI/CD pipelines
