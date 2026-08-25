# Configuration Reference

Complete manifest.json configuration reference

## Minimal Manifest

```json
{
  "manifest_version": 3,
  "name": "Extension Name",
  "version": "1.0.0"
}
```

## Full Manifest Example

```json
{
  "manifest_version": 3,
  "name": "__MSG_extension_name__",
  "description": "__MSG_extension_description__",
  "version": "1.0.0",
  "version_name": "1.0.0 Beta",
  "default_locale": "en",
  "icons": {
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
  "action": {
    "default_title": "__MSG_action_title__",
    "default_icon": {
      "16": "images/toolbar-16.png",
      "32": "images/toolbar-32.png"
    },
    "default_popup": "popup/popup.html"
  },
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "css": ["styles/content.css"],
    "js": ["scripts/content.js"],
    "run_at": "document_idle"
  }],
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://*.example.com/*"
  ],
  "options_ui": {
    "page": "options/options.html",
    "open_in_tab": true
  },
  "commands": {
    "toggle-feature": {
      "suggested_key": {
        "default": "Ctrl+Shift+F",
        "mac": "Command+Shift+F"
      },
      "description": "Toggle feature"
    }
  },
  "web_accessible_resources": [{
    "resources": ["images/*", "styles.css"],
    "matches": ["https://*.example.com/*"]
  }],
  "declarative_net_request": {
    "rule_resources": [{
      "id": "rules_1",
      "enabled": true,
      "path": "rules/block-ads.json"
    }]
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

## Manifest Fields Reference

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| manifest_version | number | Yes | Must be 3 for Manifest V3 |
| name | string | Yes | Extension name (max 45 chars) |
| version | string | Yes | SemVer format |
| version_name | string | No | Display version |
| description | string | No | Description (max 140 chars) |
| default_locale | string | No | Default i18n locale |

### Icons

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| icons | object | Recommended | Sizes: 16, 32, 48, 128 |
| action.default_icon | object | No | Toolbar icon sizes |

### Background

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| background.service_worker | string | Yes | Path to service worker |
| background.type | string | No | Use "module" for ES modules |

### Content Scripts

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| matches | array | Yes | URL patterns |
| js | array | No | Script paths |
| css | array | No | Stylesheet paths |
| run_at | string | No | document_start/end/idle |

### Permissions

| Permission | Description |
|------------|-------------|
| storage | Chrome storage API |
| activeTab | Access to current tab |
| scripting | Script injection |
| tabs | Tab management |
| notifications | System notifications |
| contextMenus | Context menu |
| webRequest | Request monitoring |
| declarativeNetRequest | DNR rules |
| identity | OAuth2 |
| sidePanel | Side panel access |

### Host Permissions

| Pattern | Description |
|---------|-------------|
| https://*/* | All HTTPS pages |
| https://*.example.com/* | All subdomains |
| http://localhost:3000/* | Local dev server |

## Declarative Net Request Rules

```json
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "block | allow | redirect | modifyHeaders"
  },
  "condition": {
    "urlFilter": "pattern",
    "resourceTypes": ["main_frame", "script"],
    "domains": ["example.com"]
  }
}
```

## Action Types

| Type | Description |
|------|-------------|
| block | Block request |
| allow | Allow request (skip other rules) |
| redirect | Redirect to specified URL |
| upgradeScheme | Upgrade HTTP to HTTPS |
| modifyHeaders | Add/remove request headers |

## Match Patterns

| Pattern | Matches |
|---------|--------|
| `<all_urls>` | All URLs |
| `https://*/*` | All HTTPS pages |
| `file:///*` | Local files |
| `http://localhost:*/*` | Any localhost port |
