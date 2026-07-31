# Configuration

## Basic main.js

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

## Preload Script

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getVersion: () => process.versions.electron
});
```

## Environment Variables

```bash
# .env file
NODE_ENV=production
API_URL=https://api.example.com
```

## BrowserWindow Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| width | number | 800 | Window width |
| height | number | 600 | Window height |
| minWidth | number | 0 | Minimum width |
| minHeight | number | 0 | Minimum height |
| show | boolean | true | Show on create |
| frame | boolean | true | Show frame |
| title | string | - | Window title |
