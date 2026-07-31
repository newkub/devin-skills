# Effect

## What is Effect

Effect คือ description ของ computation:
- **Declarative** - describe computation โดยไม่ execute
- **Composable** - compose effects ได้
- **Type-safe** - TypeScript support

## Creating Effects

```typescript
import { Effect } from 'effect';

const succeed = Effect.succeed(42);
const fail = Effect.fail(new Error('Failed'));
const sync = Effect.sync(() => Math.random());
```

## Effect Features

- **Error Handling** - built-in error handling
- **Dependency Injection** - dependency injection support
- **Concurrency** - concurrency support
