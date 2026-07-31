# How It Works

## Browser Extension Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser Process                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Extension Process                              │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │  Service Worker  │◄──►│     Chrome APIs                  │   │  │
│  │  │  (background.js) │    │  - tabs, storage, runtime        │   │  │
│  │  │                  │    │  - webRequest, scripting         │   │  │
│  │  └────────┬─────────┘    └─────────────────────────────────┘   │  │
│  │           │                                                       │  │
│  │           │ chrome.runtime.sendMessage()                         │  │
│  │           │ chrome.tabs.sendMessage()                            │  │
│  │           ▼                                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │                   Content Scripts                          │  │  │
│  │  │                    (injected.js)                          │  │  │
│  │  │                                                             │  │  │
│  │  │  ┌─────────────────────────────────────────────────────┐   │  │  │
│  │  │  │                  Web Page                           │   │  │  │
│  │  │  │               DOM + JavaScript                      │   │  │  │
│  │  │  └─────────────────────────────────────────────────────┘   │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Extension Lifecycle

```
Extension Installation
        │
        ▼
┌───────────────────┐
│  Service Worker   │
│     starts        │
│                   │
│  onInstalled      │
│     event         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   User clicks      │
│   extension icon  │
│                   │
│   Opens popup     │
│   or runs action  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Content Script   │
│   injection       │
│                   │
│  Communicates     │
│  via messaging    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Storage API     │
│  save/retrieve    │
│      data         │
└───────────────────┘
```

## Manifest V3 Components

```
manifest.json
    │
    ├── "background" ──────► Service Worker (background.js)
    │
    ├── "action" ───────────► Popup (popup.html + popup.js + popup.css)
    │
    ├── "content_scripts" ─► Injected into web pages (content.js)
    │
    ├── "options_ui" ───────► Options Page (options.html)
    │
    └── "icons" ────────────► Extension icons (16, 48, 128)
```

## Message Flow

```javascript
// 1. User clicks browser action
// 2. Popup opens (popup.html + popup.js)

popup.js:
```javascript
document.getElementById('btn').addEventListener('click', () => {
  // Send message to service worker
  chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
    displayData(response);
  });
});
```

// 3. Service worker handles message
background.js:
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
    fetchDataFromAPI().then(data => {
      sendResponse({ data });
    });
    return true; // Keep channel open for async response
  }
});
```

// 4. Service worker may communicate with content script
background.js:
```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_DOM' });
});
```

// 5. Content script updates page
content.js:
```javascript
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_DOM') {
    document.body.style.background = 'yellow';
  }
});
```

## Service Worker Lifecycle

```
Service Worker Lifecycle
        │
        ▼
┌───────────────────┐
│   Extension       │
│   loads worker    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  onInstalled     │
│  event fires      │
└────────┬──────────┘
         │
         ├──► Idle (waiting for events)
         │
         ▼
┌───────────────────┐
│   Event occurs    │
│   (message, etc)  │
│                   │
│   Worker wakes    │
│   handles event   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Timeout (30s)    │
│  Worker sleeps    │
└───────────────────┘
```

## Sandboxed Environment

```
┌────────────────────────────────────────────────────┐
│                 Web Page                            │
│                                                     │
│  ┌─────────────┐    ┌──────────────────────────┐   │
│  │  Page JS    │    │    Content Script         │   │
│  │             │    │    (sandboxed)            │   │
│  │             │    │                           │   │
│  │             │    │    Can access:           │   │
│  │             │    │    - DOM (read-only)     │   │
│  │             │    │    - chrome.runtime.*    │   │
│  │             │    │                           │   │
│  │             │    │    Cannot access:         │   │
│  │             │    │    - Page variables      │   │
│  │             │    │    - Closure scope       │   │
│  └─────────────┘    └──────────────────────────┘   │
│                                                     │
└────────────────────────────────────────────────────┘
```