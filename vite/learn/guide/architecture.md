# Architecture

## Purpose

อธิบาย architecture ของ Vite เพื่อให้เข้าใจการออกแบบและหลักการทำงาน

## Scope

- Dev vs Build Architecture
- Plugin Pipeline
- Module Graph
- Dependency Pre-bundling
- File Structure

## Architecture Overview

Vite แบ่งการทำงานเป็น 2 ส่วนหลัก:

| Mode | Purpose | Tools |
|------|---------|-------|
| **Dev Server** | Development ที่เร็วด้วย Native ESM | http.server + esbuild |
| **Production** | Build ที่ optimized | Rollup/Rolldown |

```
+--------------------------------------------------+
|                    Vite                           |
+--------------------------------------------------+
|                                                   |
|  +---------------------+  +---------------------+ |
|  |   Dev Server        |  |   Production Build  | |
|  |   (Native ESM)      |  |   (Rollup/Rolldown) | |
|  +---------------------+  +---------------------+ |
|           |                       |                |
|           v                       v                |
|  +---------------------+  +---------------------+ |
|  |   Plugin Pipeline   |  |   Plugin Pipeline   | |
|  +---------------------+  +---------------------+ |
|           |                       |                |
|           v                       v                |
|  +---------------------+  +---------------------+ |
|  |   Transform        |  |   Bundle + Optimize | |
|  +---------------------+  +---------------------+ |
|                                                   |
+--------------------------------------------------+
```

## Dev Server Architecture

Dev server ใช้ Native ESM เพื่อให้ได้ instant server start:

```
+--------------------------------------------------+
|              Dev Server Architecture              |
+--------------------------------------------------+
|                                                   |
|  Browser Request                                   |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Transform         |  <-- Plugin hooks        |
|  |   (esbuild)         |                          |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Module Graph      |                          |
|  |   (in-memory)      |                          |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   File System       |                          |
|  +---------------------+                          |
|                                                   |
+--------------------------------------------------+
```

| Component | คำอธิบาย |
|-----------|----------|
| **HTTP Server** | Connect http server สำหรับ serve files |
| **Transform** | แปลง code ด้วย esbuild + plugins |
| **Module Graph** | ติดตาม module dependencies |
| **Watcher** | File watcher สำหรับ HMR |
| **WebSocket** | ส่ง HMR updates ไปยัง browser |

## Production Build Architecture

Production build ใช้ Rollup สำหรับ optimized bundle:

```
+--------------------------------------------------+
|           Production Build Architecture           |
+--------------------------------------------------+
|                                                   |
|  Source Files                                     |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Resolve Plugins   |                          |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Transform Plugins |  <-- Plugin pipeline    |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Rollup Bundle     |  <-- Core bundler        |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Generate Chunk    |                          |
|  +---------------------+                          |
|        │                                          |
|        v                                          |
|  +---------------------+                          |
|  |   Output            |  <-- dist/              |
|  +---------------------+                          |
|                                                   |
+--------------------------------------------------+
```

## Plugin Pipeline

Plugins ทำงานใน pipeline ตามลำดับ:

```
+--------------------------------------------------+
|              Plugin Pipeline                      |
+--------------------------------------------------+
|                                                   |
|  configResolved                                   |
|        │                                          |
|        v                                          |
|  +---------------------+   +--------------------+|
|  |   buildStart        |-->|  resolveId        |||
|  +---------------------+   +--------------------+||
|        │                      │                 |||
|        v                      v                  |||
|  +---------------------+   +--------------------+||
|  |   load              |<--|  transform        |||
|  +---------------------+   +--------------------+||
|        │                                          |
|        v                                          │
|  +---------------------+                         |
|  |   buildEnd          |  <-- build-complete     |
|  +---------------------+                         |
|                                                   |
+--------------------------------------------------+
```

| Hook | Phase | Description |
|------|-------|-------------|
| `configResolved` | Config | หลัง resolve config แล้ว |
| `buildStart` | Build | เริ่มต้น build |
| `resolveId` | Build | Resolve module paths |
| `load` | Build | โหลด module content |
| `transform` | Build | แปลง module code |
| `buildEnd` | Build | build เสร็จแล้ว |

## Module Graph

Module graph เก็บข้อมูลทุก module ในโปรเจกต์:

```
+--------------------------------------------------+
|              Module Graph                         |
+--------------------------------------------------+
|                                                   |
|  Module: src/main.tsx                             |
|  ├─ id: /src/main.tsx                             |
|  ├─ file: /project/src/main.tsx                   |
|  ├─ type: jsx                                     |
|  ├─ importers: [index.html]                        |
|  └─ imports: [                                     |
|        { spec: './App', type: 'esm' },             |
|        { spec: 'react', type: 'esm' }              |
|      ]                                            |
|                                                   |
+--------------------------------------------------+
```

| Property | คำอธิบาย |
|----------|----------|
| `id` | Module ID (absolute path หรือ virtual) |
| `file` | File path บน disk |
| `type` | Module type (esm, cjs, etc.) |
| `importers` | Modules ที่ import module นี้ |
| `imports` | Modules ที่ module นี้ import |

## Dependency Pre-bundling

Pre-bundling ใช้ esbuild เพื่อแปลง CJS/UMD เป็น ESM:

```
+--------------------+     +--------------------+     +--------------------+
|   Scan             | --> |   esbuild Bundle  | --> |   .vite/deps/     |
|   (find imports)   |     |   (transform)     |     |   (cached)        |
+--------------------+     +--------------------+     +--------------------+
```

| Step | คำอธิบาย |
|------|----------|
| **Scan** | หา bare imports จาก source files |
| **Resolve** | Resolve package.json exports |
| **Bundle** | esbuild bundle + minify |
| **Cache** | เก็บใน `.vite/deps/` |
| **Serve** | Serve เป็น native ESM |

## Summary

| Component | Purpose |
|-----------|---------|
| **Dev Server** | Instant start ด้วย Native ESM |
| **Production** | Optimized bundle ด้วย Rollup |
| **Plugin Pipeline** | Extend functionality |
| **Module Graph** | ติดตาม dependencies |
| **Pre-bundling** | แปลง CJS เป็น ESM |
