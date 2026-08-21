# esm.sh - Configuration

การตั้งค่าและปรับแต่ง esm.sh

## URL Options

### Version Pinning

```text
https://esm.sh/{package}@{version}
```

| Format | Example | Description |
|--------|---------|-------------|
| Exact | `vue@3.4.21` | Specific version |
| Major | `vue@3` | Latest 3.x |
| Minor | `vue@3.4` | Latest 3.4.x |
| Tag | `vue@next` | By bun tag |

### Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `target` | `?target=es2020` | ES target |
| `external` | `?external=react` | External dependencies |
| `no-dts` | `?no-dts` | Skip type declarations |
| `dev` | `?dev` | Use dev build |
| `esm` | `?esm` | Force ESM output |

## ES Target Options

### Common Targets

```text
?target=es2015    # ES6
?target=es2017    # ES8
?target=es2020    # ES11
?target=es2022    # ES13
?target=esnext    # Latest
```

### Browser Compatibility

```javascript
// ES2020 (good compatibility)
import { createApp } from 'https://esm.sh/vue@3?target=es2020';

// ES2022 (modern browsers)
import { createApp } from 'https://esm.sh/vue@3?target=es2022';
```

## External Dependencies

### Mark as External

```javascript
// React with peer dependencies marked external
import { createElement } from 'https://esm.sh/react@18?external=react-dom';

// Lodash with all deps external
import { debounce } from 'https://esm.sh/lodash-es?external';
```

### When to Use External

```javascript
// ✅ Use when you already have the dependency
// If you load React once, mark it external

// ❌ Don't use when you want bundle optimization
// esm.sh will bundle everything anyway
```

## TypeScript Configuration

### Default Behavior

esm.sh automatically provides TypeScript types from DefinitelyTyped.

```typescript
// Types are automatically included
import { createApp } from 'https://esm.sh/vue@3';

// Full type checking works
const app = createApp({
  data() { return { count: 0 }; }
});
```

### Disable TypeScript

```javascript
// Skip type declarations
import { createApp } from 'https://esm.sh/vue@3?no-dts';

// Useful when:
- Bundle size matters
- Types not needed
- Build time concerns
```

## Development vs Production

### Development Build

```javascript
// Unminified version with source maps
import { createApp } from 'https://esm.sh/vue@3?dev';

// Good for debugging
// Larger bundle size
```

### Production Build

```javascript
// Minified, optimized version
import { createApp } from 'https://esm.sh/vue@3';

// Default behavior
// Smaller bundle size
```

## Bundle Optimization

### Tree Shaking

```javascript
// ✅ Good - named imports
import { ref, computed, watch } from 'https://esm.sh/vue@3';

// ❌ Bad - namespace import
import * as Vue from 'https://esm.sh/vue@3';
// Includes entire library
```

### Selective Imports

```javascript
// Import only what you need
import { debounce } from 'https://esm.sh/lodash-es@4';

// vs importing entire library
import _ from 'https://esm.sh/lodash@4';
// Larger bundle
```

## Import Map Configuration

### Complete Example

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.21",
    "vue-router": "https://esm.sh/vue-router@4.2.5",
    "pinia": "https://esm.sh/pinia@2.1.7",
    "lodash-es": "https://esm.sh/lodash-es@4.17.21",
    "@vueuse/core": "https://esm.sh/@vueuse/core@10.7.2"
  }
}
</script>

<script type="module">
  import { createApp } from 'vue';
  import { createPinia } from 'pinia';
  import { useDebounceFn } from '@vueuse/core';
</script>
```

### Version Pinning Strategy

```json
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.21",
    "vue-router": "https://esm.sh/vue-router@4.2.5",
    "pinia": "https://esm.sh/pinia@2.1.7"
  }
}
```

## Performance Configuration

### Preconnect

```html
<head>
  <link rel="preconnect" href="https://esm.sh">
  <link rel="dns-prefetch" href="https://esm.sh">
</head>
```

### Module Preload

```html
<head>
  <!-- Preload main libraries -->
  <link rel="modulepreload" href="https://esm.sh/vue@3.4.21">
  <link rel="modulepreload" href="https://esm.sh/vue-router@4">
  <link rel="modulepreload" href="https://esm.sh/pinia@2">
</head>
```

### Lazy Loading

```javascript
// Lazy load on demand
async function loadHeavyLibrary() {
  const { heavyFeature } = await import('https://esm.sh/heavy-lib@1');
  return heavyFeature;
}
```

## Deno Configuration

### Import Map

```json
// import_map.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3",
    "hono": "https://esm.sh/hono@3",
    "fresh": "https://esm.sh/fresh@1"
  }
}
```

### Direct Imports

```typescript
// deno.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.21"
  }
}

// app.ts
import { createApp } from 'vue';
```

## Environment Variables

### Build-time Variables

```javascript
// Not directly supported by esm.sh
// Use webpack/vite plugins instead

// For Vite:
import { defineConfig } from 'vite';
export default defineConfig({
  define: {
    __VERSION__: JSON.stringify('3.4.21')
  }
});
```

## Error Handling

### Fallback URLs

```javascript
async function safeImport(url, fallback) {
  try {
    return await import(url);
  } catch (error) {
    console.warn(`Failed to load ${url}, trying fallback`);
    if (fallback) {
      return await import(fallback);
    }
    throw error;
  }
}

// Usage
const vue = await safeImport(
  'https://esm.sh/vue@3',
  'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
);
```

### Retry Logic

```javascript
async function retryImport(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await import(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## Configuration Checklist

- [ ] Use exact versions in production
- [ ] Add preconnect for faster loading
- [ ] Use import map for multiple packages
- [ ] Enable tree-shaking with named imports
- [ ] Configure appropriate target for browser support
- [ ] Add fallback URLs for reliability

## สรุป

- esm.sh ใช้ URL parameters สำหรับ configuration
- Version pinning เป็นสิ่งสำคัญสำหรับ production
- Import map ช่วยจัดการหลาย packages
- Preconnect และ preload เพิ่ม performance
