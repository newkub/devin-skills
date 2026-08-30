# Zod Reference

## Version Info

- Package: `zod` v4.4.3 (published Aug 20, 2026)
- License: MIT
- Peer Dependencies: None (zero external dependencies)
- TypeScript: >=5.5.0 (older versions may work but not officially supported)
- Runtime: Node.js and all modern browsers
- Bundle: 2kb core (gzipped)
- Source: https://zod.dev

## Install

```bash
# npm
bun add zod

# Bun
bun add zod

# Also available on jsr.io as @zod/zod
```

## TypeScript Configuration

Zod requires `strict` mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Defining Schemas

```ts
import * as z from 'zod';

// Primitive types
const string = z.string();
const number = z.number();
const boolean = z.boolean();

// Object schema
const Player = z.object({
  username: z.string(),
  xp: z.number(),
});

// Array
const numbers = z.array(z.number());

// Union
const stringOrNumber = z.union([z.string(), z.number()]);

// Coercion
const coercedNumber = z.coerce.number();

// Custom validation
const custom = z.custom<string>((val) => typeof val === 'string');
```

## Parsing Data

```ts
// .parse() — throws ZodError on failure
const data = Player.parse({ username: 'billie', xp: 100 });
// => returns { username: 'billie', xp: 100 }

// .safeParse() — returns result object (no throw)
const result = Player.safeParse({ username: 42, xp: '100' });
if (!result.success) {
  result.error; // ZodError instance
} else {
  result.data; // { username: string; xp: number }
}

// Async variants (for async refinements/transforms)
await Player.parseAsync({ username: 'billie', xp: 100 });
await Player.safeParseAsync('hello');
```

## Handling Errors

```ts
try {
  Player.parse({ username: 42, xp: '100' });
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues;
    // [
    //   { expected: 'string', code: 'invalid_type', path: ['username'], message: 'Invalid input: expected string' },
    //   { expected: 'number', code: 'invalid_type', path: ['xp'], message: 'Invalid input: expected number' }
    // ]
  }
}
```

## Type Inference

```ts
// Infer output type
type Player = z.infer<typeof Player>;
// { username: string; xp: number }

// Infer input and output types separately
const mySchema = z.string().transform((val) => val.length);

type MySchemaIn = z.input<typeof mySchema>;   // string
type MySchemaOut = z.output<typeof mySchema>;  // number (same as z.infer)
```

## Matching an Existing Type

```ts
type Player = {
  username: string;
  xp: number;
};

const Player = z.toZod<Player>()(
  z.object({
    username: z.string(),
    xp: z.number(),
  })
);
```

## Schema Composition

```ts
// Spread syntax (recommended — reduces TS compilation time)
const BaseUser = z.object({
  id: z.string(),
  name: z.string(),
});

const UserWithEmail = z.object({
  ...BaseUser.shape,
  email: z.string(),
});

// .safeExtend() — for schemas with refinements
const Extended = BaseUser.safeExtend({ role: z.string() });

// .pick() and .omit()
const OnlyId = BaseUser.pick({ id: true });
const WithoutId = BaseUser.omit({ id: true });

// .partial() — all fields optional
const PartialUser = BaseUser.partial();

// .required() — all fields required
const RequiredUser = PartialUser.required();
```

## Advanced Patterns

```ts
// .refine() — custom validation
const password = z.string().refine((val) => val.length >= 8, {
  message: 'Password must be at least 8 characters',
});

// .transform() — data transformation after validation
const trimmed = z.string().transform((val) => val.trim());

// .pipe() — chaining transformations
const pipeline = z.string().pipe(z.string().transform((v) => v.length));

// .preprocess() — normalize before validation
const normalized = z.preprocess((val) => String(val), z.string());

// .discriminatedUnion() — tagged unions
const Result = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: z.string() }),
  z.object({ status: z.literal('error'), message: z.string() }),
]);

// .default() — default value on output side
const withDefault = z.string().default('hello');

// .readonly() — immutable data
const immutable = z.object({ id: z.string() }).readonly();
```

## Recursive Types

```ts
import * as z from 'zod';

interface Category {
  name: string;
  subcategories: Category[];
}

const Category: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(Category),
  })
);
```

## Zod Mini (Bundle Size Optimization)

```ts
// 64% bundle size reduction — use for size-constrained environments
import * as z from 'zod/mini';

const User = z.object({
  name: z.string(),
  age: z.number(),
});
```

## Sources

- Home: https://zod.dev
- Basic Usage: https://zod.dev/basics
- Defining Schemas: https://zod.dev/api
- Error Customization: https://zod.dev/error-customization
