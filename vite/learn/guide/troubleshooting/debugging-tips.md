# Debugging Tips

## 1. Enable Debug Mode

```bash
DEBUG=vite:* bun run dev
```

## 2. Check Vite Version

```bash
bunx vite --version
```

## 3. Clear Cache

```bash
rm -rf node_modules/.vite
```

## 4. Check Network Tab

Inspect network requests ใน browser dev tools

## 5. Use Vite Inspector

```bash
bun add -D vite-plugin-inspect
```

```typescript
// vite.config.ts
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect(),
  ],
})
```
