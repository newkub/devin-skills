# Installation

## Requirements

- Chrome 88+ (Manifest V3)
- Node.js 18+ (for build tools)
- bun or yarn

## Manual Installation (Load unpacked)

### 1. Create Project Structure

```
my-extension/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── content.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### 2. Create manifest.json

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "My browser extension",
  "permissions": ["storage", "activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

### 3. Load Extension in Chrome

1. Open `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select your extension folder

## Using Build Tools

### Vite + Chrome Extension CLI

```bash
bun create vite@latest my-extension -- --template vanilla
cd my-extension
bun install chrome-extension-creator -D
npx chrome-extension-creator init
```

### Webpack

```bash
bun install webpack webpack-cli chrome-extension-webpack-plugin -D
```

```javascript
// webpack.config.js
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
  mode: 'development',
  plugins: [new ChromeExtensionReloader()]
};
```

### Parcel

```bash
bun install parcel -D
```

## Create Icons

```bash
# Use sharp to generate icons
bun install sharp

node -e "
const sharp = require('sharp');
const sizes = [16, 48, 128];
sizes.forEach(size => {
  sharp('input.png')
    .resize(size, size)
    .toFile('icons/icon' + size + '.png');
});
"
```

## Load Testing

```bash
# Reload extension after changes
# In chrome://extensions, click the reload button on your extension
```

## Debugging

### View Service Worker Logs

1. Go to `chrome://extensions`
2. Find your extension
3. Click "Service Worker" link under "Inspect views"

### Content Script Debugging

1. Open DevTools on the target page
2. Content scripts appear in the Sources panel
3. Set breakpoints in your content.js
