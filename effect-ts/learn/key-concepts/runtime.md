# Runtime

## What is Runtime

Runtime คือ execution environment สำหรับ Effect:
- **Execution** - execute effects
- **Error Handling** - handle errors
- **Resource Management** - manage resources

## Using Runtime

```typescript
import { Effect, Runtime } from 'effect';

const runtime = Runtime.defaultRuntime;
const result = await Effect.succeed(42).runPromise(runtime);
```

## Runtime Features

- **Default Runtime** - default runtime สำหรับ most cases
- **Custom Runtime** - custom runtime สำหรับ specific needs
- **Resource Cleanup** - automatic resource cleanup
