# Features

Features และ capabilities ของ Manifest V3 browser extensions

## Browser Action (Toolbar Icon)

### Manifest Configuration

```json
{
  "action": {
    "default_title": "My Extension",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "default_popup": "popup/popup.html"
  }
}
```

### Dynamic Icon

```javascript
chrome.action.setIcon({ path: 'icons/new-icon.png' });
chrome.action.setBadgeText({ text: '5' });
chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
```

## Context Menus

```javascript
// Create context menu
chrome.contextMenus.create({
  id: 'menu-item-1',
  title: 'Do Something',
  contexts: ['selection', 'page']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'menu-item-1') {
    chrome.tabs.sendMessage(tab.id, { action: 'doSomething' });
  }
});
```

## Tabs API

```javascript
// Query tabs
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log(tabs[0].url);
});

// Create tab
chrome.tabs.create({ url: 'https://example.com' });

// Update tab
chrome.tabs.update({ url: 'https://new-url.com' });

// Send message to tab
chrome.tabs.sendMessage(tabId, { message: 'hello' });
```

## Storage API

```javascript
// local - stored on device
chrome.storage.local.set({ key: 'value' });
chrome.storage.local.get(['key'], (result) => {});

// sync - synced across devices (Chrome only)
chrome.storage.sync.set({ theme: 'dark' });
chrome.storage.sync.get(['theme'], (result) => {});

// Managed - enterprise policies
chrome.storage.managed.get(['setting'], (result) => {});

// Changes listener
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('Changed:', changes);
});
```

## Declarative Net Request

```json
{
  "permissions": ["declarativeNetRequest"],
  "declarative_net_request": {
    "rule_resources": [{
      "id": "rules",
      "enabled": true,
      "path": "rules.json"
    }]
  }
}
```

```json
// rules.json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "block",
      "redirect": { "url": "https://blocked.example.com" }
    },
    "condition": {
      "urlFilter": "*://ads.example.com/*"
    }
  }
]
```

## Script Injection

```javascript
// Inject CSS
chrome.scripting.insertCSS({
  target: { tabId: tab.id },
  files: ['styles.css']
});

// Inject JS
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['content.js']
});

// Inject function
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => {
    document.body.style.background = 'yellow';
  }
});
```

## Commands (Keyboard Shortcuts)

```json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": { "default": "Ctrl+Shift+F" },
      "description": "Toggle my feature"
    }
  }
}
```

```javascript
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-feature') {
    // Toggle feature
  }
});
```

## Notifications

```javascript
chrome.notifications.create('notification-id', {
  type: 'basic',
  iconUrl: 'icons/icon.png',
  title: 'Title',
  message: 'Message body',
  priority: 0
});

chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Clicked:', notificationId);
});
```

## Side Panel (Chrome 102+)

```json
{
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "permissions": ["sidePanel"]
}
```

```javascript
chrome.sidePanel.setOptions({
  path: 'new-panel.html',
  enabled: true
});
```
