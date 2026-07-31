# Performance Principles

## Core Philosophy

Biome is designed for speed and efficiency.

## Implementation

### Rust-Based

- Written in Rust for maximum performance
- No JavaScript runtime overhead
- Native binary execution

### Parallel Processing

- Utilizes multiple CPU cores
- Processes files in parallel
- Scales with hardware

### Incremental Processing

- Only processes changed files
- Smart caching mechanism
- Fast feedback loops

## Best Practices

### Use Staged Files

For pre-commit hooks, use `--staged`:

```bash
bunx biome check --write --staged
```

### Ignore Build Artifacts

Configure `files.ignore` to skip unnecessary files:

```json
{
  "files": {
    "ignore": ["node_modules", "dist", "build"]
  }
}
```

### Use CI Mode

In CI pipelines, use `biome ci` for non-interactive mode:

```bash
bunx biome ci ./src
```

## Benchmarks

- **10-20x faster** than Prettier
- **35x faster** than ESLint
- **Low memory footprint**
- **Fast startup time**
