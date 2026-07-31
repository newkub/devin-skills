# configuration

## index.md

# Configuration

Effect configuration options

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## package.json Dependencies

```json
{
  "dependencies": {
    "effect": "^3.x.x"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "vitest": "^1.0.0"
  }
}
```

## Effect Config

```typescript
// effect.config.ts
export default {
  // Optional Effect-specific configuration
  debug: process.env.NODE_ENV === 'development',
}
```

## Environment Variables

```env
# Effect runtime options
EFFECT_LOG_LEVEL=debug
EFFECT_TRACE=true
```

## TypeScript Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Entry Point

```typescript
// src/index.ts
import { Effect, Layer } from 'effect';

// Your main program
const program = Effect.succeed('Hello, Effect!').pipe(
  Effect.map((s) => s.toUpperCase())
);

// Run with default runtime
Effect.runPromise(program).then(console.log);
```

## Development Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

---

