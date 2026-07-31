# Memory Management

## Overview

JavaScript เป็นภาษาที่มี garbage collection อัตโนมัติ แต่นักพัฒนายังต้องเข้าใจวิธีทำงานของ memory เพื่อเขียนโค้ดที่มีประสิทธิภาพและหลีกเลี่ยง memory leaks

## Memory Lifecycle

### 3 Phases

1. **Allocation** - จอง memory เมื่อสร้าง variables, objects, functions
2. **Usage** - อ่าน/เขียนข้อมูลใน memory
3. **Release** - คืน memory เมื่อไม่ใช้งานแล้ว (garbage collection)

```javascript
// Allocation
const user = { name: 'John', age: 30 };

// Usage
console.log(user.name);

// Release (automatic when no references)
user = null;
```

## Garbage Collection

### Mark-and-Sweep Algorithm

JavaScript engines ใช้ mark-and-sweep algorithm:

1. **Mark Phase** - ตรวจสอบ objects ที่ reachable จาก root (global, stack)
2. **Sweep Phase** - ลบ objects ที่ไม่ถูก mark

### Generational Collection

V8 engine แบ่ง memory เป็น 2 generations:

- **Young Generation** (New Space) - Objects ใหม่ ขนาดเล็ก GC เร็ว
- **Old Generation** (Old Space) - Objects เก่า ขนาดใหญ่ GC ช้ากว่า

## Common Memory Leaks

### 1. Global Variables

```javascript
// ❌ Leak - global variable never garbage collected
var globalData = [];

function processData(data) {
  globalData.push(data);
}

// ✅ Fix - use local scope
function processData(data) {
  const localData = [];
  localData.push(data);
  return localData;
}
```

### 2. Event Listeners

```javascript
// ❌ Leak - listener never removed
function setupButton() {
  const button = document.getElementById('myButton');
  button.addEventListener('click', () => {
    console.log('clicked');
  });
}

// ✅ Fix - remove listener when done
function setupButton() {
  const button = document.getElementById('myButton');
  const handler = () => console.log('clicked');
  button.addEventListener('click', handler);
  
  // Cleanup
  return () => button.removeEventListener('click', handler);
}

const cleanup = setupButton();
// Later: cleanup();
```

### 3. Closures

```javascript
// ❌ Potential leak - closure keeps large data
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  
  return function() {
    console.log('handler');
  };
}

const handler = createHandler();
// largeData ยังอยู่ใน memory แม้ไม่ได้ใช้

// ✅ Fix - avoid unnecessary captures
function createHandler() {
  return function() {
    console.log('handler');
  };
}
```

### 4. Timers

```javascript
// ❌ Leak - timer never cleared
function startTimer() {
  setInterval(() => {
    console.log('tick');
  }, 1000);
}

// ✅ Fix - clear timer
function startTimer() {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  return () => clearInterval(timer);
}

const cleanup = startTimer();
// Later: cleanup();
```

### 5. DOM References

```javascript
// ❌ Leak - DOM element removed but reference remains
let element = document.getElementById('myElement');
element.remove();
// element ยังอยู่ใน memory

// ✅ Fix - nullify reference
let element = document.getElementById('myElement');
element.remove();
element = null;
```

## Memory Optimization Techniques

### 1. Object Pooling

```javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  acquire() {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage
const pool = new ObjectPool(
  () => ({ data: null }),
  (obj) => { obj.data = null; }
);

const obj = pool.acquire();
obj.data = 'value';
pool.release(obj);
```

### 2. Lazy Loading

```javascript
// ❌ Load all data at once
const allData = loadHugeDataset();

// ✅ Load on demand
const dataCache = new Map();

async function getData(id) {
  if (dataCache.has(id)) {
    return dataCache.get(id);
  }
  
  const data = await loadFromAPI(id);
  dataCache.set(id, data);
  return data;
}
```

### 3. WeakMap for Private Data

```javascript
// ✅ WeakMap allows garbage collection
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { secret: 'hidden' });
    this.name = name;
  }
  
  getSecret() {
    return privateData.get(this).secret;
  }
}

// เมื่อ User instance ถูก garbage collect
// privateData entry จะถูกลบอัตโนมัติ
```

### 4. Avoid Premature Optimization

```javascript
// ❌ Unnecessary caching
const cache = new Map();

function add(a, b) {
  const key = `${a},${b}`;
  if (cache.has(key)) return cache.get(key);
  
  const result = a + b;
  cache.set(key, result);
  return result;
}

// ✅ Simple operation doesn't need caching
function add(a, b) {
  return a + b;
}
```

## Memory Profiling

### Chrome DevTools

1. เปิด DevTools → Memory tab
2. เลือก **Heap snapshot**
3. กด **Take snapshot**
4. วิเคราะห์ objects ที่ใช้ memory มาก

### Memory Timeline

1. เปิด DevTools → Performance tab
2. เลือก **Memory** checkbox
3. Record actions
4. ดู memory usage ตลอดเวลา

### Node.js Memory Profiling

```bash
# Start with memory profiling
node --inspect app.js

# Connect Chrome DevTools
chrome://inspect
```

```javascript
// Manual memory check
console.log(`Memory: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

// Force garbage collection (Node.js with --expose-gc)
if (global.gc) {
  global.gc();
}
```

## Best Practices

### 1. Minimize Object Creation

```javascript
// ❌ Create new object every iteration
for (let i = 0; i < 1000; i++) {
  const temp = { value: i };
  process(temp);
}

// ✅ Reuse object
const temp = { value: 0 };
for (let i = 0; i < 1000; i++) {
  temp.value = i;
  process(temp);
}
```

### 2. Use Appropriate Data Structures

```javascript
// ❌ Array for lookups (O(n))
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const user = users.find(u => u.id === 1);

// ✅ Map for lookups (O(1))
const userMap = new Map([[1, { name: 'John' }], [2, { name: 'Jane' }]]);
const user = userMap.get(1);
```

### 3. Clean Up Resources

```javascript
// Always cleanup
class ResourceManager {
  constructor() {
    this.resources = [];
  }
  
  acquire(resource) {
    this.resources.push(resource);
    return resource;
  }
  
  dispose() {
    this.resources.forEach(r => r.dispose());
    this.resources = [];
  }
}

// Use with try-finally
const manager = new ResourceManager();
try {
  const resource = manager.acquire(createResource());
  // use resource
} finally {
  manager.dispose();
}
```

### 4. Avoid Large Strings

```javascript
// ❌ Keep large string in memory
const hugeString = loadHugeString();

// ✅ Process in chunks
async function processInChunks(path) {
  const stream = fs.createReadStream(path);
  for await (const chunk of stream) {
    processChunk(chunk);
  }
}
```

## Monitoring Memory

### Browser Memory API

```javascript
// Check memory usage (Chrome only)
if (performance.memory) {
  console.log({
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit
  });
}
```

### Node.js Memory Monitoring

```javascript
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`Memory: ${Math.round(used * 100) / 100} MB`);

// Set memory limit
node --max-old-space-size=4096 app.js
```

## Related Concepts

- [Event Loop](./event-loop.md)
- [Closures](./closures.md)
- [Scope](./scope.md)
