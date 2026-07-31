# Core Concepts - Node.js

## Overview

Node.js เป็น JavaScript runtime ที่ใช้ Chrome V8 engine สำหรับรัน JavaScript นอก browser มี event-driven, non-blocking I/O model

## Event Loop

```javascript
console.log('Start')
setTimeout(() => console.log('Timeout'), 0)
Promise.resolve().then(() => console.log('Promise'))
console.log('End')
```

## Modules

### CommonJS

```javascript
module.exports = { add: (a, b) => a + b }
const { add } = require('./lib')
```

### ES Modules

```javascript
export const add = (a, b) => a + b
import { add } from './lib.mjs'
```

## Async Patterns

### Promises

```javascript
fs.promises.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

### Async/Await

```javascript
async function read() {
  const data = await fs.promises.readFile('file.txt', 'utf8')
  return data
}
```
