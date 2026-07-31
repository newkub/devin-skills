# Safety Principles

## Core Philosophy

Biome prioritizes safety and correctness over speed.

## Safe Formatting

### No Behavior Changes

- Formatter never changes code behavior
- Only modifies whitespace and formatting
- Preserves semantics

### Deterministic Output

- Same input always produces same output
- No random or unstable formatting
- Consistent across runs

## Safe Linting

### Safe Fixes by Default

- Auto-fixes are guaranteed safe
- No behavior changes
- Can be applied automatically

### Unsafe Fixes Require Flag

- Potentially breaking fixes require `--unsafe`
- User must explicitly opt-in
- Clear warning when used

## Configuration Safety

### Schema Validation

- Config files validated against JSON schema
- Clear error messages for invalid config
- Type-safe configuration

### Default to Safe

- Recommended rules enabled by default
- Safe formatting options
- Conservative defaults

## Best Practices

### Review Unsafe Fixes

Always review changes when using `--unsafe`:

```bash
bunx biome lint --write --unsafe ./src
git diff
```

### Use CI Mode

In CI, use `biome ci` to prevent accidental writes:

```bash
bunx biome ci ./src
```

### Test Auto-Fixes

Run tests after applying auto-fixes to ensure correctness:

```bash
bunx biome check --write ./src
bun test
```
