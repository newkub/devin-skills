# Tool Madge API & Dependencies

## Install

```sh
bun add -D madge
```

## Version

- Latest: `8.0.0` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/madge)
- [Repository](https://github.com/pahen/madge)

## Dependencies

- ใช้ `dependency-tree` + `tsconfig-paths` เป็นต้น; graphviz optional สำหรับ image output
- รองรับ JS/TS, JSX/TSX, CoffeeScript — ESM+CJS

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `madge <path>` | Dependency graph analysis | - | --ts-config, --extensions |
| `madge --circular` | หา circular deps | - | - |
| `madge --depends <mod>` | Modules ที่ depend on X | - | - |
| `madge --orphans` | Modules ไม่มี parent | - | - |
| `madge --leaves` | Modules ไม่มี deps | - | - |
| `madge --image out.svg` | Export graph | - | requires graphviz |
| `madge --json` | JSON output | - | สำหรับ CI checks |

## Source

- Official docs: https://github.com/pahen/madge
- Description: Dependency graph analysis — circular detection, orphans, leaves.
