# Performance

## Performance

### Runtime

- เร็วกว่า Node.js 10-20 เท่า
- Startup time เร็ว (Zig)
- Memory usage ต่ำกว่า

### Package Manager

- ติดตั้ง dependencies เร็วกว่า bun 20 เท่า
- Efficient caching
- Parallel installation

### Bundler

- Bundling เร็ว (native code)
- Tree-shaking อัตโนมัติ
- Code splitting รองรับ

## Optimization Tips

### Use Bun APIs

```typescript
// ❌ Node.js
import { readFileSync } from 'fs';
const data = readFileSync('file.txt');

// ✅ Bun
const data = await Bun.file('file.txt').text();
```

### Build for Production

```bash
bun build src/index.ts --outdir ./dist --minify
```

### Watch Mode

```bash
bun --watch run src/index.ts
```

### Fast Testing

```bash
bun test
```

### TypeScript

Bun รัน TypeScript ได้โดยตรง ไม่ต้อง compile ก่อน

## Benchmarks

| Operation | Node.js | Bun | Speedup |
|-----------|---------|-----|---------|
| Startup | 200ms | 50ms | 4x |
| JSON Parse | 100ms | 20ms | 5x |
| File Read | 50ms | 10ms | 5x |
| HTTP Server | 10k req/s | 50k req/s | 5x |
