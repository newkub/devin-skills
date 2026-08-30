# Common File And Content Patterns

รายการ pattern ทั่วไปสำหรับ `search-files-patterns`

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

- ast-grep: `export (const|let|var|function|class) $NAME` แล้วตรวจสอบว่าไม่มี `import` จากไฟล์อื่น

### Barrel Files

- ast-grep: `export * from "..."` หรือ `export { ... } from "..."`

### Cyclic Or Bad Imports

- regex: `import\s+.*\s+from\s+["\']\.\.?\/` เพื่อหา relative imports
- ast-grep: `import $$$ from "../$PATH"` แล้ว check directory depth

### Performance Hotspots

- regex: `for\s*\(.*for.*\)` — nested loops
- regex: `\.map\(.*\.map\(` — double map
- regex: `JSON\.stringify\(.*\)` ใน loop

## Usage

- คัดลอก pattern ที่เหมาะสมไปใช้ใน `grep` หรือ `ast-grep`
- ปรับ scope ตาม project language และ conventions
- ใช้ `/report-table` สำหรับสรุปผล
