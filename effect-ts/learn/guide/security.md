# Security

## Security Considerations

| Concern | Description | Mitigation |
|---------|-------------|------------|
| Input Validation | Validate input ก่อน process | ใช้ Zod หรือ Effect validation |
| Error Handling | Handle errors อย่างปลอดภัย | ไม่ expose sensitive data ใน errors |
| Dependency Injection | ใช้ dependency injection สำหรับ testability | ใช้ Layer สำหรับ secure service composition |
| Type Safety | ใช้ TypeScript สำหรับ type safety | Enable strict mode ใน tsconfig |

## Best Practices

### Input Validation

```typescript
import { Effect, Schema } from 'effect';

// Define schema
const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.email)
});

// Validate input
const validateUser = (data: unknown) =>
  Schema.decodeUnknown(UserSchema)(data).pipe(
    Effect.mapError((error) => new ValidationError(error))
  );
```

### Secure Error Handling

```typescript
import { Effect } from 'effect';

const safeOperation = Effect.gen(function* () {
  try {
    return yield* riskyOperation;
  } catch (error) {
    // Log error without exposing sensitive data
    yield* Effect.logError('Operation failed');
    return yield* Effect.fail(new AppError('Operation failed'));
  }
});
```

### Environment Variables

```typescript
import { Effect, Config } from 'effect';

const loadConfig = Effect.gen(function* () {
  const apiKey = yield* Config.secret('API_KEY');
  const dbUrl = yield* Config.secret('DATABASE_URL');
  
  return { apiKey, dbUrl };
});
```
