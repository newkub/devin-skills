# Configuration Reference

Configuration options สำหรับ Electron main process

## main.js Configuration

```javascript
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
});
```

## Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| width | number | 800 | Window width in pixels |
| height | number | 600 | Window height in pixels |
| nodeIntegration | boolean | false | Enable Node.js in renderer |
| contextIsolation | boolean | true | Isolate preload scripts |