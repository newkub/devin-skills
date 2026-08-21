# esm.sh - Installation

การติดตั้งและเริ่มต้นใช้งาน esm.sh

## Prerequisites

| Requirement | Description |
|-------------|-------------|
| Modern Browser | ESM support (Chrome 61+, Firefox 60+, Safari 11+) |
| CDN Access | No special setup needed |

## No Installation Required

esm.sh เป็น CDN service ที่ใช้งานได้ทันทีผ่าน URL:

```html
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3';
</script>
```

## Quick Start Examples

### Basic Vue App

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue with esm.sh</title>
</head>
<body>
  <div id="app">{{ message }}</div>

  <script type="module">
    import { createApp, ref } from 'https://esm.sh/vue@3';

    createApp({
      setup() {
        return { message: ref('Hello from esm.sh!') };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

### React App

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
    const { useState } = React;
    const { createRoot } = ReactDOM;

    function App() {
      const [count, setCount] = useState(0);
      return React.createElement('div', null,
        React.createElement('h1', null, `Count: ${count}`),
        React.createElement('button', { onClick: () => setCount(c => c + 1) }, '+1')
      );
    }

    createRoot(document.getElementById('root')).render(React.createElement(App));
  </script>
</body>
</html>
```

### Preact App

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>

  <script type="module">
    import { h, render } from 'https://esm.sh/preact@10';
    import { useState } from 'https://esm.sh/preact/hooks';
    import htm from 'https://esm.sh/htm';

    const html = htm.bind(h);

    function Counter() {
      const [count, setCount] = useState(0);
      return html`
        <div>
          <p>Count: ${count}</p>
          <button onClick=${() => setCount(c => c + 1)}>+1</button>
        </div>
      `;
    }

    render(html`<${Counter} />`, document.getElementById('app'));
  </script>
</body>
</html>
```

## Using Import Maps

### Example: Vue + Lodash

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://esm.sh" crossorigin>

  <script type="importmap">
    {
      "imports": {
        "vue": "https://esm.sh/vue@3",
        "vue-router": "https://esm.sh/vue-router@4",
        "lodash-es": "https://esm.sh/lodash-es@4"
      }
    }
  </script>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { createApp, ref } from 'vue';
    import { debounce } from 'lodash-es';

    const app = createApp({
      setup() {
        const input = ref('');

        const onInput = debounce((e) => {
          console.log('Search:', e.target.value);
        }, 300);

        return { input, onInput };
      },
      template: `
        <input v-model="input" @input="onInput">
      `
    });

    app.mount('#app');
  </script>
</body>
</html>
```

## Deno Usage

### Basic Import

```typescript
// mod.ts
import { createApp } from 'https://esm.sh/vue@3';

// or with version pinning
import { createApp } from 'https://esm.sh/vue@3.4.21';
```

### Import Map

```json
// import_map.json
{
  "imports": {
    "vue": "https://esm.sh/vue@3",
    "react": "https://esm.sh/react@18"
  }
}
```

```bash
# Run with import map
deno run --import-map import_map.json app.ts
```

## Version Selection

### Recommended Patterns

```javascript
// ✅ Exact version (best for production)
import { createApp } from 'https://esm.sh/vue@3.4.21';

// ✅ Major version (receives patches)
import { createApp } from 'https://esm.sh/vue@3';

// ⚠️ Minor version
import { createApp } from 'https://esm.sh/vue@3.4';

// ❌ No version (not recommended for production)
import { createApp } from 'https://esm.sh/vue';
```

## Browser Support

| Browser | Minimum Version | ESM Support |
|---------|----------------|-------------|
| Chrome | 61+ | ✅ |
| Firefox | 60+ | ✅ |
| Safari | 11+ | ✅ |
| Edge | 16+ | ✅ |
| Node.js | 14+ | ✅ |

## Common Issues

### CORS Errors

```javascript
// If you get CORS errors, add crossorigin attribute
<script type="module" crossorigin>
  import { createApp } from 'https://esm.sh/vue@3';
</script>
```

### Module Resolution

```javascript
// If module not found, check:
1. Package exists on bun
2. Version is valid
3. Package has ESM export

// Debug with:
const url = 'https://esm.sh/vue@3';
console.log(url);
```

## Next Steps

- [Configuration](./configuration.md) - การตั้งค่าเพิ่มเติม
- [Best Practices](./best-practices.md) - แนวทางที่ดีที่สุด
- [Integration](./integration.md) - การเชื่อมต่อกับ frameworks
