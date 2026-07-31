# Quick Start

สร้าง Electron app แรกของคุณใน 5 นาที

## 1. Create Project

```bash
mkdir my-electron-app
cd my-electron-app
bun init -y
bun install electron --save-dev
```

## 2. Create Main Process (main.js)

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

## 3. Create HTML (index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Electron App</title>
</head>
<body>
  <h1>Hello Electron!</h1>
  <script src="renderer.js"></script>
</body>
</html>
```

## 4. Add bun Scripts

```json
"scripts": {
  "start": "electron ."
}
```

## 5. Run

```bash
bun start
```

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ Electron architecture
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี
- [Configuration](configuration.md) - ตั้งค่า application
