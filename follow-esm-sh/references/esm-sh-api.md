# esm.sh - API Reference

API และ endpoints ของ esm.sh

## Base URL

```text
https://esm.sh/
```

## Package URL Format

```text
https://esm.sh/{package}@{version}/{path}
```

### URL Components

| Component | Description | Example |
|-----------|-------------|---------|
| `package` | bun package name | `vue`, `@vue/core` |
| `version` | Version or tag | `3.4.21`, `next`, `3` |
| `path` | File path in package | `dist/vue.esm.js` |

## Query Parameters

### Target

```text
?target={esversion}
```

| Value | Description |
|-------|-------------|
| `es2015` | ES6 (good compatibility) |
| `es2017` | ES8 |
| `es2020` | ES11 (default) |
| `es2022` | ES13 (modern) |
| `esnext` | Latest |

### External

```text
?external={package1,package2}
```

Mark packages as external (not bundled).

### Options

| Parameter | Description | Example |
|-----------|-------------|---------|
| `?dev` | Use development build | `?dev` |
| `?no-dts` | Skip TypeScript types | `?no-dts` |
| `?esm` | Force ESM output | `?esm` |
| `?no-check` | Skip integrity check | `?no-check` |

## Data API

### Package Info

```text
GET https://esm.sh/package/{package}@{version}
```

Response:
```json
{
  "name": "vue",
  "version": "3.4.21",
  "description": "Progressive JavaScript Framework",
  "exports": {
    ".": "./dist/vue.esm-browser.js",
    "./router": "./dist/vue-router.esm.js"
  }
}
```

### Bundle Info

```text
GET https://esm.sh/bundle/{package}@{version}
```

Response:
```json
{
  "size": 45000,
  "gzipped": 15000,
  "deps": ["@vue/shared"],
  "mjs": "https://esm.sh/vue@3.4.21/+esm"
}
```

## Status Endpoint

```text
GET https://esm.sh/status
```

Response:
```json
{
  "status": "ok",
  "cache": {
    "hitRate": 0.95,
    "totalRequests": 1000000
  },
  "upstream": {
    "bun": "ok"
  }
}
```

## Package Browser

```text
https://esm.sh/package/{package}
```

Displays:
- Available versions
- Export map
- Bundle size
- Dependencies

## Example URLs

### Basic Imports

```text
# Vue 3
https://esm.sh/vue@3.4.21

# Vue Router
https://esm.sh/vue-router@4.2.5

# React
https://esm.sh/react@18

# Lodash ESM
https://esm.sh/lodash-es@4.17.21
```

### With Options

```text
# ES2022 target
https://esm.sh/vue@3?target=es2022

# External dependencies
https://esm.sh/react-dom@18?external=react

# Dev build
https://esm.sh/vue@3?dev

# Skip types
https://esm.sh/vue@3?no-dts
```

### Deep Imports

```text
# Lodash individual function
https://esm.sh/lodash-es@4/debounce

# Vue specific export
https://esm.sh/vue@3/dist/vue.esm-browser.js

# Preact hooks
https://esm.sh/preact@10/hooks
```

## CDN Endpoints

### cdn.jsdelivr.net Mirror

esm.sh also mirrors jsdelivr:

```text
# Equivalent to cdn.jsdelivr.net/npm/vue@3
https://esm.sh/v3/vue
```

### unpkg Mirror

```text
# Equivalent to unpkg.com/vue@3
https://esm.sh/bun/vue@3
```

## Headers

### Response Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | MIME type (application/javascript) |
| `Cache-Control` | Caching directives |
| `ETag` | Content identifier |
| `Access-Control-Allow-Origin` | CORS headers |

### Cache Control

```text
# Pinned version (1 year)
Cache-Control: public, max-age=31536000, immutable

# Unpinned (1 hour)
Cache-Control: public, max-age=3600
```

## Error Responses

### 404 Not Found

```json
{
  "error": "Package not found",
  "message": "package '@nonexistent/package' does not exist"
}
```

### 500 Server Error

```json
{
  "error": "Bundle failed",
  "message": "Failed to bundle package"
}
```

## Best Practices

### Recommended URL Patterns

```javascript
// ✅ Production: exact version
https://esm.sh/vue@3.4.21

// ✅ Development: major version
https://esm.sh/vue@3

// ✅ With options
https://esm.sh/vue@3.4.21?target=es2022

// ✅ External deps
https://esm.sh/react-dom@18?external=react
```

## Rate Limits

```text
No explicit rate limits for CDN requests.
Fair use policy applies.
```

## Integration Examples

### HTML Script Tag

```html
<script type="module" crossorigin>
  import { createApp } from 'https://esm.sh/vue@3.4.21';
</script>
```

### Import Map

```json
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.21"
  }
}
```

### Deno

```typescript
import { createApp } from 'https://esm.sh/vue@3.4.21';
```

## สรุป

- Base URL: `https://esm.sh/`
- URL format: `{package}@{version}/{path}`
- Query params: `target`, `external`, `dev`, `no-dts`
- Status endpoint: `/status`
- Package browser: `/package/{package}`
