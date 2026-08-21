# esm.sh - Features

คุณสมบัติและ capabilities ของ esm.sh

## Core Features

### 1. Native ES Modules

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { createApp } from 'https://esm.sh/vue@3';
    
    createApp({
      data() { return { count: 0 }; }
    }).mount('#app');
  </script>
</head>
<body>
  <div id="app">{{ count }}</div>
</body>
</html>
```

### 2. Automatic Tree Shaking

```javascript
// Import only what you need
import { ref, computed, watch } from 'https://esm.sh/vue@3';

// Bundle size: ~10KB vs full 40KB
```

### 3. Built-in TypeScript Support

```typescript
// Types are automatically included
import { createApp } from 'https://esm.sh/vue@3';
import type { Component } from 'https://esm.sh/vue@3';

// Full type checking without setup
```

### 4. Dependency Bundling

```javascript
// Automatically bundles dependencies
import { createApp } from 'https://esm.sh/vue@3';

// vue → @vue/reactivity → @vue/shared
// All bundled into single file
```

## URL Options

### Version Pinning

| Option | Example | Description |
|--------|---------|-------------|
| Exact | `vue@3.4.21` | Specific version |
| Major | `vue@3` | Latest 3.x |
| Minor | `vue@3.4` | Latest 3.4.x |
| Tag | `vue@next` | By bun tag |

### Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `target` | `?target=es2020` | ES target |
| `external` | `?external=react` | External deps |
| `no-dts` | `?no-dts` | Skip types |
| `dev` | `?dev` | Dev build |
| `esm` | `?esm` | Force ESM output |

## Supported Packages

### Popular Libraries

```javascript
// UI Frameworks
import { createApp } from 'https://esm.sh/vue@3';
import { createRoot } from 'https://esm.sh/react@18';
import { h, render } from 'https://esm.sh/preact@10';

// Utilities
import { debounce } from 'https://esm.sh/lodash-es@4';
import { marked } from 'https://esm.sh/marked@9';
import { z } from 'https://esm.sh/zod@3';

// Testing
import { test, expect } from 'https://esm.sh/vitest@1';
```

### CSS-in-JS

```javascript
import { styled } from 'https://esm.sh/styled-components@6';
import { css } from 'https://esm.sh/@emotion/react';
```

## Integration Patterns

### Import Map

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://esm.sh/vue@3",
    "react": "https://esm.sh/react@18",
    "lodash-es": "https://esm.sh/lodash-es@4"
  }
}
</script>

<script type="module">
  import { createApp } from 'vue';
  import { debounce } from 'lodash-es';
</script>
```

### Dynamic Import

```javascript
// Lazy load on demand
const vue = await import('https://esm.sh/vue@3');
const app = vue.createApp({});

// Conditional load
if (condition) {
  const { heavyFeature } = await import('https://esm.sh/heavy-pkg@1');
}
```

### Fallback Pattern

```javascript
async function loadModule(url, fallback) {
  try {
    return await import(url);
  } catch {
    return fallback ? await import(fallback) : null;
  }
}

// Usage
const vue = await loadModule(
  'https://esm.sh/vue@3',
  'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
);
```

## Performance Features

### Preconnect

```html
<head>
  <link rel="preconnect" href="https://esm.sh">
  <link rel="dns-prefetch" href="https://esm.sh">
</head>
```

### Module Preload

```html
<!-- Preload critical modules -->
<link rel="modulepreload" href="https://esm.sh/vue@3">
<link rel="modulepreload" href="https://esm.sh/vue@3/router">
<link rel="modulepreload" href="https://esm.sh/vue@3/pinia">
```

### Streaming

```html
<!-- Use streaming for better UX -->
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3';
  // Progressive loading
</script>
```

## Development Features

### Development Mode

```javascript
// Use unminified builds for debugging
import { createApp } from 'https://esm.sh/vue@3?dev';
// Returns: vue/dist/vue.esm-browser.prod.js
// vs dev: vue/dist/vue.esm-browser.js
```

### Source Maps

```javascript
// Automatic source maps
import { createApp } from 'https://esm.sh/vue@3';
// debug with full source
```

### Hot Module Replacement

```javascript
// In development with Vite
// vite.config.js
export default {
  resolve: {
    alias: {
      'vue': 'https://esm.sh/vue@3'
    }
  }
};
```

## Deno Integration

### Import Map

```json
// import_map.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3"
  }
}

// Run with: deno run --import-map import_map.json app.ts
```

### Direct Import

```typescript
// deno app.ts
import { createApp } from 'https://esm.sh/vue@3';

createApp({
  data() {
    return { message: 'Hello from Deno!' };
  }
}).mount('#app');
```

## Error Handling

### Package Not Found

```javascript
// Returns helpful error
const response = await fetch('https://esm.sh/nonexistent@1');
// Response: 404 with message
```

### Version Not Found

```javascript
// Suggests available versions
import 'https://esm.sh/vue@99.99.99';
// Error: Version 99.99.99 not found
// Suggestion: Use vue@3.4.21 or vue@3
```

### Network Failure

```javascript
// Graceful degradation
try {
  return await import('https://esm.sh/vue@3');
} catch (error) {
  console.error('Failed to load vue');
  return null; // or fallback
}
```

## Best Practices

### Production Checklist

```javascript
// ✅ Use exact versions
import { createApp } from 'https://esm.sh/vue@3.4.21';

// ✅ Preconnect in HTML head
<link rel="preconnect" href="https://esm.sh" crossorigin>

// ✅ Use import map for multiple packages
// Reduces redundant lookups

// ✅ Preload critical modules
<link rel="modulepreload" href="https://esm.sh/vue@3">
```

### Bundle Size Optimization

```javascript
// ❌ Bad - imports entire library
import Vue from 'https://esm.sh/vue';
const app = Vue.createApp({});

// ✅ Good - named imports for tree-shaking
import { createApp } from 'https://esm.sh/vue@3';
const app = createApp({});

// ✅ Better - specific subpath
import { ref, computed } from 'https://esm.sh/vue@3';
```

## Comparison

| Feature | esm.sh | skypack | jsdelivr |
|---------|--------|---------|----------|
| Tree Shaking | ✅ | ✅ | ❌ |
| TypeScript | ✅ | ✅ | ❌ |
| Deno Support | ✅ | ✅ | ❌ |
| Bundle External | ❌ | ✅ | ❌ |
| CDN Failover | ❌ | ❌ | ✅ |
| File Combining | ❌ | ❌ | ✅ |

## สรุป

- esm.sh รองรับ ESM, tree-shaking, และ TypeScript
- ใช้ import map สำหรับ multiple packages
- Preconnect และ preload ช่วยเพิ่ม performance
- รองรับทั้ง browser และ Deno