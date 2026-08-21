# esm.sh - Key Concepts

แนวคิดหลักและคำศัพท์สำคัญสำหรับ esm.sh

## 1. How esm.sh Works

### ESM CDN Concept

```text
┌─────────────────────────────────────────────────────────┐
│                    esm.sh Architecture                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   bun package                    Browser                 │
│       │                              │                   │
│       │    ┌──────────────────┐      │                   │
│       │    │     esm.sh       │      │                   │
│       │    │  ┌────────────┐  │      │                   │
│       └───▶│  │  Bundler   │  │◀──────┘                   │
│            │  │  + Tree    │  │                        │
│            │  │  Shaking   │  │                        │
│            │  └────────────┘  │                        │
│            └──────────────────┘                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Import Flow

```javascript
// Browser
import { createApp } from 'https://esm.sh/vue@3';

// esm.sh resolve:
// 1. Fetch package.json from bun
// 2. Bundle ESM module
// 3. Apply tree-shaking
// 4. Return optimized module
```

## 2. URL Patterns

### Basic Format

```text
https://esm.sh/{package}@{version}
```

### Examples

| URL | Description |
|-----|-------------|
| `https://esm.sh/vue` | Latest Vue |
| `https://esm.sh/vue@3` | Vue 3.x latest |
| `https://esm.sh/vue@3.4` | Vue 3.4.x latest |
| `https://esm.sh/vue@3.4.21` | Exact version |
| `https://esm.sh/lodash-es` | ESM build of lodash |
| `https://esm.sh/react@18` | React 18 |

### Deep Import

```javascript
// Import specific export
import { debounce } from 'https://esm.sh/lodash-es@4/debounce';
import { useState } from 'https://esm.sh/react@18/hooks';
```

### Options

```text
https://esm.sh/vue@3?target=es2022
https://esm.sh/lodash?no-dts
https://esm.sh/react?external=react-dom
```

## 3. Export Conditions

### Pin Dependencies

```javascript
// Import with pinned versions
import { createApp } from 'https://esm.sh/vue@3.4.21';
import { debounce } from 'https://esm.sh/lodash-es@4.17.21';
```

### Externalize Dependencies

```javascript
// Externalize react peer deps
import { createElement } from 'https://esm.sh/react@18?external=react';
```

### Development Mode

```javascript
// Use development build
import { createApp } from 'https://esm.sh/vue@3?dev';
```

## 4. Tree Shaking

### How it Works

```javascript
// source code
import { debounce, throttle } from 'lodash-es';

// Bundled (only debounce and throttle included)
import _ from 'lodash-es';
export { debounce, throttle } from 'lodash-es';
```

### Automatic Tree Shaking

```javascript
// Import only what you use
import { ref, computed } from 'https://esm.sh/vue@3';

// Only ref and computed are bundled
// rest of Vue is not included
```

## 5. TypeScript Support

### Type Declarations

```typescript
// esm.sh provides types automatically
import { createApp } from 'https://esm.sh/vue@3';

// Types are fetched from DefinitelyTyped
// No additional setup needed
```

### Import Types

```typescript
// Use type-only imports
import type { Component } from 'https://esm.sh/vue@3';

const MyComponent: Component = {
  // ...
};
```

## 6. Deno Compatibility

### Same API

```typescript
// Works in both browser and Deno
import { createApp } from 'https://esm.sh/vue@3';

// Deno specific imports
import { serve } from 'https://esm.sh/https://deno.land/x/std/server/server.ts';
```

### Deno Import Map

```json
{
  "imports": {
    "vue": "https://esm.sh/vue@3",
    "react": "https://esm.sh/react@18"
  }
}
```

## 7. Caching Strategy

### Version Pinning

```javascript
// ✅ Good - exact version
import { createApp } from 'https://esm.sh/vue@3.4.21';

// ⚠️ Okay - major version
import { createApp } from 'https://esm.sh/vue@3';

// ❌ Risky - no version
import { createApp } from 'https://esm.sh/vue';
```

### Cache Headers

```text
Cache-Control: public, max-age=31536000, immutable

# For pinned versions - long cache
# For unpinned - short cache (revalidation)
```

## 8. Performance Optimizations

### Bundle Optimization

```javascript
// Preconnect to esm.sh
<link rel="preconnect" href="https://esm.sh" crossorigin>

// Preload critical modules
<link rel="modulepreload" href="https://esm.sh/vue@3">
```

### Lazy Loading

```javascript
// Dynamic import for non-critical modules
const { createApp } = await import('https://esm.sh/vue@3');
```

## 9. Error Handling

### Fallback Pattern

```javascript
async function loadModule(url) {
  try {
    return await import(url);
  } catch (error) {
    console.error('Failed to load:', url);
    return null;
  }
}

// Usage
const vue = await loadModule('https://esm.sh/vue@3');
if (vue) {
  const app = vue.createApp({});
}
```

### Network Errors

```javascript
// Handle network failures
async function safeImport(url) {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await import(url);
    } catch (error) {
      lastError = error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }

  throw lastError;
}
```

## 10. Best Practices

### Recommended Patterns

```javascript
// 1. Use version pinning
import { createApp } from 'https://esm.sh/vue@3.4.21';

// 2. Preconnect in HTML
<link rel="preconnect" href="https://esm.sh" crossorigin>

// 3. Use esm.sh instead of skypack/cdpn
// Better tree-shaking and performance

// 4. Combine imports wisely
import { ref, computed } from 'https://esm.sh/vue@3';
// vs separate imports
import { ref } from 'https://esm.sh/vue@3';
import { computed } from 'https://esm.sh/vue@3';
```

### Avoid

```javascript
// ❌ Don't use unpinned versions in production
import { createApp } from 'https://esm.sh/vue';

// ❌ Don't import entire library when only parts needed
import Vue from 'https://esm.sh/vue';
Vue.createApp({});

// ✅ Use named exports for tree-shaking
import { createApp } from 'https://esm.sh/vue';
```

## สรุป

- esm.sh เป็น ESM CDN ที่ bundle และ optimize อัตโนมัติ
- รองรับ tree-shaking, TypeScript, และ Deno
- ใช้ version pinning สำหรับ production
- Preconnect เพื่อเพิ่ม performance
