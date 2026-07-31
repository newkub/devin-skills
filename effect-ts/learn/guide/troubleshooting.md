# Troubleshooting

## Common Issues

### Type Errors

| Issue | Cause | Solution |
|-------|-------|----------|
| Type inference fails | Missing type annotations | Add explicit type annotations |
| Generic type mismatch | Wrong type parameters | Check `Effect<E, A, R>` signature |
| Service not found | Missing layer | Provide required layer |

**Example:**
```typescript
// Wrong - missing type
const program = Effect.gen(function* () {
  return 'Hello';
});

// Correct - with type
const program: Effect.Effect<string, never, never> = Effect.gen(function* () {
  return 'Hello';
});
```

### Runtime Errors

| Issue | Cause | Solution |
|-------|-------|----------|
| Effect not running | Forgot to call run method | Use `Effect.runPromise()` |
| Service resolution failed | Layer not provided | Provide layer with `Effect.provide()` |
| Fiber hung | Infinite loop | Add timeout or cancellation |

**Example:**
```typescript
// Wrong - effect not running
const program = Effect.succeed(42);

// Correct - run the effect
Effect.runPromise(program);
```

### Performance Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Memory leaks | Unclosed resources | Use `Scope` for cleanup |
| Slow execution | Sequential operations | Use `Effect.all()` for parallel |
| High overhead | Too many effects | Batch operations |

**Example:**
```typescript
// Slow - sequential
const slow = Effect.gen(function* () {
  const a = yield* fetch(1);
  const b = yield* fetch(2);
  const c = yield* fetch(3);
});

// Fast - parallel
const fast = Effect.all([
  fetch(1),
  fetch(2),
  fetch(3)
], { concurrency: 'unbounded' });
```

## Debugging Tips

1. **Use Effect.runPromiseExit** สำหรับดู error details
2. **Enable fiber tracking** สำหรับ debugging
3. **Log intermediate values** ด้วย `Effect.log()`
4. **Use Vitest** สำหรับ isolated testing
