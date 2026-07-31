# Key Concept

## What is JavaScript?

JavaScript เป็น programming language ที่ใช้กันอย่างแพร่หลายสำหรับ web development รองรับ multiple paradigms (imperative, functional, OOP) และทำงานได้ทั้ง client-side และ server-side

## Core Features

### 1. Variables & Scoping

```javascript
// var, let, const
var oldStyle = "function scoped";
let blockScoped = "block scoped";
const immutable = "cannot reassign";

// Destructuring
const { name, age } = person;
const [first, second] = array;
```

### 2. Functions

```javascript
// Arrow functions
const add = (a, b) => a + b;

// Default parameters
function greet(name = "World") {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### 3. Classes (ES6)

```javascript
class Person {
  #privateField = "hidden";
  
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
  
  static create(name) {
    return new Person(name, 0);
  }
}
```

### 4. Modules (ES6)

```javascript
// Named exports
export const PI = 3.14159;
export function circleArea(r) {
  return PI * r * r;
}

// Default export
export default class Calculator { }

// Import
import Calculator, { PI } from './math.js';
```

### 5. Async Programming

```javascript
// Promises
fetch(url)
  .then(res => res.json())
  .catch(err => console.error(err));

// Async/Await
async function getData() {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

### 6. Closures & Privacy

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
```

## JavaScript vs TypeScript

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| Type System | Dynamic | Static (optional) |
| Compilation | Not needed | Required |
| Error Detection | Runtime | Compile-time |
| IDE Support | Good | Excellent |
| Learning Curve | Easy | Moderate |
| Ecosystem | Native | Compatible with JS |

## Key Concepts Summary

- **Prototype-based OOP**: Inheritance via prototypes
- **First-class functions**: Functions as values
- **Closures**: Lexical scoping for data privacy
- **Event-driven**: Non-blocking async operations
- **Single-threaded**: Event loop handles concurrency