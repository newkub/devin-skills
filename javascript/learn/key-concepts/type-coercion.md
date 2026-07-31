# Type Coercion

## Overview

Type coercion คือการแปลงค่าจาก type หนึ่งไปเป็นอีก type หนึ่งโดยอัตโนมัติหรือ explicit ใน JavaScript

## Types of Coercion

### 1. Implicit Coercion (Automatic)

JavaScript แปลง types อัตโนมัติเมื่อจำเป็น

```javascript
// String + Number = String
const result = '5' + 3; // '53'

// Number - String = Number
const result2 = '5' - 3; // 2

// Boolean + Number = Number
const result3 = true + 1; // 2
const result4 = false + 1; // 1
```

### 2. Explicit Coercion (Manual)

ใช้ functions หรือ operators เพื่อแปลง types อย่างชัดเจน

```javascript
// String()
String(123); // '123'
String(true); // 'true'
String(null); // 'null'

// Number()
Number('123'); // 123
Number('hello'); // NaN
Number(true); // 1
Number(false); // 0

// Boolean()
Boolean(0); // false
Boolean(1); // true
Boolean(''); // false
Boolean('hello'); // true
```

## Coercion Rules

### String Coercion

```javascript
// ToPrimitive → ToString
String(123); // '123'
String({}); // '[object Object]'
String([1, 2]); // '1,2'
String(null); // 'null'
String(undefined); // 'undefined'
```

### Number Coercion

```javascript
// ToPrimitive → ToNumber
Number('123'); // 123
Number(''); // 0
Number('  '); // 0
Number('hello'); // NaN
Number(true); // 1
Number(false); // 0
Number(null); // 0
Number(undefined); // NaN
Number({}); // NaN
Number([]); // 0
```

### Boolean Coercion

**Falsy Values:**
- `false`
- `0`, `-0`, `0n`
- `""`, `''`, `` ` ``
- `null`
- `undefined`
- `NaN`

**Truthy Values:**
- ทุกอย่างที่ไม่ใช่ falsy

```javascript
Boolean(false); // false
Boolean(0); // false
Boolean(''); // false
Boolean(null); // false
Boolean(undefined); // false
Boolean(NaN); // false

Boolean(true); // true
Boolean(1); // true
Boolean('hello'); // true
Boolean({}); // true
Boolean([]); // true
```

## Common Coercion Scenarios

### 1. Equality Operators

#### Loose Equality (==)

```javascript
// Type coercion happens
5 == '5'; // true
null == undefined; // true
0 == false; // true
1 == true; // true
[] == false; // true
[] == 0; // true
```

#### Strict Equality (===)

```javascript
// No type coercion
5 === '5'; // false
null === undefined; // false
0 === false; // false
1 === true; // false
```

### 2. Arithmetic Operators

```javascript
// Addition
'5' + 5; // '55' (string concatenation)
5 + '5'; // '55'

// Subtraction, Multiplication, Division
'5' - 2; // 3
'5' * 2; // 10
'10' / 2; // 5

// Modulo
'10' % 3; // 1
```

### 3. Logical Operators

```javascript
// OR (||) - returns first truthy value
0 || 'default'; // 'default'
'' || 'default'; // 'default'
'hello' || 'default'; // 'hello'

// AND (&&) - returns first falsy value
0 && 'default'; // 0
'' && 'default'; // ''
'hello' && 'default'; // 'default'

// Nullish Coalescing (??) - returns first non-null/undefined
null ?? 'default'; // 'default'
undefined ?? 'default'; // 'default'
0 ?? 'default'; // 0
'' ?? 'default'; // ''
```

### 4. Conditional Statements

```javascript
// Implicit boolean coercion
if (value) {
  // runs if value is truthy
}

// Equivalent to
if (Boolean(value)) {
  // runs if value is truthy
}
```

## Abstract Operations

### ToPrimitive

แปลง object เป็น primitive value

```javascript
// Objects try valueOf() first, then toString()
const obj = {
  valueOf() { return 42; },
  toString() { return 'hello'; }
};

