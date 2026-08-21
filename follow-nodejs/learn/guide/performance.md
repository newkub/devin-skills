---
description: ประสิทธิภาพและการ optimize สำหรับ Node.js
---

## Goal

อธิบายประสิทธิภาพของ Node.js และวิธีการ optimize

## Scope

สำหรับโปรเจกต์ที่ต้องการประสิทธิภาพสูง

## ประสิทธิภาพของ Node.js

### Event Loop

- **Non-blocking I/O** - รองรับ concurrent operations
- **Single-threaded** - ใช้ event loop แทน multi-threading
- **Asynchronous** - ใช้ callbacks, promises, async/await

### V8 Engine

- **JIT Compilation** - Compile JavaScript ขณะ runtime
- **Optimization** - Inline caching และ hidden classes
- **Garbage Collection** - Automatic memory management

## Optimization Tips

### 1. ใช้ Async/Await

```javascript
// ❌ Callback hell
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ✅ Async/await
const data = await fs.promises.readFile('file.txt');
console.log(data);
```

### 2. ใช้ Streams

```javascript
// ❌ Load ทั้งไฟล์ไว้ใน memory
const data = fs.readFileSync('large-file.txt');

// ✅ Stream ข้อมูล
const stream = fs.createReadStream('large-file.txt');
stream.pipe(res);
```

### 3. ใช้ Worker Threads

```javascript
const { Worker } = require('worker_threads');

const worker = new Worker('./heavy-task.js');
worker.on('message', (result) => {
  console.log(result);
});
```

### 4. ใช้ Clustering

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  require('./server');
}
```

### 5. Cache Results

```javascript
const cache = new Map();

async function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
}
```

## Profiling

ใช้ Node.js profiler:

```bash
node --prof script.js
node --prof-process isolate-*.log > profile.txt
```

หรือใช้ Chrome DevTools:

```bash
node --inspect script.js
```
