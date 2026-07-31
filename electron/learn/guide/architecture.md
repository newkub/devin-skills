# Architecture

## Project Structure

```
my-electron-app/
├── package.json
├── main.js              # Main process entry
├── preload.js           # Preload script
├── src/
│   ├── main/            # Main process code
│   │   ├── index.ts
│   │   ├── windows.ts
│   │   ├── ipc.ts
│   │   ├── menus.ts
│   │   └── tray.ts
│   ├── preload/         # Preload scripts
│   │   └── index.ts
│   └── renderer/         # Renderer process
│       ├── index.html
│       ├── App.tsx
│       ├── components/
│       └── styles/
├── build/               # Build assets
│   └── icon.png
└── dist/                # Output
```

## Main Process Architecture

```typescript
// main/index.ts
import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from './ipc';
import { createApplicationMenu } from './menus';
import { setupTray } from './tray';

class Application {
  private mainWindow: BrowserWindow | null = null;
  
  async initialize() {
    // Register IPC handlers
    registerIpcHandlers();
    
    // Setup UI
    createApplicationMenu();
    setupTray();
    
    // Create window
    await this.createWindow();
  }
  
  private async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    
    await this.mainWindow.loadFile(
      path.join(__dirname, '../renderer/index.html')
    );
  }
}

export const application = new Application();
app.whenReady().then(() => application.initialize());
```

## IPC Layer

```typescript
// main/ipc/index.ts
import { ipcMain, dialog, shell } from 'electron';

export function registerIpcHandlers() {
  // File operations
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
    });
    return result;
  });
  
  // Shell operations
  ipcMain.handle('shell:openExternal', async (_, url) => {
    await shell.openExternal(url);
  });
  
  // App info
  ipcMain.handle('app:getVersion', () => {
    return process.versions.electron;
  });
}
```

## Preload Architecture

```typescript
// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  openFile: () => Promise<Electron.OpenDialogReturnValue>;
  openExternal: (url: string) => Promise<void>;
  getVersion: () => Promise<string>;
  onMenuAction: (callback: (action: string) => void) => void;
}

const api: ElectronAPI = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu:action', (_, action) => callback(action));
  }
};

contextBridge.exposeInMainWorld('electronAPI', api);
```

## State Management

### Renderer State

```typescript
// renderer/store.ts
interface AppState {
  user: User | null;
  settings: Settings;
  isLoading: boolean;
}

class Store {
  private state: AppState = {
    user: null,
    settings: defaultSettings,
    isLoading: false
  };
  
  private listeners: Set<(state: AppState) => void> = new Set();
  
  getState() { return this.state; }
  
  update(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }
  
  subscribe(listener: (state: AppState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify() {
    this.listeners.forEach(l => l(this.state));
  }
}

export const store = new Store();
```