Number(obj); // 42 (valueOf)
String(obj); // '42' (valueOf result → toString)
```

### ToNumber

แปลง value เป็น number

```javascript
// String → Number
Number('123'); // 123
Number('0x10'); // 16 (hexadecimal)
Number('0b10'); // 2 (binary)
Number('0o10'); // 8 (octal)

// Boolean → Number
Number(true); // 1
Number(false); // 0

// Object → Number
Number([]); // 0
Number([1]); // 1
Number([1, 2]); // NaN
```

### ToString

แปลง value เป็น string

```javascript
// Number → String
String(123); // '123'
String(Infinity); // 'Infinity'
String(NaN); // 'NaN'

// Boolean → String
String(true); // 'true'
String(false); // 'false'

// Object → String
String({}); // '[object Object]'
String([]); // ''
String([1, 2]); // '1,2'
```

### ToBoolean

แปลง value เป็น boolean

```javascript
// Falsy values
Boolean(false); // false
Boolean(0); // false
Boolean(-0); // false
Boolean(0n); // false
Boolean(''); // false
Boolean(null); // false
Boolean(undefined); // false
Boolean(NaN); // false

// Truthy values
Boolean(true); // true
Boolean(1); // true
Boolean('hello'); // true
Boolean({}); // true
Boolean([]); // true
```

## Best Practices

### 1. Use Strict Equality

```javascript
// ❌ Loose equality can be confusing
if (value == null) {
  // matches null AND undefined
}

// ✅ Strict equality is explicit
if (value === null || value === undefined) {
  // clear intent
}
```

### 2. Explicit Type Conversion

```javascript
// ❌ Implicit coercion
const sum = '5' + 3; // '53'

// ✅ Explicit conversion
const sum = Number('5') + 3; // 8
const sum = parseInt('5', 10) + 3; // 8
```

### 3. Use Type Guards

```javascript
// ✅ Check type before operation
function process(value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value * 2;
  }
  throw new Error('Invalid type');
}
```

### 4. Avoid Coercion in Comparisons

```javascript
// ❌ Confusing comparison
if (value == 0) {
  // matches 0, '0', false, [], ''
}

// ✅ Explicit comparison
if (value === 0) {
  // only matches 0
}
```

### 5. Use Nullish Coalescing for Defaults

```javascript
// ❌ OR operator catches falsy values
const timeout = inputTimeout || 1000; // 0 becomes 1000

// ✅ Nullish coalescing only for null/undefined
const timeout = inputTimeout ?? 1000; // 0 stays 0
```

## Common Pitfalls

### 1. String Concatenation vs Addition

```javascript
// ❌ Unexpected string concatenation
const result = '5' + 5; // '55'

// ✅ Explicit number conversion
const result = Number('5') + 5; // 10
```

### 2. Array to Number

```javascript
// ❌ Array becomes 0
Number([]); // 0

// ✅ Check array first
if (Array.isArray(value)) {
  // handle array
}
```

### 3. Object to Boolean

```javascript
// ❌ Empty object is truthy
if ({}) {
  // always runs
}

// ✅ Check object properties
if (Object.keys(obj).length > 0) {
  // runs only if object has properties
}
```

### 4. NaN Comparison

```javascript
// ❌ NaN is not equal to itself
NaN === NaN; // false

// ✅ Use isNaN
Number.isNaN(NaN); // true
```

## Practical Examples

### Safe Number Parsing

```javascript
function safeParseNumber(value) {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

safeParseNumber('123'); // 123
safeParseNumber('hello'); // 0
safeParseNumber(null); // 0
```

### Type Checking Utilities

```javascript
function isString(value) {
  return typeof value === 'string';
}

function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
```

### Safe Equality Check

```javascript
function looseEqual(a, b) {
  return a == b;
}

function strictEqual(a, b) {
  return a === b;
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
```

## Related Concepts

- [Scope](./scope.md)
- [Data Types](../guide/features.md)
- [Operators](../guide/features.md)
