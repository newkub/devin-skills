# Architecture

## Project Structure

```
my-extension/
├── manifest.json              # Extension manifest
├── _locales/                  # Internationalization
│   ├── en/messages.json
│   └── th/messages.json
├── background/
│   └── service-worker.js      # Background service worker
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/
│   ├── content-script.js      # Content scripts
│   └── content.css
├── options/
│   ├── options.html
│   ├── options.js
│   └── options.css
├── shared/
│   ├── constants.js            # Shared constants
│   ├── utils.js               # Utility functions
│   └── messages.js            # Message types
├── assets/
│   └── images/
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
├── rules/
│   └── declarative-rules.json  # DNR rules
└── build/                     # Build output
```

## Extension Communication

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Extension Architecture                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     Service Worker                              │  │
│  │                                                                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                │  │
│  │  │  Storage   │  │   Tabs     │  │  Runtime   │                │  │
│  │  │   API      │  │    API     │  │   API      │                │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                │  │
│  │        │               │               │                        │  │
│  │        └───────────────┼───────────────┘                        │  │
│  │                        │                                        │  │
│  │                    Message Bus                                  │  │
│  │                        │                                        │  │
│  └────────────────────────┼────────────────────────────────────────┘  │
│                           │                                           │
│          ┌────────────────┼────────────────┐                         │
│          │                │                │                         │
│          ▼                ▼                ▼                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Popup     │  │   Content   │  │   Options   │                  │
│  │  (UI JS)    │  │   Scripts   │  │    Page     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Service Worker Architecture

```javascript
// service-worker.js - Modular structure

// 1. Event handlers
chrome.runtime.onInstalled.addListener(handleInstall);
chrome.runtime.onStartup.addListener(handleStartup);

// 2. Message handlers
chrome.runtime.onMessage.addListener(handleMessage);

// 3. Tab event handlers
chrome.tabs.onActivated.addListener(handleTabActivated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);

// 4. Storage handlers
chrome.storage.onChanged.addListener(handleStorageChange);

// 5. Context menu handlers
chrome.contextMenus.onClicked.addListener(handleContextMenu);

// Modular functions
function handleInstall(details) {
  createContextMenus();
  initializeDefaultSettings();
}

function handleMessage(message, sender, sendResponse) {
  switch (message.type) {
    case 'GET_DATA': return handleGetData(message, sendResponse);
    case 'SET_DATA': return handleSetData(message, sendResponse);
    case 'FETCH_API': return handleFetchAPI(message, sendResponse);
    default: return false;
  }
}
```

## Content Script Architecture

```javascript
// content-script.js - Isolated execution

// 1. Module initialization
const ContentModule = (() => {
  const state = { initialized: false };

  return {
    init() {
      if (state.initialized) return;
      this.setupListeners();
      this.injectStyles();
      state.initialized = true;
    },

    setupListeners() {
      document.addEventListener('click', this.handleClick.bind(this));
    },

    handleClick(event) {
      // Handle clicks on target elements
    },

    injectStyles() {
      // Inject CSS for styling
    }
  };
})();

// 2. Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ContentModule.init());
} else {
  ContentModule.init();
}

// 3. Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  ContentModule.handleMessage(message);
  sendResponse({ received: true });
  return true;
});
```

## Popup Architecture

```javascript
// popup.js - React-like state management

class PopupState {
  constructor() {
    this.state = {
      count: 0,
      loading: true,
      error: null
    };
    this.listeners = [];
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async load() {
    try {
      this.setState({ loading: true });
      const result = await chrome.storage.local.get(['count']);
      this.setState({ count: result.count || 0, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }
}

const popupState = new PopupState();

// UI update function
function render(state) {
  document.getElementById('count').textContent = state.count;
}

popupState.subscribe(render);
popupState.load();
```

## Storage Layer

```javascript
// shared/storage.js - Centralized storage

export const Storage = {
  async get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },

  async set(items) {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },

  async remove(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, resolve);
    });
  },

  onChange(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
      callback(changes, area);
    });
  }
};

// Usage
const settings = await Storage.get(['theme', 'language']);
await Storage.set({ theme: 'dark' });
```

## Message Protocol

```javascript
// shared/messages.js - Type-safe messages

export const MessageTypes = {
  GET_STATE: 'GET_STATE',
  SET_STATE: 'SET_STATE',
  FETCH_DATA: 'FETCH_DATA',
  UPDATE_UI: 'UPDATE_UI',
  ERROR: 'ERROR'
};

export function createMessage(type, payload = {}) {
  return { type, payload, timestamp: Date.now() };
}

export function validateMessage(message) {
  return message &&
    typeof message.type === 'string' &&
    MessageTypes[message.type] !== undefined;
}
```

## Background Task Queue

```javascript
// shared/task-queue.js

class TaskQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const { task, resolve, reject } = this.queue.shift();
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    this.processing = false;
    this.process();
  }
}

const taskQueue = new TaskQueue();
```

## Error Boundaries

```javascript
// shared/error-handler.js

export function withErrorHandling(fn, errorHandler) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  };
}

// Usage in content script
const safeHandler = withErrorHandling(
  (event) => { /* handle event */ },
  (error) => { console.error('Handler error:', error); }
);
```
