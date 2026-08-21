---
description: Patterns และ best practices สำหรับ Node.js
---

## Goal

อธิบาย patterns และ best practices สำหรับการพัฒนาด้วย Node.js

## Scope

สำหรับโปรเจกต์ที่ใช้ Node.js เป็น runtime

## Common Patterns

### 1. Callback Pattern

Node.js ใช้ callback pattern สำหรับ async operations:

```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 2. Promise Pattern

ใช้ promises สำหรับ async operations:

```javascript
fs.promises.readFile('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### 3. Async/Await Pattern

ใช้ async/await สำหรับ cleaner code:

```javascript
async function readFile() {
  try {
    const data = await fs.promises.readFile('file.txt');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 4. Event Emitter Pattern

ใช้ EventEmitter สำหรับ event-driven architecture:

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('Event fired!');
});
myEmitter.emit('event');
```

### 5. Stream Pattern

ใช้ streams สำหรับ large data:

```javascript
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream);
```

## Best Practices

### 1. Error Handling

```javascript
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

### 2. Environment Variables

```javascript
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY is required');
}
```

### 3. Modular Code

แยก logic ออกเป็น modules:

```javascript
// lib/utils.js
function formatDate(date) {
  return date.toISOString();
}

module.exports = { formatDate };

// src/index.js
const { formatDate } = require('./lib/utils');
```

## Anti-Patterns

### ❌ Blocking Event Loop

```javascript
// อย่าใช้ sync operations
const data = fs.readFileSync('large-file.txt');
```

### ✅ Non-blocking

```javascript
// ใช้ async operations
const data = await fs.promises.readFile('large-file.txt');
```
