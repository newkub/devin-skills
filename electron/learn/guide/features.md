# Features

Features และ capabilities ของ Electron

## Window Management

```javascript
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  frame: true,
  titleBarStyle: 'hidden',
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true
  }
});
```

## IPC Communication

| Pattern | Description |
|---------|-------------|
| ipcMain.handle | Handle requests from renderer |
| ipcRenderer.invoke | Async invoke in renderer |
| ipcRenderer.send | One-way messaging |

## Native Menus

```javascript
const { Menu } = require('electron');

const template = [
  { label: 'File', submenu: [
    { label: 'Open', accelerator: 'CmdOrCtrl+O' },
    { type: 'separator' },
    { label: 'Exit', role: 'quit' }
  ]},
  { label: 'Edit', submenu: [
    { label: 'Undo', role: 'undo' },
    { label: 'Redo', role: 'redo' }
  ]}
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

## System Dialogs

```javascript
const { dialog } = require('electron');

// Open file dialog
const result = await dialog.showOpenDialog(win, {
  properties: ['openFile'],
  filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
});
```

## Tray Icon

```javascript
const { Tray, nativeImage } = require('electron');

const tray = new Tray(nativeImage.createFromPath('icon.png'));
tray.setToolTip('My App');
tray.on('click', () => win.show());
```

## Auto-Updater

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  console.log('Update available');
});
```
