# How It Works

## JavaScript Runtime Architecture

```
┌─────────────────────────────────────────┐
│            JavaScript Engine            │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Parser  │→ │ AST     │→ │ JIT     │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│       │              │              │    │
│       ▼              ▼              ▼    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Scanner │  │ Compiler│  │ Runtime │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

## Event Loop Mechanism

```
┌─────────────────────────────────────────┐
│                 Stack                    │
│  (LIFO - Function executions)           │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│              Heap                       │
│  (Memory allocation for objects)        │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│           Event Queue                   │
│  (Microtasks & Macrotasks)              │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│           Event Loop                    │
│  (Continuous polling)                   │
└─────────────────────────────────────────┘
```

## Execution Order

```javascript
console.log("1");              // Synchronous

setTimeout(() => console.log("2"), 0);  // Macrotask

Promise.resolve()
  .then(() => console.log("3"));         // Microtask

console.log("4");              // Synchronous

// Output: 1, 4, 3, 2
```

## Memory Management

### Stack (Primitive types)

```javascript
// Stored by value
let a = 5;
let b = a;  // Copy value
b = 10;     // a still 5
```

### Heap (Reference types)

```javascript
// Stored by reference
let obj1 = { name: "Alice" };
let obj2 = obj1;  // Copy reference
obj2.name = "Bob";  // obj1.name also "Bob"
```

## Garbage Collection

```
┌─────────────────────────────────────────┐
│         Mark and Sweep GC               │
├─────────────────────────────────────────┤
│  1. Mark: Trace all reachable objects   │
│  2. Sweep: Remove unreachable objects    │
│  3. Compact: Defragment memory          │
└─────────────────────────────────────────┘
```

## Module System

### CommonJS (Node.js)

```javascript
// Export
module.exports = { add, subtract };

// Import
const { add } = require('./math');
```

### ES Modules (Modern)

```javascript
// Export
export const add = (a, b) => a + b;
export default class Calculator { }

// Import
import Calculator, { add } from './math.js';
```

## Key Concepts

- **Call Stack**: LIFO execution context
- **Heap**: Dynamic memory allocation
- **Event Loop**: Continuously checks for tasks
- **Microtasks**: Promises, queue after current task
- **Macrotasks**: setTimeout, setInterval, I/O
- **Closure Scope**: Retained variables after function exits