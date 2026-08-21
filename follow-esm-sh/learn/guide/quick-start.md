# esm.sh - Quick Start

เริ่มต้นใช้งาน esm.sh อย่างรวดเร็ว

## Basic Usage

### Single HTML File

```html
<!DOCTYPE html>
<html>
<head>
  <title>esm.sh Demo</title>
  <link rel="preconnect" href="https://esm.sh" crossorigin>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { createApp, ref } from 'https://esm.sh/vue@3';
    
    createApp({
      setup() {
        const count = ref(0);
        return { count };
      },
      template: `
        <div>
          <p>Count: {{ count }}</p>
          <button @click="count++">+1</button>
        </div>
      `
    }).mount('#app');
  </script>
</body>
</html>
```

### Using Import Map

```html
<!DOCTYPE html>
<html>
<head>
  <title>Import Map Demo</title>
  <link rel="preconnect" href="https://esm.sh" crossorigin>
</head>
<body>
  <div id="app"></div>

  <script type="importmap">
    {
      "imports": {
        "vue": "https://esm.sh/vue@3",
        "lodash-es": "https://esm.sh/lodash-es@4"
      }
    }
  </script>

  <script type="module">
    import { createApp, ref } from 'vue';
    import { debounce } from 'lodash-es';
    
    // Use lodash
    const debouncedFn = debounce(() => {
      console.log('Debounced!');
    }, 500);
  </script>
</body>
</html>
```

## Common Patterns

### React Application

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://esm.sh/react@18/umd/react.development.js"></script>
  <script src="https://esm.sh/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://esm.sh/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    function App() {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <h1>Count: {count}</h1>
          <button onClick={() => setCount(c => c + 1)}>
            Increment
          </button>
        </div>
      );
    }
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

### Preact with HTM

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>

  <script type="module">
    import { h, render } from 'https://esm.sh/preact';
    import { useState } from 'https://esm.sh/preact/hooks';
    import htm from 'https://esm.sh/htm';
    
    const html = htm.bind(h);
    
    function Counter() {
      const [count, setCount] = useState(0);
      
      return html`
        <div>
          <p>Count: ${count}</p>
          <button onClick=${() => setCount(c => c + 1)}>
            +1
          </button>
        </div>
      `;
    }
    
    render(html`<${Counter} />`, document.getElementById('app'));
  </script>
</body>
</html>
```

### Vue 3 Composition API

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app">
    <h1>{{ title }}</h1>
    <input v-model="newItem" @keyup.enter="add">
    <button @click="add">Add</button>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </ul>
  </div>

  <script type="module">
    import { createApp, ref, computed } from 'https://esm.sh/vue@3';
    
    createApp({
      setup() {
        const newItem = ref('');
        const items = ref([
          { id: 1, text: 'Learn esm.sh' }
        ]);
        let nextId = 2;
        
        const add = () => {
          if (!newItem.value.trim()) return;
          items.value.push({
            id: nextId++,
            text: newItem.value
          });
          newItem.value = '';
        };
        
        return { newItem, items, add };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

## Version Selection

### Exact Version (Recommended)

```javascript
import { createApp } from 'https://esm.sh/vue@3.4.21';
// ✅ Best for production
```

### Major Version

```javascript
import { createApp } from 'https://esm.sh/vue@3';
// ⚠️ Gets latest 3.x
```

### Latest (Not Recommended)

```javascript
import { createApp } from 'https://esm.sh/vue';
// ❌ No version control - not for production
```

## Performance Tips

### Preconnect

```html
<head>
  <link rel="preconnect" href="https://esm.sh" crossorigin>
</head>
```

### Module Preload

```html
<head>
  <!-- Preload main libraries -->
  <link rel="modulepreload" href="https://esm.sh/vue@3">
  <link rel="modulepreload" href="https://esm.sh/vue@3/router">
</head>
```

### Lazy Loading

```javascript
// Load heavy libraries on demand
const loadLibrary = async () => {
  const { heavyFeature } = await import('https://esm.sh/heavy-lib@1');
  return heavyFeature;
};
```

## Framework Integration

### Vue 3 + Vite Config

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      'vue': 'https://esm.sh/vue@3'
    }
  }
};
```

### React with Vite

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      'react': 'https://esm.sh/react@18',
      'react-dom': 'https://esm.sh/react-dom@18'
    }
  }
};
```

### Deno

```typescript
// import_map.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3"
  }
}

// app.ts
import { createApp } from 'vue';

createApp({
  data() { return { msg: 'Hello!' }; }
}).mount('#app');
```

## Testing

### Vitest

```javascript
// test/setup.js
import { expect, test } from 'https://esm.sh/vitest@1';

// Works with any test runner that supports ESM
```

### Simple Test

```html
<script type="module">
  import { ref } from 'https://esm.sh/vue@3';
  
  // Simple test
  const count = ref(0);
  count.value++;
  
  console.assert(count.value === 1, 'Should increment');
  console.log('Tests passed!');
</script>
```

## Next Steps

- [Configuration](./configuration.md) - การตั้งค่าเพิ่มเติม
- [Best Practices](./best-practices.md) - แนวทางที่ดีที่สุด
- [Integration](./integration.md) - การเชื่อมต่อกับ frameworks