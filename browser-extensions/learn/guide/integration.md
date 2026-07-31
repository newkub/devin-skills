# Integration

## External APIs

### Fetch API in Service Worker

```javascript
// background.js
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API fetch failed:', error);
    throw error;
  }
}
```

### Send Data to Server

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendData') {
    fetch('https://api.example.com/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.data)
    })
    .then(res => res.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
```

## Chrome Identity API

```json
{
  "permissions": ["identity"]
}
```

```javascript
chrome.identity.getAuthToken({ interactive: false }, (token) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }

  fetch('https://api.example.com/user', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => console.log(data));
});
```

## Native Messaging

### Manifest Configuration

```json
{
  "permissions": ["nativeMessaging"],
  "nativeMessaging": {
    "allowUncontrolledAccess": false
  }
}
```

### Connect to Native App

```javascript
const port = chrome.runtime.connectNative('com.myapp.native');

port.onMessage.addListener((response) => {
  console.log('Received:', response);
});

port.onDisconnect.addListener(() => {
  console.log('Native app disconnected');
});

port.postMessage({ action: 'getData' });
```

## External Extension Communication

```javascript
// Send to another extension
chrome.runtime.sendMessage('EXTENSION_ID', {
  type: 'REQUEST',
  data: { key: 'value' }
}, (response) => {
  console.log('Response:', response);
});
```

## Web Frameworks Integration

### React Popup

```javascript
// popup.js - React entry
import React from 'react';
import { createRoot } from 'react-dom/client';

function Popup() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Popup />);
```

### Vue Popup

```javascript
// popup.js - Vue entry
import { createApp } from 'vue';

const App = {
  data() { return { count: 0 }; },
  template: `
    <div>
      <h1>Counter: {{ count }}</h1>
      <button @click="count++">Increment</button>
    </div>
  `
};

createApp(App).mount('#app');
```

## Build Tools

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        background: 'src/background.js',
        popup: 'src/popup.html',
        content: 'src/content.js'
      }
    }
  }
});
```

### Webpack Configuration

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    content: './src/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};
```

## TypeScript

```typescript
// types/extension.d.ts
interface Message {
  action: string;
  data?: unknown;
}

interface Response {
  success: boolean;
  data?: unknown;
  error?: string;
}

declare function sendMessage(
  message: Message,
  responseCallback?: (response: Response) => void
): void;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```