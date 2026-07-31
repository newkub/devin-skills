# Configuration

## TypeScript Configuration

ตั้งค่า `tsconfig.json` สำหรับ Effect:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Effect Runtime Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableRuntime` | boolean | true | เปิด/ปิด Effect runtime |
| `enableFiberTracking` | boolean | false | Track fibers สำหรับ debugging |
| `enableTracing` | boolean | false | Enable tracing สำหรับ performance monitoring |
| `maxFibers` | number | 1000 | Maximum concurrent fibers |
| `fiberTimeToLive` | number | 60000 | Fiber timeout in milliseconds |

## Environment Variables

```env
# Effect runtime configuration
EFFECT_ENABLE_RUNTIME=true
EFFECT_ENABLE_FIBER_TRACKING=false
EFFECT_ENABLE_TRACING=false
EFFECT_MAX_FIBERS=1000

# Application-specific
EFFECT_API_KEY=your_key
EFFECT_LOG_LEVEL=info
```

## Configuration Example

```typescript
import { Effect, Config } from 'effect';

// Load configuration from environment
const config = Effect.gen(function* () {
  const apiKey = yield* Config.string('EFFECT_API_KEY');
  const logLevel = yield* Config.string('EFFECT_LOG_LEVEL').pipe(
    Config.withDefault('info')
  );
  
  return { apiKey, logLevel };
});

// Run with configuration
Effect.runPromise(config);
```
