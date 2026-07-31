# How It Works

## Purpose

อธิบายกลไกการทำงานของ programming เพื่อให้เข้าใจว่าโค้ดถูก execute อย่างไร

## Scope

- Compilation Process
- Runtime Execution
- Memory Management

## Compilation Process

### Interpreted vs Compiled

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Interpreted Language                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Source Code ──────> Interpreter ──────> Output                   │
│   (.js, .py)          (runtime)           (result)                   │
│                                                                      │
│   Line by line execution, errors at runtime                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        Compiled Language                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Source Code ──> Compiler ──> Assembly ──> Machine Code ──> Run   │
│   (.c, .rs)                                (executable)              │
│                                                                      │
│   Full compilation before execution, errors at compile time        │
└─────────────────────────────────────────────────────────────────────┘
```

### TypeScript/JavaScript Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TypeScript Flow                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   .ts files ──> TypeScript ──> Transpile ──> .js files              │
│                  Compiler        (same level)                       │
│                       │                                               │
│                       ▼                                               │
│                  Type Check                                          │
│                   (errors)                                          │
│                       │                                               │
│                       ▼                                               │
│                  Bundling ──> .bundle.js                           │
│                   (optional)                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Execution Flow

### Function Call Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Call Stack                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   main()                                                            │
│     │                                                               │
│     ├── f1()                                                        │
│     │     │                                                         │
│     │     ├── f2()                                                  │
│     │     │     │                                                   │
│     │     │     └── f3() ← Top of stack                            │
│     │     │                                                         │
│     │     └── f4()                                                  │
│     │                                                               │
│     └── f5()                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Event Loop (JavaScript)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Event Loop                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │ Call Stack   │ ── │ Event Queue  │ ── │ Web APIs     │        │
│   │ (sync)       │    │ (async)      │    │ (timers, etc)│        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│          │                   ▲                    ▲                 │
│          │                   │                    │                 │
│          └───────────────────┴────────────────────┘                 │
│                        Event Loop                                     │
│                                                                      │
│   1. Execute stack until empty                                       │
│   2. Process microtasks (Promises)                                   │
│   3. Process macrotasks (setTimeout, etc)                            │
│   4. Repeat                                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Memory Management

### Stack vs Heap

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Memory Model                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   STACK                          HEAP                               │
│   ┌─────────────┐                ┌─────────────────────────────┐   │
│   │ a: 10       │                │  Object { name: "John" }     │   │
│   │ b: true     │                │  Array [1, 2, 3]             │   │
│   │ fn: address │                │  String (large)              │   │
│   │ ─────────── │                │  Dynamic data               │   │
│   │ return addr │                │  Referenced by stack         │   │
│   └─────────────┘                └─────────────────────────────┘   │
│                                                                      │
│   - Fixed size                 - Variable size                      │
│   - Fast access               - Slower access                      │
│   - Automatic cleanup         - Manual/Garbage collected           │
│   - LIFO order                - Random access                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Garbage Collection

| Type | Description | Languages |
|------|-------------|-----------|
| **Reference Counting** | นับ references, เคลียร์เมื่อ 0 | Python (cycle aware) |
| **Mark and Sweep** | mark ที่ reachable, sweep ที่ไม่ | JavaScript, Go |
| **Generational** | แบ่งตามอายุ (young/old) | JVM, .NET |
| **Tracing** | ตาม object graph | Most modern languages |

## Error Handling Flow

### Try-Catch-Finally

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Error Handling                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   try {                                                             │
│       // Normal code                                                │
│       riskyOperation();                                             │
│   } catch (error) {                                                 │
│       // Handle error                                               │
│       logError(error);                                              │
│   } finally {                                                       │
│       // Always executes                                            │
│       cleanup();                                                    │
│   }                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Error Propagation

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Error Propagation                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Layer 1 ──> Layer 2 ──> Layer 3 ──> Layer 4                       │
│   (catch)      (catch)     (catch)      (throw)                    │
│                                                                      │
│   Error can be caught at any level or propagate up                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Asynchronous Programming

### Promise Chain

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Promise Flow                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Promise1 ──> .then ──> Promise2 ──> .then ──> Promise3           │
│       │                              │                              │
│       ▼                              ▼                              │
│   ┌────────┐                   ┌────────┐                          │
│   │resolve │                   │resolve │                          │
│   │ or     │                   │ or     │                          │
│   │reject  │                   │reject  │                          │
│   └────────┘                   └────────┘                          │
│                                                                      │
│   Async/Await:                                                      │
│   const result = await promise();                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Summary

| Mechanism | Description |
|-----------|-------------|
| **Compilation** | Source → Executable (compiled) or Runtime (interpreted) |
| **Call Stack** | LIFO execution of functions |
| **Event Loop** | Process async tasks in queue |
| **Memory** | Stack (fast, fixed) vs Heap (slow, dynamic) |
| **Error Handling** | Try-catch with propagation |
| **Async** | Promises/async-await for non-blocking |