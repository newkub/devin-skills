# Common File And Content Patterns

Common patterns for `search`

## File Name Patterns

- `/*.test.{ts,tsx,js,jsx}` — test files
- `/*.spec.*` — spec files
- `/__mocks__/` — mock files
- `/mocks.{ts,js}` — mock modules
- `/fixtures/` — fixture data
- `/index.{ts,tsx,js,jsx}` — barrel exports
- `/*.d.ts` — type declaration files
- `/{README,CONTRIBUTING,CHANGELOG,SECURITY}.md` — markdown docs

## Content Patterns

### TODO And FIXME

- regex: `TODO|FIXME|HACK|XXX|NOTE\(`
- ast-grep: `pattern: /\/\/\s*TODO/`

### Debug And Console

- regex: `console\.(log|warn|error|debug|info|trace)\(`
- regex: `debugger;`

### Hardcoded Secrets

- regex: `(password|secret|token|api[_-]?key)\s*=\s*["\'][^"\']+["\']`
- regex: `Bearer\s+[a-zA-Z0-9_\-\.]+`

### Unused Exports

- ast-grep: `export (const|let|var|function|class) $NAME` then verify no `import` from other files

### Barrel Files

- ast-grep: `export * from "..."` or `export { ... } from "..."`

### Cyclic Or Bad Imports

- regex: `import\s+.*\s+from\s+["\']\.\.?\/` to find relative imports
- ast-grep: `import $$$ from "../$PATH"` then check directory depth

### Performance Hotspots

- regex: `for\s*\(.*for.*\)` — nested loops
- regex: `\.map\(.*\.map\(` — double map
- regex: `JSON\.stringify\(.*\)` inside a loop

## Usage

- Copy the suitable pattern into `grep` or `ast-grep`
- Adjust scope to the project language and conventions
- Use `/report table` to summarize results
