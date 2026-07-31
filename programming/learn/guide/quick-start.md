# Quick Start

## Purpose

แนวทางลัดสำหรับเริ่มเขียนโปรแกรมอย่างรวดเร็ว

## Scope

- First Program
- Basic Concepts
- Common Patterns

## First Program

### TypeScript

```typescript
// src/index.ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message = greet('World');
console.log(message);
```

### Run

```bash
npx ts-node src/index.ts
# Output: Hello, World!
```

## Basic Patterns

### Variables

```typescript
// Const (immutable)
const PI = 3.14159;

// Let (mutable)
let count = 0;
count = count + 1;

// Type annotation
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
```

### Functions

```typescript
// Arrow function
const add = (a: number, b: number): number => a + b;

// Function with default parameter
const greet = (name: string = 'Guest'): string => `Hello, ${name}`;

// Rest parameters
const sum = (...nums: number[]): number =>
  nums.reduce((acc, n) => acc + n, 0);

// Async function
async function fetchData(url: string) {
  const response = await fetch(url);
  return response.json();
}
```

### Arrays

```typescript
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const evens = numbers.filter(n => n % 2 === 0);

// Reduce
const total = numbers.reduce((acc, n) => acc + n, 0);

// Find
const found = numbers.find(n => n > 3);
```

### Objects

```typescript
// Object type
interface User {
  name: string;
  age: number;
  email?: string;
}

// Object literal
const user: User = {
  name: 'John',
  age: 30,
};

// Destructuring
const { name, age } = user;

// Spread
const updatedUser = { ...user, age: 31 };
```

### Classes

```typescript
class Person {
  constructor(
    public name: string,
    private age: number
  ) {}

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }

  getAge(): number {
    return this.age;
  }
}

const person = new Person('John', 30);
console.log(person.greet());
```

## Common Patterns

### Null Safety

```typescript
// Optional chaining
const street = user?.address?.street;

// Nullish coalescing
const name = user.name ?? 'Anonymous';

// Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### Error Handling

```typescript
// Try-catch
try {
  const data = JSON.parse(input);
} catch (error) {
  console.error('Invalid JSON:', error);
}

// Async error handling
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP error');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

### Async Patterns

```typescript
// Promise chain
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/await
async function getData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// Parallel execution
const [users, posts] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts')
].map(p => p.json()));
```

### Functional Patterns

```typescript
// Composition
const pipe = (...fns) => (x) =>
  fns.reduce((v, f) => f(v), x);

const process = pipe(
  (x) => x.trim(),
  (x) => x.toLowerCase(),
  (x) => x.replace(' ', '-')
);

// Curry
const curriedAdd = (a: number) => (b: number) => a + b;
const add5 = curriedAdd(5);
console.log(add5(3)); // 8
```

## Decision Matrix

| Scenario | Pattern | Example |
|----------|---------|---------|
| Transform array | map | `[1,2,3].map(x => x*2)` |
| Filter array | filter | `[1,2,3].filter(x => x>1)` |
| Sum array | reduce | `[1,2,3].reduce((a,b) => a+b)` |
| Safe access | optional chaining | `obj?.prop?.nested` |
| Default value | nullish coalescing | `val ?? 'default'` |
| Async parallel | Promise.all | `await Promise.all([p1, p2])` |

## Quick Reference

### Common Types

```typescript
// Primitive
string, number, boolean

// Complex
string[], number[], { name: string }

// Union
string | number

// Optional
string | undefined

// Generic
Array<T>, Promise<T>, Map<K,V>
```

### Common Commands

| Command | Description |
|---------|-------------|
| `npx ts-node file.ts` | Run TypeScript |
| `tsc --init` | Create tsconfig |
| `bun run build` | Build project |
| `bun run dev` | Start dev server |

## Next Steps

| Resource | Description |
|----------|-------------|
| [key-concept.md](key-concept.md) | Programming concepts |
| [features.md](features.md) | Language features |
| [best-practices.md](best-practices.md) | Best practices |