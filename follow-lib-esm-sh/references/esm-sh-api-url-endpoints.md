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
