# Architecture

## Overview

Bun ใช้ Zig และ JavaScriptCore engine เพื่อความเร็วและความสะดวก

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Applications                       │
│  (JavaScript/TypeScript/JSX/TSX)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Bun Runtime Interface                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CLI Tools   │  │   Bundler    │  │ Test Runner  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Package Mgr  │  │ File Server  │  │   Server     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  JavaScript/TypeScript Engine               │
│                    (JavaScriptCore)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Parser     │  │  Compiler    │  │  Interpreter │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   JIT        │  │   GC         │  │  Optimizer   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Bun Core Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   I/O APIs   │  │   Network    │  │  File System │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  HTTP/HTTPS  │  │   WebSocket  │  │   Streams    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    System Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   libuv      │  │   zlib       │  │   crypto     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Operating System                            │
│  (Windows, Linux, macOS)                                    │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### JavaScriptCore Engine

ใช้ JavaScriptCore จาก WebKit แทน V8:
- เร็วกว่าในบางกรณี
- Memory footprint น้อยกว่า
- Startup time เร็วกว่า

```
Source Code → Parser → AST → Bytecode → JIT → Native Code
```

### Zig Implementation

- Low-level control สำหรับ memory และ performance
- Zero-cost abstractions
- Memory safety โดย default
- Performance สูงเหมือน C/C++

### All-in-One Design

```
Bun Binary
├── Runtime
├── Package Manager
├── Bundler
├── Test Runner
├── File Server
└── CLI Tools
```

### Zero-Copy I/O

```
Traditional: Disk → Buffer A → Buffer B → Application
Zero-Copy:  Disk → Application (Direct)
```

### Parallel Operations

```
Package Installation:
Package A ────┐
Package B ────┼──→ Parallel Download
Package C ────┤
Package D ────┘
```

## Package Manager Architecture

### Dependency Resolution

```
package.json → Parse → Resolve → Lockfile → Download → Install
```

### Caching Strategy

```
Request → Check Cache → Hit/Miss → Return/Download → Cache → Return
```

## Bundler Architecture

```
Entry → Analyze → Transform → Optimize → Bundle → Output
```

## Test Runner Architecture

```
Test Files → Collect → Execute → Report
```

## Server Architecture

```
Request → Parse → Route → Handler → Response
```

## Performance Optimization

### Startup Time
- Minimal initialization
- Lazy loading
- Optimized binary size

### Runtime Performance
- JIT compilation
- Inline caching
- Optimized algorithms

### Memory Efficiency
- Efficient GC
- Memory pooling
- Zero-copy

## Summary

- เร็วกว่า Node.js ในหลายด้าน
- All-in-one solution
- Compatible กับ Node.js
- Memory safety ด้วย Zig
