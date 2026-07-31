# CLI

## Purpose

Command-line interface for Drizzle Kit (migration tool)

## Installation

```bash
bun install -D drizzle-kit
```

## Commands

| Command | Description |
|---------|-------------|
| `drizzle-kit generate` | Generate migration files from schema changes |
| `drizzle-kit push` | Push schema changes directly to database |
| `drizzle-kit pull` | Pull schema from existing database |
| `drizzle-kit check` | Check for pending migrations |
| `drizzle-kit drop` | Drop all tables in database |
| `drizzle-kit studio` | Open Drizzle Studio (GUI for database) |

## Usage

### Generate Migrations

```bash
# Generate migration files
bunx drizzle-kit generate

# With custom config
bunx drizzle-kit generate --config=./drizzle.config.ts
```

### Push Schema to Database

```bash
# Push schema changes
bunx drizzle-kit push

# Force push (destructive)
bunx drizzle-kit push --force
```

### Drizzle Studio

```bash
# Open interactive database GUI
bunx drizzle-kit studio

# Custom port
bunx drizzle-kit studio --port 3001

# Auto-open browser
bunx drizzle-kit studio --open
```

## Options

| Option | Description |
|--------|-------------|
| `--config` | Path to config file (default: drizzle.config.ts) |
| `--schema` | Override schema path |
| `--out` | Override migrations folder |
| `--force` | Force destructive operations |
| `--verbose` | Enable verbose logging |

## Examples

```bash
# Full workflow
bunx drizzle-kit generate    # Generate migration
bunx drizzle-kit push         # Apply to database

# Studio for debugging
bunx drizzle-kit studio --open
```

## Summary

| Command | Use Case |
|---------|----------|
| `generate` | Create migration files from schema |
| `push` | Apply schema to database (dev only) |
| `pull` | Sync existing database to schema |
| `studio` | Interactive database GUI |
| `check` | Verify migration status |
| `drop` | Reset database (dev only) |