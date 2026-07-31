# CLI

tsdown command-line interface reference.

## Commands

### Build

Build the project:

```bash
tsdown
```

### Watch Mode

Build with file watching:

```bash
tsdown --watch
# or
tsdown -w
```

### With Options

```bash
tsdown --dts
tsdown --watch --dts
```

## Options

### --version, -v

Show version:

```bash
tsdown --version
# tsdown v0.9.0
```

### --help, -h

Show help:

```bash
tsdown --help
```

### --watch, -w

Enable watch mode:

```bash
tsdown --watch
```

### --dts

Generate TypeScript declarations:

```bash
tsdown --dts
```

### --config, -c

Specify config file:

```bash
tsdown --config tsdown.config.ts
tsdown -c tsdown.config.mts
```

### --outDir

Set output directory:

```bash
tsdown --outDir ./lib
```

### --format

Set output formats:

```bash
tsdown --format esm
tsdown --format esm --format cjs
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `tsdown` | Build project |
| `tsdown --watch` | Watch mode |
| `tsdown --dts` | Build with DTS |
| `tsdown --config <file>` | Custom config |
| `tsdown --version` | Show version |
| `tsdown --help` | Show help |

## Common Usage

### Development

```bash
# Watch mode
tsdown --watch
```

### Production

```bash
# Build with DTS
tsdown --dts

# Custom config
tsdown --config tsdown.config.ts --dts
```

### CI/CD

```bash
# Single command
tsdown
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Build mode (production/development) |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Build error |
| `2` | Config error |

## Summary

| Flag | Alias | Description |
|------|-------|-------------|
| `--watch` | `-w` | Watch mode |
| `--dts` | - | Generate declarations |
| `--config` | `-c` | Config file path |
| `--outDir` | - | Output directory |
| `--format` | - | Output formats |
| `--version` | `-v` | Show version |
| `--help` | `-h` | Show help |