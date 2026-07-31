# Best Practices

## Security

### Always Use Context Isolation

```javascript
// ❌ Wrong - vulnerable to prototype pollution
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true  // DANGEROUS!
  }
});

// ✅ Correct - isolated context
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### Validate IPC Messages

```javascript
// main.js
ipcMain.handle('user:delete', async (event, userId) => {
  // Validate input
  if (typeof userId !== 'string' || !userId.match(/^[0-9a-f-]+$/)) {
    throw new Error('Invalid user ID');
  }
  
  // Authorize
  if (!hasPermission(event.sender, 'delete:users')) {
    throw new Error('Unauthorized');
  }
  
  return await deleteUser(userId);
});
```

## Performance

### Lazy Loading

```javascript
// ✅ Lazy load heavy modules
app.whenReady().then(async () => {
  const { heavyModule } = await import('./heavy-module.js');
  heavyModule.initialize();
});
```

### Window Pooling

```javascript
// Reuse windows instead of creating new ones
class WindowManager {
  #pool = [];
  
  async getWindow() {
    if (this.#pool.length > 0) {
      return this.#pool.pop();
    }
    return this.createWindow();
  }
  
  releaseWindow(win) {
    win.hide();
    this.#pool.push(win);
  }
}
```

## Error Handling

### Global Exception Handler

```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', error.message);
  app.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
```

### IPC Error Handling

```javascript
// Renderer
async function safeCall(channel, ...args) {
  try {
    return await window.api[channel](...args);
  } catch (error) {
    console.error(`API error [${channel}]:`, error.message);
    notifyUser(error.message);
    return null;
  }
}
```

## Memory Management

### Cleanup on Window Close

```javascript
// Track resources per window
const windowResources = new Map();

function createWindow() {
  const win = new BrowserWindow({...});
  
  const resources = {
    fileWatchers: [],
    eventHandlers: []
  };
  
  windowResources.set(win, resources);
  
  win.on('closed', () => {
    // Cleanup
    resources.fileWatchers.forEach(w => w.close());
    resources.eventHandlers.forEach(h => h.remove());
    windowResources.delete(win);
  });
}
```

## Auto-Updater

### Production Ready

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.autoDownload = false;

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `Version ${info.version} is available`,
    buttons: ['Download', 'Later']
  }).then(({ response }) => {
    if (response === 0) autoUpdater.downloadUpdate();
  });
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
```