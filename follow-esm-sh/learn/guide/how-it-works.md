# esm.sh - How It Works

ภาพรวมการทำงานของ esm.sh

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                      esm.sh Processing Pipeline                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Request: https://esm.sh/vue@3.4.21                            │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────┐                                               │
│   │   Router    │ → Parse package, version, options             │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │   Fetcher   │ → Fetch package.json and source from bun      │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │  Resolver   │ → Resolve dependencies and build graph        │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │   Bundler   │ → Bundle with esbuild                         │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │  Tree Shake │ → Remove unused exports                       │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │  Minifier   │ → Minify and add headers                      │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   Response: ES Module ready for browser                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Import Resolution

### Step 1: Package Parsing

```text
Input: https://esm.sh/vue@3.4.21

Parsed:
├── package: vue
├── version: 3.4.21
├── entry: dist/vue.esm-browser.js (from package.json)
└── target: es2020 (default)
```

### Step 2: bun Fetch

```text
┌────────────────────────────────────────────┐
│  bun registry API                         │
│                                            │
│  1. GET https://registry.bunjs.org/vue/3.4.21 │
│  2. Get package.json                       │
│  3. Find "module" or "exports" field       │
│  4. Fetch entry file                      │
│                                            │
└────────────────────────────────────────────┘
```

### Step 3: Dependency Graph

```text
vue@3.4.21
    │
    ├── @vue/shared@3.4.21
    │       └── @vue/reactivity@3.4.21
    │
    └── @vue/runtime-core@3.4.21
            ├── @vue/reactivity@3.4.21
            └── @vue/runtime-dom@3.4.21
                    └── @vue/shared@3.4.21
```

## Bundling Process

### esbuild Integration

```javascript
// esm.sh uses esbuild for bundling
// Configuration:

{
  entryPoints: ['package/vue@3.4.21'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  treeShaking: true,
  minify: true
}
```

### Input Code

```javascript
// vue/package.json
{
  "module": "dist/vue.esm-browser.js"
}

// vue/dist/vue.esm-browser.js
import { compile } from './compiler/index.js';
import * as runtime from './runtime/index.js';

export { createApp, h, ref, reactive, /* ... */ };
```

### Output Code

```javascript
// After bundling and tree-shaking
// Only imported exports are included

import { createApp, h, ref } from './chunk-xxx.js';

export { createApp, h, ref };
```

## Tree Shaking Logic

### How Tree Shaking Works

```text
┌────────────────────────────────────────────────────────┐
│                 Tree Shaking Process                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│   Source:                                               │
│   ┌─────────────────────────────────────────────────┐  │
│   │ import { a, b, c } from 'pkg';                  │  │
│   │ import { d } from 'pkg';                        │  │
│   └─────────────────────────────────────────────────┘  │
│                         │                              │
│                         ▼                              │
│   ┌─────────────────────────────────────────────────┐  │
│   │   Bundler analyzes which exports are used      │  │
│   └─────────────────────────────────────────────────┘  │
│                         │                              │
│                         ▼                              │
│   Result:                                        │
│   ┌─────────────────────────────────────────────────┐  │
│   │ Only { a, b, c, d } exports are included       │  │
│   │ All other exports are removed                   │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Example: Vue

```javascript
// Before tree-shaking (full Vue)
import * as Vue from 'https://esm.sh/vue@3';
// Result: ~40KB gzipped

// After tree-shaking (only used features)
import { ref, computed } from 'https://esm.sh/vue@3';
// Result: ~10KB gzipped
```

## Caching Strategy

### Cache Layers

```text
┌─────────────────────────────────────────────────┐
│              CDN Cache Hierarchy                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Layer 1: Browser Cache                          │
│  └── Stores by Cache-Control headers            │
│                                                  │
│  Layer 2: esm.sh Edge Cache                      │
│  └── Cached at CDN edge locations               │
│                                                  │
│  Layer 3: Origin Cache                           │
│  └── esm.sh server cache                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Cache Key

```text
# Version-pinned (long cache)
https://esm.sh/vue@3.4.21
Cache-Control: public, max-age=31536000, immutable

# Unpinned (short cache)
https://esm.sh/vue
Cache-Control: public, max-age=3600
```

## Error Handling

### Fallback Mechanism

```text
Request fails
    │
    ├──▶ Retry with different CDN
    │
    ├──▶ Try unpkg fallback
    │
    └──▶ Return error with guidance
```

### Version Not Found

```javascript
// If version doesn't exist
{
  "error": "Version 99.99.99 not found for package vue",
  "available": ["3.4.21", "3.4.20", "3.4.19", ...]
}
```

## Performance Flow

### Cold Request

```text
User Request (first time)
    │
    ├── Fetch from bun (2-3s)
    ├── Bundle with esbuild (500ms)
    ├── Tree-shake (200ms)
    ├── Minify (300ms)
    └── Return to user (~4s total)

Cache Hit (subsequent requests)
    │
    └── Return from edge (~50ms)
```

### Optimization Techniques

```text
┌─────────────────────────────────────────────────┐
│              Performance Optimizations           │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Parallel fetching of dependencies            │
│  2. Incremental bundling                         │
│  3. Aggressive caching (immutable URLs)         │
│  4. Brotli compression                           │
│  5. HTTP/2 multiplexing                          │
│  6. Edge caching at CDN layer                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Monitoring

### Health Endpoint

```text
https://esm.sh/status

Response:
{
  "status": "ok",
  "cache": {
    "hitRate": 0.95,
    "totalRequests": 1000000
  },
  "upstream": {
    "bun": "ok",
    "deno": "ok"
  }
}
```

### Package Browser

```text
https://esm.sh/package/vue

Displays:
- Available versions
- Export map
- Bundle size
- Dependencies
```

## สรุป

1. esm.sh ใช้ esbuild สำหรับ bundling
2. Tree-shaking ลบ exports ที่ไม่ได้ใช้
3. Caching ที่หลาย layers เพื่อความเร็ว
4. Error handling พร้อม fallbacks
5. Health monitoring ผ่าน status endpoint
