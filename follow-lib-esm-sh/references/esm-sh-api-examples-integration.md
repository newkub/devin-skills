# esm.sh - Examples & Integration

ตัวอย่าง URL, CDN mirrors, headers, error responses และ integration

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
