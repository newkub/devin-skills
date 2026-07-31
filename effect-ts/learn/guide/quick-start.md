# Quick Start

## Installation

```bash
# ติดตั้ง Effect
bun add effect

# สำหรับ development
bun add -D typescript tsx
```

## Basic Program

สร้างไฟล์ `src/index.ts`:

```typescript
import { Effect } from 'effect';

// Define a simple effect
const program = Effect.succeed('Hello, Effect!').pipe(
  Effect.map((s) => s.toUpperCase())
);

// Run the effect
Effect.runPromise(program).then(console.log);
// Output: HELLO, EFFECT!
```

## Error Handling

```typescript
import { Effect } from 'effect';

const divide = (a: number, b: number): Effect.Effect<number, Error, never> =>
  b === 0
    ? Effect.fail(new Error('Division by zero'))
    : Effect.succeed(a / b);

const program = Effect.gen(function* () {
  const result = yield* divide(10, 2);
  console.log(`Result: ${result}`);
  
  // Handle potential error
  const safe = yield* Effect.exit(divide(10, 0));
  console.log(`Exit: ${safe._tag}`);
});

Effect.runPromise(program);
```

## Running Programs

```bash
# Using tsx (recommended for development)
tsx src/index.ts

# Using bun
bun run src/index.ts

# Using node with experimental import
node --import effect src/index.ts
```

## Next Steps

- อ่าน [Key Concepts](key-concept.md) เพื่อเข้าใจ core concepts
- ดู [Features](features.md) เพื่อดู features ทั้งหมด
- ดู [Best Practices](best-practices.md) เพื่อ pattern ที่แนะนำ
