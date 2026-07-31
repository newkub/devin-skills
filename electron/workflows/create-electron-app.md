# Create Electron App

Workflow for creating an Electron application.

## Steps

1. **Initialize project**
   ```bash
   bun init
   bun install --save-dev electron
   ```

2. **Create main process**
   ```javascript
   // main.js
   const { app, BrowserWindow } = require('electron')
   const path = require('path')

   function createWindow () {
     const win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js')
       }
     })

     win.loadFile('index.html')
   }

   app.whenReady().then(createWindow)
   ```

3. **Create renderer process**
   ```html
   <!-- index.html -->
   <!DOCTYPE html>
   <html>
   <head><title>My App</title></head>
   <body>
     <h1>Hello Electron!</h1>
   </body>
   </html>
   ```

4. **Configure package.json**
   ```json
   {
     "main": "main.js",
     "scripts": {
       "start": "electron ."
     }
   }
   ```

5. **Run development**
   ```bash
   bun start
   ```

6. **Build for production**
   ```bash
   bun install --save-dev electron-builder
   bun run build
   ```

## Best Practices

- Use context isolation
- Enable node integration carefully
- Implement IPC for communication
- Use preload scripts
- Follow security guidelines
