# How Bun Works

## Overview

Bun ใช้ Zig และ JavaScriptCore engine จาก WebKit เพื่อความเร็วและความสะดวก

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                      │
│  (JavaScript/TypeScript Code)                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Bun Runtime Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  JS Runtime  │  │   Bundler    │  │ Test Runner  │  │
│  │ (JavaScript  │  │              │  │              │  │
│  │    Core)     │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Package Mgr  │  │  File Server │  │   Utilities  │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   System Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   I/O APIs   │  │   Network    │  │   File Sys   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Operating System                      │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### JavaScript Runtime

ใช้ JavaScriptCore จาก WebKit แทน V8:

```
Source → Parser → Compiler → JavaScriptCore → Execution
```

### Package Manager

```
bun install → Read lock → Download (Parallel) → Cache → node_modules
```

### Bundler

```
Entry → Analyze → Transform (TS → JS) → Bundle → Minify (Optional)
```

### TypeScript Support

```
.ts File → Transpile (On-the-fly) → Type Check (Optional) → Execute
```

## Node.js Compatibility

```
Node.js API → Bun Shim → Bun Native (Fast implementation)
```

## Performance Optimization

### Zero-Copy I/O

```
Disk → Buffer (Direct) → Network (No copy)
```

### Parallel Operations

```
Thread 1: ────[Task A]───
Thread 2: ────[Task B]───
Thread 3: ────[Task C]───
Thread 4: ────[Task D]───
```

## Summary

- ใช้ JavaScriptCore ที่เร็ว
- Zero-copy I/O
- Parallel operations
- All-in-one design
- Zig implementation (low-level control)
