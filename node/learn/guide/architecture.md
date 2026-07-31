# Architecture

## ภาพรวม

Node.js ถูกออกแบบมาเพื่อ event-driven, non-blocking I/O โดยใช้ V8 engine และ libuv

## สถาปัตยกรรมระดับสูง

```
┌─────────────────────────────────────────────────────────────┐
│                      User Applications                       │
│  (JavaScript/TypeScript)                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js API Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   fs         │  │   http       │  │   path       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   stream     │  │   buffer     │  │   events     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   V8 Engine Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Parser     │  │  Ignition    │  │  TurboFan    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   JIT        │  │   GC         │  │  Optimizer   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    libuv Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Event Loop   │  │ Thread Pool  │  │   I/O        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   DNS        │  │   Timer      │  │   Signals    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Operating System                            │
│  (Windows, Linux, macOS)                                    │
└─────────────────────────────────────────────────────────────┘
```

## ส่วนประกอบหลัก

### 1. V8 Engine

Node.js ใช้ V8 engine จาก Chrome:

**ข้อดี:**
- เร็วมากด้วย JIT compilation
- รองรับ ES6+ features
- Memory management ที่ดี

**การทำงาน:**
```
Source Code → Parser → AST → Ignition → TurboFan → Machine Code
```

### 2. Event Loop

Event Loop เป็นหัวใจของ Node.js:

**Phases:**
1. **Timers**: setTimeout, setInterval
2. **Pending Callbacks**: I/O callbacks
3. **Idle, Prepare**: Internal use
4. **Poll**: New I/O events
5. **Check**: setImmediate
6. **Close Callbacks**: socket.close, etc.

### 3. libuv

libuv เป็น library ที่จัดการ I/O แบบ asynchronous:

**Features:**
- Cross-platform I/O
- Thread pool สำหรับ blocking operations
- Event loop implementation
- Async DNS resolution

### 4. Module System

Node.js รองรับทั้ง CommonJS และ ES Modules:

**CommonJS:**
```javascript
const fs = require('fs');
module.exports = { something };
```

**ES Modules:**
```javascript
import fs from 'fs';
export { something };
```

## สถาปัตยกรรม Event Loop

### Event Loop Phases Detail

```
┌─────────────────────────────────────────┐
│           timers                         │
│  Execute callbacks from setTimeout       │
│  and setInterval                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     pending callbacks                    │
│  Execute I/O callbacks deferred to      │
│  the next loop iteration                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       idle, prepare                      │
│  Only used internally                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           poll                          │
│  Retrieve new I/O events                │
│  Execute I/O callbacks                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           check                         │
│  Execute callbacks from setImmediate    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     close callbacks                     │
│  Execute close event callbacks          │
└─────────────────────────────────────────┘
```

## สถาปัตยกรรม Thread Pool

### Thread Pool Usage

```
Blocking Operations:
┌─────────────┐
│   File I/O  │ ──→ Thread Pool
└─────────────┘
┌─────────────┐
│   DNS       │ ──→ Thread Pool
└─────────────┘
┌─────────────┐
│ Compression │ ──→ Thread Pool
└─────────────┘
┌─────────────┐
│ Crypto      │ ──→ Thread Pool
└─────────────┘
```

## สถาปัตยกรรม Streams

### Stream Types

```
Stream Types:
┌─────────────┐
│  Readable   │ (fs.createReadStream)
└─────────────┘
┌─────────────┐
│  Writable   │ (fs.createWriteStream)
└─────────────┘
┌─────────────┐
│  Duplex     │ (net.Socket)
└─────────────┘
┌─────────────┐
│ Transform   │ (zlib.createGzip)
└─────────────┘
```

## สถาปัตยกรรม Buffers

### Buffer Structure

```
Buffer Layout:
┌─────────────────────────────────────┐
│  Byte 0 │ Byte 1 │ Byte 2 │ ...     │
└─────────────────────────────────────┘
```

## Performance Optimization

### 1. Event Loop Optimization

- **Avoid blocking**: ไม่ใช้ synchronous operations
- **Use workers**: ใช้ worker threads สำหรับ CPU-intensive tasks
- **Cluster mode**: ใช้ cluster สำหรับ multi-core

### 2. Memory Optimization

- **Stream data**: ใช้ streams แทน loading ทั้งหมด
- **Buffer pooling**: Reuse buffers
- **Memory limits**: ตั้งค่า memory limits

### 3. I/O Optimization

- **Async I/O**: ใช้ async operations
- **Connection pooling**: Reuse connections
- **Caching**: Cache ผลลัพธ์

## สรุป

สถาปัตยกรรมของ Node.js ถูกออกแบบมาเพื่อ:
- **Non-blocking I/O**: จัดการ concurrent requests ได้ดี
- **Event-driven**: ตอบสนอง events ได้รวดเร็ว
- **Cross-platform**: รันได้ทุก platform
- **Scalability**: ขยาย scale ได้ง่าย
