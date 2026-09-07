# Lib React API & Dependencies

## Install

```sh
bun add react react-dom
# or
npm install react react-dom
```

## Version

- Latest: 19.2.8
- Package Registry: https://www.npmjs.com/package/react
- Repository: https://github.com/react/react

## Dependencies

- `react` and `react-dom` ต้องมี version เดียวกัน
- `babel-plugin-react-compiler` สำหรับ React Compiler (optional)
- `eslint-plugin-react-hooks` ล่าสุดสำหรับ compiler lint rules

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install react in project | latest version | `--save-dev`, `--save`, `--global` |
| `dev` | Start Vite dev server | `vite` | (none) |
| `build` | Build for production | `vite build` | (none) |
| `typecheck` | Run TypeScript type check | `tsc --noEmit` | (none) |
| `import 'react/jsx-runtime'` | Subpath export for jsx-runtime | entry as documented | (none) |
| `import 'react/compiler-runtime'` | Subpath export for compiler-runtime | entry as documented | (none) |

## Source

- Official docs: https://react.dev/
- Versions: https://react.dev/versions
- React Compiler: https://react.dev/learn/react-compiler
- Description: React is a JavaScript library for building user interfaces.
