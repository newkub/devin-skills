# Lib Esm Sh API & Dependencies

## Install

esm.sh เป็น CDN — ไม่ต้อง install package; import ผ่าน URL โดยตรง:

```ts
import React from 'https://esm.sh/react@19.3.0'
```

ถ้าต้องการ local dev กับ Node/Bun ให้ install package ต้นทางแทน (เช่น `bun add react`)

## Version

- Latest: see registry
- [Package Registry](https://www.npmjs.com/package/esm-sh)
- [Repository](https://github.com/esm-dev/esm.sh)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install esm-sh in project | latest version | --save-dev, --save, --global |
| `import` | Import from 'esm-sh' | default or named | (none) |
| `configure` | Configure project settings | project defaults | --config, --file |
| `use` | Use the main API / runtime | as documented | (none) |

## Source

- Official docs: https://esm.sh

