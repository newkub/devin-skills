# Shell Reference - Bun

## Overview

Bun provides a shell API for executing system commands using backticks.

## Basic Usage

```typescript
const result = await $`ls -la`
console.log(result.stdout)
console.log result.exitCode
```

## Piping

```typescript
const files = await $`ls | grep ".ts"`
```

## Variables

```typescript
const name = "test"
await $`echo ${name}`
```

## Error Handling

```typescript
try {
  await $`invalid-command`
} catch (error) {
  console.error("Command failed:", error)
}
```

## Options

```typescript
// Silent mode
await $`command`.quiet()

// Capture stderr
await $`command`.nothrow()
```

## Shell vs Bun Shell

```toml
# bunfig.toml
[run]
shell = "system"  # Use system shell
# shell = "bun"   # Use Bun's shell
```

## Common Commands

```typescript
// Copy files
await $`cp src/*.ts dist/`

// Remove files
await $`rm -rf dist/`

// Git operations
await $`git status`
await $`git commit -m "message"`
```

---

**See also:**
- [Shell Guide](https://bun.sh/guides/runtime/shell)
