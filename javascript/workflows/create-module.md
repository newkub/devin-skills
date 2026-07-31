# Create Module

## Overview

วิธีสร้าง JavaScript module ด้วย ES Modules (ESM) หรือ CommonJS

## ES Modules (ESM)

### 1. Export Named Exports

```javascript
// utils/math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

export const PI = 3.14159;
```

### 2. Import Named Exports

```javascript
// main.js
import { add, subtract, PI } from './utils/math.js';

console.log(add(5, 3)); // 8
console.log(PI); // 3.14159
```

### 3. Export Default

```javascript
// utils/logger.js
export default class Logger {
  log(message) {
    console.log(message);
  }

  error(message) {
    console.error(message);
  }
}
```

### 4. Import Default

```javascript
// main.js
import Logger from './utils/logger.js';

const logger = new Logger();
logger.log('Hello');
```

### 5. Mixed Exports

```javascript
// utils/index.js
export { add, subtract } from './math.js';
export { default as Logger } from './logger.js';
export const VERSION = '1.0.0';
```

### 6. Import All

```javascript
// main.js
import * as utils from './utils/index.js';

console.log(utils.add(5, 3));
console.log(utils.VERSION);
```

## CommonJS (Node.js)

### 1. Export

```javascript
// utils/math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = {
  add,
  subtract,
  PI: 3.14159
};
```

### 2. Require

```javascript
// main.js
const { add, subtract, PI } = require('./utils/math');

console.log(add(5, 3)); // 8
console.log(PI); // 3.14159
```

### 3. Export Default

```javascript
// utils/logger.js
class Logger {
  log(message) {
    console.log(message);
  }
}

module.exports = Logger;
```

### 4. Require Default

```javascript
// main.js
const Logger = require('./utils/logger');

const logger = new Logger();
logger.log('Hello');
```

## Best Practices

### 1. ใช้ ES Modules สำหรับโปรเจกต์ใหม่

```javascript
// ✅ ถูก - ES Modules
export const utils = {
  add: (a, b) => a + b
};

// ❌ ผิด - CommonJS (สำหรับโปรเจกต์ใหม่)
module.exports = {
  add: (a, b) => a + b
};
```

### 2. ใช้ named exports สำหรับ utilities

```javascript
// ✅ ถูก
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// ❌ ผิด
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### 3. ใช้ default exports สำหรับ classes/functions หลัก

```javascript
// ✅ ถูก
export default class UserService {
  // ...
}

// ❌ ผิด
export class UserService {
  // ...
}
```

### 4. ใช้ barrel exports สำหรับ folder

```javascript
// utils/index.js
export * from './math.js';
export * from './logger.js';
export * from './validator.js';

// main.js
import { add, Logger } from './utils/index.js';
```

## Package.json Configuration

### 1. Enable ES Modules

```json
{
  "type": "module"
}
```

### 2. Use .mjs Extension

```javascript
// module.mjs
export const add = (a, b) => a + b;
```

### 3. Use .cjs Extension for CommonJS

```javascript
// module.cjs
const add = (a, b) => a + b;
module.exports = { add };
```

## Dynamic Imports

```javascript
// Load module on demand
async function loadModule() {
  const { add } = await import('./utils/math.js');
  console.log(add(5, 3));
}

// Conditional import
if (condition) {
  const module = await import('./utils/math.js');
}
```

## Common Pitfalls

### 1. ลืม .js extension ใน ES Modules

```javascript
// ❌ ผิด
import { add } from './utils/math';

// ✅ ถูก
import { add } from './utils/math.js';
```

### 2. ผสม ESM และ CommonJS

```javascript
// ❌ ผิด - ไม่ควรผสม
import { add } from './utils/math.js';
const subtract = require('./utils/math.js');

// ✅ ถูก - ใช้ระบบเดียว
import { add, subtract } from './utils/math.js';
```

### 3. Circular Dependencies

```javascript
// ❌ ผิด - circular dependency
// a.js
import { b } from './b.js';
export const a = 1;

// b.js
import { a } from './a.js';
export const b = 2;
```

## References

- [MDN: ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Node.js: ES Modules](https://nodejs.org/api/esm.html)
