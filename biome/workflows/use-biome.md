---
description: Use Biome for formatting and linting
---

# Use Biome

## Format Code

### Format All Files

```bash
bunx biome format --write ./src
```

### Format Single File

```bash
bunx biome format --write src/index.ts
```

### Check Formatting Without Writing

```bash
bunx biome format ./src
```

## Lint Code

### Lint All Files

```bash
bunx biome lint ./src
```

### Lint and Apply Safe Fixes

```bash
bunx biome lint --write ./src
```

### Lint and Apply Unsafe Fixes

```bash
bunx biome lint --write --unsafe ./src
```

## Check (Format + Lint)

### Check and Fix All Issues

```bash
bunx biome check --write ./src
```

### Check Without Writing

```bash
bunx biome check ./src
```

### Check Staged Files Only

```bash
bunx biome check --write --staged
```

## CI Mode

### Run in CI Pipeline

```bash
bunx biome ci ./src
```

### Generate JSON Report

```bash
bunx biome ci ./src --reporter=json
```

### Generate GitHub Annotations

```bash
bunx biome ci ./src --reporter=github-annotations
```

## Organize Imports

### Organize Imports Only

```bash
bunx biome check --write --only=organize-imports ./src
```

## Custom Options

### Custom Line Width

```bash
bunx biome format --line-width=100 ./src
```

### Custom Indent Style

```bash
bunx biome format --indent-style=tab ./src
```

### Custom Config Path

```bash
bunx biome check --config-path=biome.prod.json ./src
```

## Ignore Patterns

### Ignore Specific Files

```bash
bunx biome check --exclude="*.test.ts" ./src
```

### Include Specific Files

```bash
bunx biome check --include="*.ts" ./src
```
