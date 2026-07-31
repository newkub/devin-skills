# Hoisting

## Overview

Hoisting เป็นพฤติกรรมของ JavaScript ที่ย้าย declarations ไปยังด้านบนสุดของ scope ก่อนที่ code จะถูก execute

## ความหมาย

Hoisting คือการที่ JavaScript engine ย้าย declarations (function declarations และ variable declarations) ไปยังด้านบนสุดของ current scope ก่อนที่ code จะถูก execute

## Variable Hoisting

### var Declarations

```javascript
console.log(myVar); // undefined (ไม่ error)
var myVar = 5;
console.log(myVar); // 5

// ถูกแปลงเป็น:
var myVar;
console.log(myVar); // undefined
myVar = 5;
console.log(myVar); // 5
```

### let and const Declarations

```javascript
console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization
let myLet = 5;

console.log(myConst); // ReferenceError: Cannot access 'myConst' before initialization
const myConst = 10;
```

## Function Hoisting

### Function Declarations

```javascript
sayHello(); // 'Hello'

function sayHello() {
  console.log('Hello');
}
```

### Function Expressions

```javascript
sayHello(); // TypeError: sayHello is not a function

const sayHello = function() {
  console.log('Hello');
};
```

### Arrow Functions

```javascript
sayHello(); // TypeError: sayHello is not a function

const sayHello = () => {
  console.log('Hello');
};
```

## Temporal Dead Zone (TDZ)

TDZ คือช่วงเวลาตั้งแต่เริ่ม scope จนถึงจุดที่ตัวแปรถูก declare สำหรับ let และ const

```javascript
{
  // TDZ เริ่มต้นที่นี่
  console.log(myVar); // ReferenceError

  // TDZ จบเมื่อถึงจุด declaration
  let myVar = 5;
  console.log(myVar); // 5
}
```

## Best Practices

### 1. Declare Variables ก่อนใช้งาน

```javascript
// ✅ ถูก
let count = 0;
console.log(count);

// ❌ ผิด
console.log(count);
let count = 0;
```

### 2. ใช้ let/const แทน var

```javascript
// ✅ ถูก
const PI = 3.14159;
let count = 0;

// ❌ ผิด
var PI = 3.14159;
var count = 0;
```

### 3. ใช้ Function Expressions สำหรับ consistency

```javascript
// ✅ ถูก - ทั้งหมดเป็น expressions
const add = (a, b) => a + b;
const subtract = function(a, b) { return a - b; };

// ❌ ผิด - ผสมกัน
function add(a, b) { return a + b; }
const subtract = (a, b) => a - b;
```

### 4. Group Declarations ด้วยกัน

```javascript
// ✅ ถูก
function init() {
  const config = { /* ... */ };
  let state = null;
  const events = [];

  // code ที่ใช้ตัวแปรเหล่านี้
}

// ❌ ผิด - declarations กระจัดกระจาย
function init() {
  const config = { /* ... */ };
  // code
  let state = null;
  // code
  const events = [];
}
```

## Common Pitfalls

### 1. สับสนระหว่าง var และ let/const

```javascript
// var ถูก hoist แต่เป็น undefined
console.log(x); // undefined
var x = 5;

// let/const ไม่ถูก hoist ในลักษณะเดียวกัน
console.log(y); // ReferenceError
let y = 5;
```

### 2. Function Declaration vs Expression

```javascript
// Function declaration ถูก hoist
greet(); // 'Hello'

function greet() {
  console.log('Hello');
}

// Function expression ไม่ถูก hoist
greet(); // TypeError

const greet = function() {
  console.log('Hello');
};
```

### 3. TDZ ใน loops

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
  setTimeout(() => console.log(i), 100); // 0, 1, 2, 3, 4
}
```

## Performance Considerations

- Hoisting เป็น compile-time behavior ไม่มีผลต่อ runtime performance
- การใช้ let/const ช่วยป้องกัน bugs จาก hoisting
- Function declarations มีประสิทธิภาพดีกว่า expressions เล็กน้อย

## References

- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [JavaScript.info: Variable Scope](https://javascript.info/closure#variable-scope)
