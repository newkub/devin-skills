# Event Loop

## Overview

Event loop เป็นกลไกหลักของ JavaScript ที่ทำให้สามารถทำงานแบบ asynchronous ได้แม้จะเป็น single-threaded language

## How It Works

### Call Stack

JavaScript engine มี call stack เดียวที่ execute code แบบ synchronous:

```javascript
console.log('1');
console.log('2');
console.log('3');
// Output: 1, 2, 3
```

### Web APIs & Callback Queue

เมื่อเจอ asynchronous operations เช่น `setTimeout`, `fetch`, event listeners:

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// Output: 1, 3, 2
```

**Flow:**
1. `console.log('1')` execute ทันที
2. `setTimeout` ถูกส่งไป Web APIs
3. `console.log('3')` execute ทันที
4. เมื่อ timer หมด callback ถูกส่งไป Callback Queue
5. Event loop ตรวจสอบ call stack ว่าว่างหรือไม่
6. ถ้าว่าง ดึง callback จาก queue มา execute

## Microtasks vs Macrotasks

### Microtasks Queue (Higher Priority)

- Promise callbacks (`.then`, `.catch`, `.finally`)
- `queueMicrotask()`
- MutationObserver

### Macrotasks Queue (Lower Priority)

- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering

### Execution Order

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
```

**Why?**
1. Sync code execute: `1`, `4`
2. Microtasks execute first: `3`
3. Macrotasks execute after: `2`

## Event Loop Phases (Node.js)

Node.js event loop มี 6 phases:

```
┌─────────────────────────────┐
│   timers (setTimeout, etc)  │
├─────────────────────────────┤
│   pending callbacks         │
├─────────────────────────────┤
│   idle, prepare             │
├─────────────────────────────┤
│   poll (new I/O callbacks)   │
├─────────────────────────────┤
│   check (setImmediate)      │
├─────────────────────────────┤
│   close callbacks           │
└─────────────────────────────┘
```

## Common Patterns

### Sequential Async Operations

```javascript
// ❌ Wrong - doesn't guarantee order
setTimeout(() => console.log('1'), 100);
setTimeout(() => console.log('2'), 100);

// ✅ Correct - use Promise chain
async function sequential() {
  await delay(100);
  console.log('1');
  await delay(100);
  console.log('2');
}
```

### Parallel Async Operations

```javascript
// ✅ Use Promise.all for parallel
async function parallel() {
  const [result1, result2] = await Promise.all([
    fetch('/api/1'),
    fetch('/api/2')
  ]);
}
```

### Avoid Blocking the Event Loop

```javascript
// ❌ Blocking - heavy computation
function heavy() {
  for (let i = 0; i < 1e9; i++) {
    // CPU intensive
  }
}

// ✅ Non-blocking - use setImmediate or chunking
function nonBlocking() {
  let i = 0;
  function chunk() {
    const start = Date.now();
    while (i < 1e9 && Date.now() - start < 10) {
      i++;
    }
    if (i < 1e9) {
      setImmediate(chunk);
    }
  }
  chunk();
}
```

## Performance Considerations

### Avoid Starvation

```javascript
// ❌ Infinite loop blocks event loop
while (true) {
  // Never yields
}

// ✅ Use setTimeout to yield
function processItems(items) {
  let i = 0;
  function processNext() {
    if (i < items.length) {
      process(items[i++]);
      setTimeout(processNext, 0);
    }
  }
  processNext();
}
```

### Batch Operations

```javascript
// Process in batches to avoid blocking
async function batchProcess(items, batchSize = 100) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processBatch(batch);
    // Yield to event loop
    await new Promise(resolve => setImmediate(resolve));
  }
}
```

## Debugging Event Loop

### Measure Execution Time

```javascript
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

### Use Performance API

```javascript
const start = performance.now();

// ... code ...

const duration = performance.now() - start;
console.log(`Execution took ${duration}ms`);
```

## Best Practices

1. **Keep functions small** - Short functions execute faster
2. **Avoid blocking operations** - Use async patterns
3. **Use microtasks for priority** - Promises over setTimeout
4. **Chunk heavy computations** - Break into smaller tasks
5. **Monitor performance** - Use DevTools Performance tab
6. **Debounce/Throttle events** - Reduce event loop pressure

## Related Concepts

- [Async/Await](./async-patterns.md)
- [Promises](./async-patterns.md)
- [Memory Management](./memory-management.md)
- [Closures](./closures.md)
