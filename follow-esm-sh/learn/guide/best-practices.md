# esm.sh - Best Practices

แนวทางที่ดีที่สุดสำหรับการใช้ esm.sh

## Version Pinning

### Do: Use Exact Versions

```javascript
// ✅ Recommended
import { createApp } from 'https://esm.sh/vue@3.4.21';

// ⚠️ Acceptable for development
import { createApp } from 'https://esm.sh/vue@3';

// ❌ Avoid in production
import { createApp } from 'https://esm.sh/vue';
```

### Why?

```text
┌─────────────────────────────────────────────────┐
│           Version Pinning Benefits              │
├─────────────────────────────────────────────────┤
│                                                  │
│   Exact Version (@3.4.21):                      │
│   ├── Cache forever (immutable)                 │
│   ├── Reproducible builds                      │
│   ├── No unexpected changes                    │
│   └── 1-year browser cache                     │
│                                                  │
│   Major Version (@3):                          │
│   ├── Receives patches                         │
│   ├── 7-day cache                              │
│   └── Possible minor changes                   │
│                                                  │
│   No Version (latest):                         │
│   ├── 12-hour cache                           │
│   ├── Breaking changes possible                │
│   └── Not reproducible                         │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Performance

### Preconnect

```html
<head>
  <!-- Preconnect to esm.sh -->
  <link rel="preconnect" href="https://esm.sh" crossorigin>
  <link rel="dns-prefetch" href="https://esm.sh">
</head>
```

### Module Preload

```html
<head>
  <!-- Preload critical modules -->
  <link rel="modulepreload" href="https://esm.sh/vue@3.4.21">
  <link rel="modulepreload" href="https://esm.sh/vue-router@4.2.5">
</head>
```

### Lazy Loading

```javascript
// ✅ Good - load on demand
const heavyFeature = await import('https://esm.sh/heavy-lib@1');

// ❌ Bad - load everything upfront
import * as heavyLib from 'https://esm.sh/heavy-lib@1';
```

## Tree Shaking

### Named Imports

```javascript
// ✅ Good - only import what you need
import { ref, computed, watch } from 'https://esm.sh/vue@3';

// ❌ Bad - imports entire library
import Vue from 'https://esm.sh/vue@3';
const { createApp, ref } = Vue;
```

### Subpath Imports

```javascript
// ✅ Good - specific subpath
import { debounce } from 'https://esm.sh/lodash-es@4/debounce';

// ❌ Bad - entire library
import { debounce } from 'https://esm.sh/lodash-es@4';
```

## Error Handling

### Graceful Degradation

```javascript
async function loadWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await import(primaryUrl);
  } catch (error) {
    console.warn('Primary URL failed, trying fallback');
    try {
      return await import(fallbackUrl);
    } catch (fallbackError) {
      console.error('All imports failed');
      return null;
    }
  }
}
```

### Retry Logic

```javascript
async function retryImport(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await import(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}
```

## Import Maps

### Structure

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.21",
    "vue-router": "https://esm.sh/vue-router@4.2.5",
    "lodash-es": "https://esm.sh/lodash-es@4.17.21"
  }
}
</script>
```

### Benefits

```text
┌─────────────────────────────────────────────────┐
│             Import Map Benefits                  │
├─────────────────────────────────────────────────┤
│                                                  │
│   1. Centralized version management             │
│   2. Readable imports in code                   │
│   3. Single update point                        │
│   4. Better IDE support                         │
│   5. Reduced URL duplication                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Security

### Subresource Integrity (SRI)

```javascript
// Note: esm.sh doesn't support SRI directly
// But you can verify integrity in your code
async function verifyIntegrity(url, expectedHash) {
  const response = await fetch(url);
  const content = await response.text();
  const hash = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(content));
  // Compare with expectedHash
}
```

### CSP Headers

```html
<!-- Content-Security-Policy for esm.sh -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; connect-src 'self' https://esm.sh;">
```

## Development vs Production

### Development

```html
<!-- Use dev build for better debugging -->
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3?dev';
</script>
```

### Production

```html
<!-- Use minified production build -->
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3.4.21';
</script>
```

## Bundling Strategy

### When to Use esm.sh

```javascript
// ✅ Good for:
// - Quick prototypes
// - Simple static sites
// - Learning and testing libraries
// - No build step needed

// ❌ Consider bundlers for:
// - Production apps
// - Large applications
// - Complex dependencies
// - Full tree-shaking control
```

## Common Patterns

### React Pattern

```html
<script type="module">
  import { createElement, useState } from 'https://esm.sh/react@18';
  
  function App() {
    const [count, setCount] = useState(0);
    return createElement('div', null,
      createElement('h1', null, `Count: ${count}`),
      createElement('button', { onClick: () => setCount(c => c + 1) }, '+1')
    );
  }
</script>
```

### Vue Pattern

```html
<script type="module">
  import { createApp, ref, computed } from 'https://esm.sh/vue@3';
  
  createApp({
    setup() {
      const count = ref(0);
      const doubled = computed(() => count.value * 2);
      return { count, doubled };
    },
    template: `
      <div>
        <p>Count: {{ count }}</p>
        <p>Doubled: {{ doubled }}</p>
        <button @click="count++">+1</button>
      </div>
    `
  }).mount('#app');
</script>
```

## Checklist

### Before Production

- [ ] Use exact versions for all imports
- [ ] Add preconnect to HTML head
- [ ] Consider module preload for critical modules
- [ ] Test with actual network conditions
- [ ] Verify error handling works
- [ ] Check bundle sizes
- [ ] Test fallback URLs

### Performance

- [ ] Lazy load non-critical modules
- [ ] Use named imports for tree-shaking
- [ ] Preconnect to esm.sh
- [ ] Monitor load times
- [ ] Use import map for multiple packages

## Anti-patterns

### ❌ Don't Do These

```javascript
// 1. No version pinning in production
import { createApp } from 'https://esm.sh/vue';

// 2. Namespace imports (no tree-shaking)
import * as Vue from 'https://esm.sh/vue@3';

// 3. Loading entire library when you need small part
import _ from 'https://esm.sh/lodash@4';

// 4. Not handling errors
const { feature } = await import('https://esm.sh/some-lib@1');

// 5. No preconnect
// (Missing <link rel="preconnect">)
```

## สรุป

- ใช้ exact versions สำหรับ production
- Preconnect และ preload เพิ่ม performance
- ใช้ named imports สำหรับ tree-shaking
- จัดการ error อย่างเหมาะสม
- ใช้ import map สำหรับหลาย packages