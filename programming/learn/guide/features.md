# Features

## Purpose

สรุป features และ capabilities ของการเขียนโปรแกรมสมัยใหม่

## Scope

- Language Features
- Data Types
- Control Structures
- Modern Capabilities

## Language Features

### Variables and Constants

| Feature | Syntax | Description |
|---------|--------|-------------|
| **var** | `var x = 1` | Function-scoped, hoisted (JS) |
| **let** | `let x = 1` | Block-scoped (TS/JS) |
| **const** | `const x = 1` | Block-scoped, immutable binding |
| **val** | `val x = 1` | Immutable (Kotlin/Scala) |
| **let vs const** | - | let for mutable, const for constants |

### Data Types

| Category | Types |
|----------|-------|
| **Primitives** | number, string, boolean, null, undefined, symbol, bigint |
| **Complex** | object, array, function, class |
| **TypeScript** | enum, tuple, union, intersection, generics |
| **Advanced** | never, void, unknown, any |

### TypeScript Specific

| Feature | Example |
|---------|---------|
| **Generics** | `Array<T>`, `Promise<T>` |
| **Union** | `string \| number` |
| **Intersection** | `A & B` |
| **Conditional** | `T extends U ? X : Y` |
| **Mapped** | `{ [K in Keys]: Value }` |
| **Template Literal** | `` `hello ${name}` `` |

## Control Structures

### Conditional

| Structure | Syntax | Use Case |
|-----------|--------|----------|
| **if-else** | `if (x) {...} else {...}` | Two branches |
| **else if** | `else if (x) {...}` | Multiple branches |
| **switch** | `switch (x) { case: ... }` | Many values |
| **ternary** | `x ? a : b` | Simple condition |
| **guard clauses** | `if (!valid) return` | Early exit |

### Loops

| Loop | Syntax | Use Case |
|------|--------|----------|
| **for** | `for (let i=0; i<n; i++)` | Counted iterations |
| **while** | `while (condition)` | Condition-based |
| **do-while** | `do {...} while (condition)` | At least once |
| **for...of** | `for (const item of array)` | Iterable items |
| **for...in** | `for (const key in object)` | Object keys |

### Advanced Iteration

```typescript
// forEach
array.forEach(item => console.log(item));

// map
const doubled = array.map(x => x * 2);

// filter
const evens = array.filter(x => x % 2 === 0);

// reduce
const sum = array.reduce((acc, x) => acc + x, 0);

// find
const found = array.find(x => x.id === 1);

// some/every
const hasEven = array.some(x => x % 2 === 0);
const allPositive = array.every(x => x > 0);
```

## Functions

### Function Types

| Type | Syntax | Description |
|------|--------|-------------|
| **Declaration** | `function greet() {}` | Hoisted |
| **Expression** | `const greet = function() {}` | Not hoisted |
| **Arrow** | `const greet = () => {}` | Lexical this |
| **Method** | `{ greet() {} }` | Object method |
| **Generator** | `function* gen() {}` | Yields values |
| **Async** | `async function fetch() {}` | Returns Promise |

### Parameters

| Feature | Syntax | Description |
|---------|--------|-------------|
| **Default** | `(x = 1)` | Default value |
| **Rest** | `(...args)` | Collect remaining |
| **Destructuring** | `({ name, age })` | Extract from object |
| **Optional** | `(x?: number)` | May be undefined |
| **Named** | `(x: number): void` | Type annotation |

### Closures

```typescript
function counter() {
  let count = 0; // private state
  return () => ++count;
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2
```

## Object-Oriented Features

### Classes

| Feature | Syntax |
|---------|--------|
| **Class** | `class Person {}` |
| **Constructor** | `constructor(name) {}` |
| **Properties** | `name: string` |
| **Methods** | `greet() {}` |
| **Static** | `static count = 0` |
| **Getters/Setters** | `get age() {}` |

### Inheritance

| Feature | Syntax |
|---------|--------|
| **extends** | `class Student extends Person` |
| **super** | `super(name)` |
| **override** | `override greet()` |
| **abstract** | `abstract calculate()` |
| **interface** | `interface Serializable {}` |

### Modern OOP

```typescript
// Composition
const withLogging = (obj: object) => ({
  ...obj,
  log: () => console.log('logged'),
});

// Mixins
const sayHi = {
  hi() { console.log('hi'); }
};

class MyClass {}
Object.assign(MyClass.prototype, sayHi);
```

## Functional Features

### Pure Functions

| Characteristic | Description |
|----------------|-------------|
| **Same input** | Returns same output |
| **No side effects** | No mutation, I/O |
| **Immutable** | No external state change |

### Higher-Order Functions

```typescript
// Function as parameter
const withRetry = (fn: () => T, attempts: number) => {
  for (let i = 0; i < attempts; i++) {
    try { return fn(); }
    catch { /* retry */ }
  }
};

// Function as return value
const createLogger = (prefix: string) => {
  return (msg: string) => console.log(`${prefix}: ${msg}`);
};
```

### Immutability

```typescript
// Immutable operations
const addItem = (arr, item) => [...arr, item];
const updateItem = (arr, index, newVal) =>
  arr.map((item, i) => i === index ? newVal : item);
const removeItem = (arr, index) =>
  arr.filter((_, i) => i !== index);
```

## Async Features

### Promises

| Method | Description |
|--------|-------------|
| `.then()` | Chain success handler |
| `.catch()` | Handle rejection |
| `.finally()` | Always execute |
| `Promise.all()` | Wait all |
| `Promise.race()` | First resolved |
| `Promise.allSettled()` | All settled |

### Async/Await

```typescript
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
    throw error;
  }
}

// Parallel execution
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

## Modern Syntax

### Optional Chaining

```typescript
// Safe property access
const street = user?.address?.street;
const city = user?.address?.city ?? 'Unknown';
```

### Nullish Coalescing

```typescript
// ?? vs ||
const port = process.env.PORT ?? 3000;
const name = user.name ?? 'Anonymous';
```

### Destructuring

```typescript
// Array
const [first, second, ...rest] = array;

// Object
const { name, age, city = 'Bangkok' } = person;
```

### Spread/Rest

```typescript
// Spread
const merged = { ...obj1, ...obj2 };
const combined = [...arr1, ...arr2];

// Rest
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
```

## Summary

| Feature Category | Key Features |
|-----------------|--------------|
| **Variables** | let, const, type inference |
| **Functions** | Arrow, async, generators, closures |
| **Objects** | Classes, inheritance, composition |
| **Async** | Promises, async/await, parallel |
| **Modern** | Destructuring, spread, optional chaining |