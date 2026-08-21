# Best Practices

## Security

### Use Minimal Permissions

```json
// ❌ Bad - too many permissions
"permissions": ["tabs", "webRequest", "webNavigation", "storage", "activeTab"]

// ✅ Good - only what you need
"permissions": ["storage"]
```

### Validate Messages

```javascript
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Validate message structure
  if (!message || typeof message.action !== 'string') {
    return false;
  }

  // Validate sender
  if (!sender.tab) {
    return false;
  }

  // Process valid message
  handleMessage(message, sendResponse);
  return true;
});
```

### Avoid eval()

```javascript
// ❌ Bad - eval is a security risk
eval(userInput);

// ✅ Good - use safer alternatives
const fn = new Function(userCode);
fn();
```

## Performance

### Lazy Load Content Scripts

```json
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["heavy-lib.js"],
    "run_at": "document_idle"
  }]
}
```

### Debounce Expensive Operations

```javascript
// Debounce storage writes
let saveTimeout;
function saveData(data) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.local.set({ data });
  }, 500);
}
```

### Use Declarative Net Request

```json
{
  "declarative_net_request": {
    "rule_resources": [{
      "id": "block_ads",
      "enabled": true,
      "path": "rules/block-ads.json"
    }]
  }
}
```

## Code Organization

### Separate Concerns

```
my-extension/
├── src/
│   ├── background/
│   │   └── service-worker.js
│   ├── content/
│   │   ├── content-script.js
│   │   └── content.css
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── shared/
│       ├── constants.js
│       └── utils.js
├── manifest.json
└── build/
```

### Use Module Pattern

```javascript
// background.js
const ExtensionManager = (() => {
  const state = { initialized: false };

  return {
    init() {
      if (state.initialized) return;
      console.log('Initializing extension');
      state.initialized = true;
    },

    getState() {
      return { ...state };
    }
  };
})();

chrome.runtime.onInstalled.addListener(() => ExtensionManager.init());
```

## Testing

### Use Chrome Debugging API

```javascript
// background.js
chrome.test.assertTrue(true, 'Extension loaded');
chrome.test.assertEq('expected', 'actual');
```

### Test Content Scripts

```javascript
// content.test.js
const mockDocument = {
  body: { style: {} },
  querySelector: () => null
};

// Test your content script logic
```

## Error Handling

### Handle API Errors

```javascript
chrome.storage.local.get(['key'], (result) => {
  if (chrome.runtime.lastError) {
    console.error('Storage error:', chrome.runtime.lastError);
    return;
  }
  console.log('Data:', result.key);
});
```

### Use Try-Catch

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP error');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

## Manifest Best Practices

### Use Semantic Versioning

```json
{
  "version": "1.0.0",
  "version_name": "1.0.0 (Beta)"
}
```

### Document Permissions

```json
{
  "permissions": ["storage"],
  "description": "__MSG_extension_description__"
}
```

### Provide Icons

```json
{
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

## Localization

### Use Message Bundles

```json
// _locales/en/messages.json
{
  "extension_name": {
    "message": "My Extension",
    "description": "Extension display name"
  },
  "greeting": {
    "message": "Hello, $USER$!",
    "description": "Greeting message",
    "placeholders": {
      "user": { "content": "$1" }
    }
  }
}
```

### Reference Messages in Code

```javascript
const name = chrome.i18n.getMessage('extension_name');
const greeting = chrome.i18n.getMessage('greeting', ['World']);
```
