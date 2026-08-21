# Quick Start

สร้าง browser extension แรกของคุณใน 5 นาที

## 1. Create Project

```bash
mkdir my-first-extension
cd my-first-extension
```

## 2. Create manifest.json

```json
{
  "manifest_version": 3,
  "name": "My First Extension",
  "version": "1.0.0",
  "description": "My first browser extension",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": ["storage"]
}
```

## 3. Create Popup

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { padding: 20px; min-width: 200px; }
    button { padding: 10px 20px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello!</h1>
  <button id="btn">Click me</button>
  <p id="count">Clicks: 0</p>
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup.js
let clicks = 0;

document.getElementById('btn').addEventListener('click', () => {
  clicks++;
  document.getElementById('count').textContent = `Clicks: ${clicks}`;

  chrome.storage.local.set({ clicks });
});
```

## 4. Create Background Script

```javascript
// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CLICKS') {
    chrome.storage.local.get(['clicks'], (result) => {
      sendResponse({ clicks: result.clicks || 0 });
    });
    return true;
  }
});
```

## 5. Add Content Script

```json
// Update manifest.json
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

```javascript
// content.js
console.log('Content script loaded');

document.body.style.background = '#f0f0f0';

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'highlight') {
    document.body.style.background = 'yellow';
  }
});
```

## 6. Load Extension

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select your extension folder

## 7. Test Extension

1. Click the extension icon in toolbar
2. Click the button in popup
3. Open DevTools on any page to see content script

## Project Structure

```
my-first-extension/
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

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ extension architecture
- [Features](features.md) - เรียนรู้ features ต่างๆ
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี
