# Scope

## Overview

Scope คือบริบทที่กำหนดว่า variables และ functions สามารถเข้าถึงได้จากที่ไหนใน code

## Types of Scope

### 1. Global Scope

Variables ที่ประกาศนอก function ทุกตัวจะอยู่ใน global scope

```javascript
const globalVar = 'I am global';

function showGlobal() {
  console.log(globalVar); // ✅ Accessible
}

showGlobal(); // I am global
console.log(globalVar); // I am global
```

### 2. Function Scope

Variables ที่ประกาศด้วย `var` ภายใน function จะมี scope เฉพาะ function นั้น

```javascript
function testScope() {
  var functionVar = 'I am function scoped';
  console.log(functionVar); // ✅ Accessible
}

testScope(); // I am function scoped
console.log(functionVar); // ❌ ReferenceError
```

### 3. Block Scope

Variables ที่ประกาศด้วย `let` และ `const` จะมี scope เฉพาะ block `{}`

```javascript
if (true) {
  let blockVar = 'I am block scoped';
  const blockConst = 'Me too';
  console.log(blockVar); // ✅ Accessible
}

console.log(blockVar); // ❌ ReferenceError
```

### 4. Lexical Scope

Functions สามารถเข้าถึง variables จาก outer scope ที่ถูกประกาศ

```javascript
function outer() {
  const outerVar = 'outer';
  
  function inner() {
    console.log(outerVar); // ✅ Accessible (lexical scope)
  }
  
  inner();
}

outer(); // outer
```

## Scope Chain

JavaScript ค้นหา variables ผ่าน scope chain จาก innermost ไป outermost

```javascript
const global = 'global';

function outer() {
  const outer = 'outer';
  
  function inner() {
    const inner = 'inner';
    console.log(inner);   // inner (local)
    console.log(outer);   // outer (outer scope)
    console.log(global);  // global (global scope)
  }
  
  inner();
}

outer();
```

## Variable Shadowing

เมื่อ variable ใน inner scope มีชื่อเดียวกับ outer scope จะเกิด shadowing

```javascript
const name = 'Global';

function showName() {
  const name = 'Local'; // Shadows global name
  console.log(name); // Local
}

showName(); // Local
console.log(name); // Global
```

## Hoisting

### var Hoisting

`var` declarations ถูก hoisted ไปด้านบนของ scope แต่ยังไม่มีค่า

```javascript
console.log(hoistedVar); // undefined (not ReferenceError)
var hoistedVar = 'value';

// Equivalent to:
var hoistedVar;
console.log(hoistedVar);
hoistedVar = 'value';
```

### let/const Hoisting

`let` และ `const` ถูก hoisted แต่อยู่ใน Temporal Dead Zone (TDZ)

```javascript
console.log(hoistedLet); // ❌ ReferenceError (TDZ)
let hoistedLet = 'value';
```

### Function Hoisting

Function declarations ถูก hoisted ทั้งหมด

```javascript
hoistedFunction(); // ✅ Works

function hoistedFunction() {
  console.log('I am hoisted');
}
```

Function expressions ไม่ถูก hoist

```javascript
notHoisted(); // ❌ TypeError

const notHoisted = function() {
  console.log('I am not hoisted');
};
```

## Closures and Scope

Closures เกิดเมื่อ function เข้าถึง variables จาก outer scope หลังจาก outer function สิ้นสุด

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

## Module Scope

ES Modules มี scope ของตัวเอง ไม่ใช่ global scope

```javascript
// module.js
const moduleVar = 'module scoped';

export function showModuleVar() {
  console.log(moduleVar); // ✅ Accessible
}

// main.js
import { showModuleVar } from './module.js';
console.log(moduleVar); // ❌ Not accessible
```

## Best Practices

### 1. Use const by Default

```javascript
// ✅ Prefer const
const API_URL = 'https://api.example.com';
const config = { timeout: 5000 };

// Use let only when reassignment needed
let counter = 0;
counter++;
```

### 2. Avoid var

```javascript
// ❌ Avoid var
var oldStyle = 'deprecated';

// ✅ Use let/const
let modern = 'recommended';
const constant = 'best';
```

### 3. Minimize Scope

```javascript
// ❌ Unnecessary global scope
let globalCounter = 0;

function increment() {
  globalCounter++;
}

// ✅ Local scope
function createCounter() {
  let counter = 0;
  return () => ++counter;
}
```

### 4. Block Scope for Loops

```javascript
// ❌ var leaks outside loop
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 5, 5, 5, 5, 5

// ✅ let has block scope
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2, 3, 4
```

### 5. Avoid Shadowing

```javascript
// ❌ Confusing shadowing
const name = 'Global';

function process(name) {
  const name = 'Local'; // Shadows parameter
  console.log(name);
}

// ✅ Use different names
const globalName = 'Global';

function process(userName) {
  const localName = 'Local';
  console.log(localName);
}
```

## Common Pitfalls

### 1. Loop with var

```javascript
// ❌ Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

// ✅ Solution 1: let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// ✅ Solution 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

### 2. this in Nested Functions

```javascript
const obj = {
  value: 42,
  show: function() {
    // ❌ this is undefined in strict mode
    setTimeout(function() {
      console.log(this.value);
    }, 100);
    
    // ✅ Arrow function preserves this
    setTimeout(() => {
      console.log(this.value);
    }, 100);
  }
};
```

### 3. Global Pollution

```javascript
// ❌ Accidental global
function leak() {
  leaked = 'I am global'; // Missing var/let/const
}

// ✅ Always declare
function noLeak() {
  const local = 'I am local';
}
```

## Related Concepts

- [Closures](./closures.md)
- [Hoisting](./hoisting.md)
- [This Keyword](./this-keyword.md)
- [Memory Management](./memory-management.md)
