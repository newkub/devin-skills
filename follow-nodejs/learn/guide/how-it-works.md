# How Node.js Works

## ภาพรวม

Node.js เป็น JavaScript runtime ที่ใช้ Chrome V8 engine สำหรับรัน JavaScript นอก browser โดยใช้ event-driven, non-blocking I/O model

## สถาปัตยกรรม

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                      │
│  (JavaScript/TypeScript Code)                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Node.js API Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   fs         │  │   http       │  │   path       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   stream     │  │   buffer     │  │   events     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   V8 Engine Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Parser     │  │  Compiler    │  │  Interpreter │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   JIT        │  │   GC         │  │  Optimizer   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   libuv Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Event Loop   │  │ Thread Pool  │  │   I/O        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Operating System                      │
└─────────────────────────────────────────────────────────┘
```

## ส่วนประกอบหลัก

### 1. V8 Engine

Node.js ใช้ V8 engine จาก Chrome:

```
Code Execution Flow:
┌─────────────┐
│   Source    │ (JS/TS)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Parser    │ (Parse & AST)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Ignition   │ (Baseline compiler)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  TurboFan   │ (Optimizing compiler)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Execute    │ (Machine code)
└─────────────┘
```

### 2. Event Loop

Event Loop เป็นหัวใจของ Node.js:

```
Event Loop Phases:
┌─────────────────────────────────────────┐
│           timers                         │
│  (setTimeout, setInterval)              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     pending callbacks                    │
│  (I/O callbacks)                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       idle, prepare                      │
│  (internal use)                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           poll                          │
│  (new I/O events)                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           check                         │
│  (setImmediate)                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     close callbacks                     │
│  (socket.close, etc.)                   │
└─────────────────────────────────────────┘
```

### 3. libuv

libuv เป็น library ที่จัดการ I/O แบบ asynchronous:

```
I/O Operations:
┌─────────────┐
│  Request    │ (fs.readFile)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  libuv      │ (Queue request)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Thread Pool │ (Execute I/O)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Callback   │ (When done)
└─────────────┘
```

### 4. Module System

Node.js รองรับทั้ง CommonJS และ ES Modules:

```
Module Loading:
┌─────────────┐
│  require()  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Resolve    │ (Find module)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Load       │ (Read file)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Wrap       │ (IIFE wrapper)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Evaluate   │ (Execute)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Cache      │ (module.cache)
└─────────────┘
```

## การทำงานแบบ Asynchronous

### Callback Pattern

```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### Promise Pattern

```javascript
fs.promises.readFile('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Async/Await Pattern

```javascript
try {
  const data = await fs.promises.readFile('file.txt');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

## Streams

Streams ใช้สำหรับจัดการ data ขนาดใหญ่:

```
Stream Flow:
┌─────────────┐
│   Source    │ (Read)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Transform   │ (Process)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Destination│ (Write)
└─────────────┘
```

## สรุป

Node.js ทำงานได้เพราะ:
- V8 engine ที่เร็ว
- Event loop ที่ efficient
- Non-blocking I/O
- libuv สำหรับ cross-platform
- Module system ที่ flexible
