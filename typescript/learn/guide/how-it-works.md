# How It Works

## TypeScript Compilation Flow

```
┌─────────────┐
│ .ts Source  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Parsing     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ AST         │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Type Check  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Emit        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ JavaScript  │
└─────────────┘
```

## Type System Architecture

```
┌─────────────────────────────────┐
│         Type System             │
├─────────────────────────────────┤
│  Primitives: string, number    │
│  Arrays: T[]                   │
│  Objects: { key: value }       │
│  Functions: (args) => result   │
└─────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│       Advanced Types            │
├─────────────────────────────────┤
│  Generics: <T>                 │
│  Union: A | B                  │
│  Intersection: A & B           │
│  Conditional: T extends U ? X  │
└─────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│      Type Checking              │
├─────────────────────────────────┤
│  - Structural typing           │
│  - Type inference             │
│  - Widening/Narrowing         │
│  - Excess property checks     │
└─────────────────────────────────┘
```

## Type Inference Process

```typescript
// TypeScript infers type automatically
let x = 10;        // inferred as number
let y = "hello";  // inferred as string

// Function return types inferred
function add(a, b) {
  return a + b;  // inferred return type is number
}

// Explicit type annotation
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

## Key Concepts

- **Structural Typing**: Types are compatible based on structure, not name
- **Type Inference**: Automatic type deduction from values
- **Type Widening**: Narrow types become wider (e.g., `const` to `let`)
- **Type Narrowing**: Union types become specific via guards
- **Declaration Merging**: Multiple declarations merge