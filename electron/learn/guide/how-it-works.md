# How It Works

## Electron Architecture

```
┌─────────────────────────────────────────────┐
│              Main Process                   │
│  ┌─────────────────────────────────────┐    │
│  │  Node.js + Native Modules           │    │
│  │  - App lifecycle                    │    │
│  │  - Window management                │    │
│  │  - Native menus                     │    │
│  │  - File system access               │    │
│  └─────────────────────────────────────┘    │
│                    │                         │
│                    │ IPC                     │
│                    ▼                         │
│  ┌─────────────────────────────────────┐    │
│  │  Preload Script                     │    │
│  │  - contextBridge API                │    │
│  │  - Secure bridge                   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                      │
                      │ (isolated)
                      ▼
┌─────────────────────────────────────────────┐
│            Renderer Process                 │
│  ┌─────────────────────────────────────┐    │
│  │  Chromium + Web APIs                │    │
│  │  - HTML/CSS UI                      │    │
│  │  - DOM manipulation                 │    │
│  │  - JavaScript logic                 │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Process Communication

### IPC Flow

```
Renderer                    Preload                  Main
   │                          │                       │
   │  window.api.method()     │                       │
   │ ───────────────────────►│                       │
   │                          │  ipcRenderer.invoke   │
   │                          │─────────────────────►│
   │                          │                       │
   │                          │      Result          │
   │                          │◄─────────────────────│
   │                          │                       │
   │      Promise resolve     │                       │
   │◄─────────────────────── │                       │
```

### Security Model

```
┌────────────────────────────────────────────┐
│           Security Boundaries              │
├────────────────────────────────────────────┤
│                                            │
│  Renderer (Isolated)                       │
│  ├── No direct Node.js access              │
│  ├── No require() function                │
│  └── Limited to exposed APIs via preload   │
│                                            │
│  Preload (Bridge)                          │
│  ├── contextBridge.exposeInMainWorld()     │
│  ├── Only exposes specific APIs            │
│  └── Validates all inputs                  │
│                                            │
│  Main (Full Access)                        │
│  ├── Full Node.js + native modules         │
│  ├── Handles all IPC handlers              │
│  └── Validates all renderer requests       │
│                                            │
└────────────────────────────────────────────┘
```

## Application Lifecycle

```javascript
// Lifecycle events
app.on('ready', () => {          // App ready
  createWindow();
});

app.on('window-all-closed', () => {  // All windows closed
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {       // macOS dock click
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {    // App quitting
  cleanup();
});
```

## Rendering Pipeline

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  HTML   │───►│  DOM    │───►│ Layout  │───►│ Paint  │
│  Parse  │    │ Building│    │         │    │        │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                    │
                    ▼
             ┌─────────────┐
             │ JavaScript  │
             │ Execution   │
             └─────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Signals │ │ Effects │ │ Memos   │
   │ Update  │ │ Run     │ │ Compute │
   └─────────┘ └─────────┘ └─────────┘
```