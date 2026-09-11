---
title: API Reference Page Template
description: Template for docs/references/api.md or per-endpoint pages
---

# API Reference Page Template

```md
---
title: API Reference
description: Public API surface — functions, endpoints, or exports
---

# API Reference

## <Function / Endpoint / Export Name>

```ts
// signature — copied from real source
export function doThing(input: string): Result
```

| No. | Param | Type | Required | Description |
|-----|-------|------|----------|-------------|
| 1 | `input` | `string` | yes | <what it is> |

**Returns:** <type + meaning>

**Example:**

```ts
const result = doThing('x')
```

**Errors:** <thrown errors / status codes>
```

## Rules

- Document only real public API — exports, HTTP endpoints, CLI surface
- Signatures copied from source, not paraphrased
- Group by module with `##` headings
