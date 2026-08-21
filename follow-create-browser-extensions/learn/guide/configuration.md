# Configuration

## manifest.json Structure

```json
{
  "manifest_version": 3,
  "name": "Extension Name",
  "version": "1.0.0",
  "description": "Extension description",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| manifest_version | number | Must be 3 for Manifest V3 |
| name | string | Extension name (max 45 chars) |
| version | string | SemVer format (e.g., "1.0.0") |

## Common Fields

| Field | Type | Description |
|-------|------|-------------|
| description | string | Extension description (max 140 chars) |
| version_name | string | Display version (optional) |
| default_locale | string | i18n default locale |
| permissions | array | API permissions |
| host_permissions | array | URL pattern permissions |

## Action (Browser Action)

```json
{
  "action": {
    "default_title": "Tooltip text",
    "default_icon": {
      "16": "icons/toolbar-16.png",
      "32": "icons/toolbar-32.png"
    },
    "default_popup": "popup/popup.html"
  }
}
```

## Background Service Worker

```json
{
  "background": {
    "service_worker": "background.js",
    "type": "module"
  }
}
```

## Content Scripts

```json
{
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "js": ["content.js"],
    "css": ["styles.css"],
    "run_at": "document_idle"
  }]
}
```

### Match Patterns

| Pattern | Description |
|---------|-------------|
| `<all_urls>` | All URLs |
| `https://*/*` | All HTTPS pages |
| `https://*.example.com/*` | All subdomains of example.com |
| `*://*.example.com/path/*` | Specific path |

### run_at Options

| Value | Description |
|-------|-------------|
| document_start | Before DOM parsed |
| document_end | After DOM complete |
| document_idle | After document idle |

## Web Accessible Resources

```json
{
  "web_accessible_resources": [{
    "resources": ["images/*", "styles.css"],
    "matches": ["https://*.example.com/*"]
  }]
}
```

## Commands (Shortcuts)

```json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": {
        "default": "Ctrl+Shift+F",
        "mac": "Command+Shift+F"
      },
      "description": "Toggle feature"
    }
  }
}
```

## Declarative Net Request

```json
{
  "permissions": ["declarativeNetRequest"],
  "declarative_net_request": {
    "rule_resources": [{
      "id": "rules_1",
      "enabled": true,
      "path": "rules/rules.json"
    }]
  }
}
```

## Side Panel

```json
{
  "permissions": ["sidePanel"],
  "side_panel": {
    "default_path": "sidepanel.html"
  }
}
```

## File Filters

```json
{
  "file_filters": [{
    "url": ["https://*.pdf"]
  }]
}
```

## Permissions Reference

| Permission | Description |
|------------|-------------|
| storage | Chrome storage API |
| activeTab | Access current tab |
| tabs | Query and manage tabs |
| scripting | Inject scripts |
| notifications | System notifications |
| contextMenus | Context menu |
| webRequest | Monitor requests |
| webNavigation | Navigation events |

## Host Permissions

```json
{
  "host_permissions": [
    "https://*.google.com/*",
    "https://*.youtube.com/*"
  ]
}
```

## Content Security Policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```
