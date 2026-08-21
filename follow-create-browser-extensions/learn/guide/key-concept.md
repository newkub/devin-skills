# Key Concept

## What is Browser Extension?

Browser extensions คือโปรแกรมเสริมที่ติดตั้งในเว็บเบราว์เซอร์เพื่อเพิ่มความสามารถในการทำงาน ทำงานใน sandbox environment แยกจาก web pages

## Core Concepts

### Manifest V3

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "Extension description",
  "permissions": ["storage", "activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  }
}
```

### Extension Architecture

```
┌─────────────────────────────────────────────────────┐
│              Browser Extension                       │
├─────────────────────────────────────────────────────┤
│  Service Worker (Background Script)                  │
│  - Handles events                                    │
│  - Manages state                                     │
│  - Runs in background                                │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Popup     │ │ Content     │ │  Options    │   │
│  │   (UI)      │ │   Scripts   │ │   Page      │   │
│  │             │ │             │ │             │   │
│  │  popup.html │ │ injected.js │ │ options.html│   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Permissions

```json
{
  "permissions": [
    "storage",        // Chrome storage API
    "activeTab",      // Access current tab
    "scripting",      // Inject scripts
    "tabs",           // Manage tabs
    "webRequest",     // Monitor requests
    "notifications"   // System notifications
  ],
  "host_permissions": [
    "https://*.example.com/*"
  ]
}
```

## Types of Scripts

### Service Worker (Background)

```javascript
// background.js
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
});
```

### Content Script

```javascript
// content.js - runs in page context
document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.textContent = 'Click me';
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'buttonClicked' });
  });
  document.body.appendChild(button);
});
```

### Popup (UI)

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <h1>My Extension</h1>
  <button id="action">Run Action</button>
  <script src="popup.js"></script>
</body>
</html>
```

## Message Passing

```javascript
// Content script -> Background
chrome.runtime.sendMessage({ type: 'GET_DATA' }, (response) => {
  console.log('Response:', response);
});

// Background -> Content script
chrome.tabs.sendMessage(tabId, { type: 'UPDATE' }, (response) => {
  console.log('Update sent');
});
```

## Storage API

```javascript
// Save data
chrome.storage.local.set({ key: 'value' }, () => {
  console.log('Data saved');
});

// Retrieve data
chrome.storage.local.get(['key'], (result) => {
  console.log('Retrieved:', result.key);
});

// Sync storage (cross-device)
chrome.storage.sync.set({ theme: 'dark' });
```

## When to Use

- ต้องการเพิ่ม UI ใน browser (popup, toolbar)
- ต้องการ track/web request monitoring
- ต้องการ inject content scripts
- ต้องการ save data ใน browser storage
