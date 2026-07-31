# Testing

## Testing Effect Apps

### Unit Testing

```typescript
import { describe, it, expect } from 'vitest';
import { Effect } from 'effect';

describe('Effect', () => {
  it('should succeed', async () => {
    const result = await Effect.runPromise(Effect.succeed(42));
    expect(result).toBe(42);
  });

  it('should handle errors', async () => {
    const result = await Effect.runPromiseExit(
      Effect.fail(new Error('Test error'))
    );
    expect(result._tag).toBe('Failure');
  });
});
```

### Integration Testing

```typescript
import { Effect, Layer } from 'effect';

// Mock service
const mockDatabase = Layer.succeed(Database, {
  query: (sql) => Effect.succeed(`Mock result: ${sql}`)
});

// Test with mock
describe('Integration', () => {
  it('should use mock service', async () => {
    const program = Effect.gen(function* () {
      const db = yield* Effect.service(Database);
      return yield* db.query('SELECT * FROM users');
    });

    const result = await Effect.runPromise(
      program.pipe(Effect.provide(mockDatabase))
    );
    expect(result).toBe('Mock result: SELECT * FROM users');
  });
});
```

### Testing Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Effect.runPromise | Run effect และ await result | Simple unit tests |
| Effect.runPromiseExit | Run effect และ get Exit type | Test error handling |
| Layer.succeed | Mock service สำหรับ testing | Isolated unit tests |
| TestRuntime | Custom runtime สำหรับ tests | Advanced test scenarios |

### Mocking Services

```typescript
import { Effect, Layer } from 'effect';

// Define mock implementation
const mockLogger = Layer.succeed(Logger, {
  log: (message) => Effect.sync(() => console.log(`[TEST] ${message}`))
});

// Use in test
Effect.runPromise(
  program.pipe(Effect.provide(mockLogger))
);
```
