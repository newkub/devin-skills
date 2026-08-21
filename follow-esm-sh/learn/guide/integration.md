# esm.sh - Integration

การเชื่อมต่อ esm.sh กับ frameworks และ tools ต่างๆ

## Vite Integration

### Configure Vite

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      // Point to esm.sh for development
      'vue': 'https://esm.sh/vue@3',
      'vue-router': 'https://esm.sh/vue-router@4'
    }
  }
};
```

### Alternative: Plugin

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'esm-sh-resolver',
      resolveId(id) {
        if (id.startsWith('esm:')) {
          const packageName = id.slice(4);
          return `https://esm.sh/${packageName}`;
        }
      }
    }
  ]
});
```

## React Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://esm.sh/react@18/umd/react.development.js"></script>
  <script src="https://esm.sh/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="root"></div>

  <script>
    const { createRoot } = ReactDOM;
    const { useState } = React;

    function Counter() {
      const [count, setCount] = useState(0);
      return React.createElement('div', null,
        React.createElement('h1', null, `Count: ${count}`),
        React.createElement('button', { onClick: () => setCount(c => c + 1) }, '+1')
      );
    }

    createRoot(document.getElementById('root'))
      .render(React.createElement(Counter));
  </script>
</body>
</html>
```

### With Babel

```html
<head>
  <script src="https://esm.sh/react@18/umd/react.development.js"></script>
  <script src="https://esm.sh/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://esm.sh/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    function App() {
      const [count, setCount] = useState(0);
      return <div>
        <h1>Count: {count}</h1>
        <button onClick={() => setCount(c => c + 1)}>+1</button>
      </div>;
    }

    createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

## Vue Integration

### Options API

```html
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3';

  const app = createApp({
    data() {
      return {
        count: 0,
        message: 'Hello Vue!'
      };
    },
    methods: {
      increment() {
        this.count++;
      }
    },
    template: `
      <div>
        <h1>{{ message }}</h1>
        <p>Count: {{ count }}</p>
        <button @click="increment">+1</button>
      </div>
    `
  });

  app.mount('#app');
</script>
```

### Composition API

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

## Preact Integration

### With HTM (No Build)

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact@10';
  import { useState } from 'https://esm.sh/preact/hooks';
  import htm from 'https://esm.sh/htm';

  const html = htm.bind(h);

  function App() {
    const [count, setCount] = useState(0);

    return html`
      <div>
        <h1>Count: ${count}</h1>
        <button onClick=${() => setCount(c => c + 1)}>+1</button>
      </div>
    `;
  }

  render(html`<${App} />`, document.getElementById('app'));
</script>
```

## SolidJS Integration

```html
<script type="module">
  import { createSignal } from 'https://esm.sh/solid-js';
  import { render } from 'https://esm.sh/solid-js/web';

  function Counter() {
    const [count, setCount] = createSignal(0);

    return (
      <div>
        <p>Count: {count()}</p>
        <button onClick={() => setCount(c => c + 1)}>+1</button>
      </div>
    );
  }

  render(() => <Counter />, document.getElementById('app'));
</script>
```

## Deno Integration

### Import Map

```json
// import_map.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3",
    "hono": "https://esm.sh/hono@3",
    "oak": "https://esm.sh/oak@12"
  }
}
```

### Basic App

```typescript
// app.ts
import { createApp } from 'vue';

const app = createApp({
  data() {
    return { message: 'Hello from Deno!' };
  }
});

// Note: Vue needs DOM, so this is for server-side usage
console.log('Deno with esm.sh');
```

## Next.js Integration

### Not Recommended

```text
esm.sh is not recommended for Next.js because:
- Next.js has its own bundling
- SSG/SSR doesn't work well with CDN imports
- Better to use bun and proper bundling

Use esm.sh for:
- Quick prototyping
- Simple components
- Learning purposes
```

## Frameworks Comparison

| Framework | esm.sh Integration | Notes |
|-----------|-------------------|-------|
| React | ✅ UMD + Babel | Good for quick demos |
| Vue | ✅ ESM | Good for simple apps |
| Preact | ✅ ESM + HTM | Perfect fit |
| SolidJS | ✅ ESM | Works well |
| Svelte | ⚠️ Via compile | Requires build |
| Angular | ❌ | Needs build step |

## Build Tools

### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'vue': 'https://esm.sh/vue@3'
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
};
```

### Rollup

```javascript
// rollup.config.js
export default {
  external: ['vue'],
  plugins: [
    resolve({
      preferNative: true
    })
  ]
};
```

## Testing

### Vitest

```javascript
// vitest.config.js
export default {
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      'vue': 'https://esm.sh/vue@3'
    }
  }
};
```

### Playwright

```typescript
// test.spec.ts
import { test, expect } from '@playwright/test';

test('basic app', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('h1')).toContainText('Hello');
});
```

## Libraries

### UI Libraries

```javascript
// Chart.js
import { Chart } from 'https://esm.sh/chart.js@4';

// Three.js
import * as THREE from 'https://esm.sh/three@0.160';

// D3.js
import * as d3 from 'https://esm.sh/d3@7';
```

### Utility Libraries

```javascript
// Lodash
import { debounce } from 'https://esm.sh/lodash-es@4';
import { pick } from 'https://esm.sh/lodash-es@4/pick';

// Date-fns
import { format } from 'https://esm.sh/date-fns@3';
import { addDays } from 'https://esm.sh/date-fns@3/addDays';
```

## Best Practices

### Summary

```text
┌─────────────────────────────────────────────────┐
│          Integration Best Practices             │
├─────────────────────────────────────────────────┤
│                                                  │
│   1. Use version pinning in production           │
│   2. Add preconnect for performance             │
│   3. Use import maps for multiple packages      │
│   4. Lazy load non-critical modules            │
│   5. Handle errors gracefully                   │
│   6. Consider build tools for complex apps     │
│                                                  │
└─────────────────────────────────────────────────┘
```

## สรุป

- esm.sh ทำงานได้กับ frameworks หลายตัว
- Vue, Preact, React รองรับ ESM โดยตรง
- สำหรับ complex apps ใช้ bundlers จะดีกว่า
- Import maps ช่วยจัดการ dependencies หลายตัว
