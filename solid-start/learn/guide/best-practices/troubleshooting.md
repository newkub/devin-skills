# Troubleshooting - SolidStart

## Common Issues

### Build Errors

#### Module Not Found

**สาเหตุ:** Dependencies ไม่ถูกติดตั้ง

**วิธีแก้:**
```bash
rm -rf node_modules bun.lockb
bun install
```

#### TypeScript Errors

**สาเหตุ:** TypeScript configuration ไม่ถูกต้อง

**วิธีแก้:**
ตรวจสอบ `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"]
  }
}
```

### Runtime Errors

#### Hydration Mismatch

**สาเหตุ:** Server และ client render ไม่ตรงกัน

**วิธีแก้:**
```typescript
// ใช้ เพื่อ skip hydration
const isServer = import.meta.env.SSR;

export default function Component() {
  if (isServer) return <div>Server</div>;
  return <div>Client</div>;
}
```

#### Signal Not Updating

**สาเหตุ:** ไม่เรียก signal function

**วิธีแก้:**
```typescript
// ❌ Wrong
const count = createSignal(0);
console.log(count); // Function

// ✅ Correct
const count = createSignal(0);
console.log(count()); // Value
```

### Development Errors

#### Port Already in Use

**สาเหตุ:** Port 3000 ถูกใช้งานอยู่

**วิธีแก้:**
```bash
PORT=3001 bun run dev
```

หรือ kill process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix
lsof -ti:3000 | xargs kill
```

#### HMR Not Working

**สาเหตุ:** Vite HMR configuration ไม่ถูกต้อง

**วิธีแก้:**
ตรวจสอบ `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    hmr: true,
  },
});
```

### Performance Issues

#### Slow Initial Load

**สาเหตุ:** Bundle ใหญ่เกินไป

**วิธีแก้:**
- ใช้ lazy loading
- Optimize images
- Enable code splitting

#### Slow TTFB

**สาเหตุ:** Server-side rendering ช้า

**วิธีแก้:**
- ใช้ streaming SSR
- Cache data
- Optimize database queries

### Deployment Issues

#### Build Fails on Vercel

**สาเหตุ:** Environment variables ไม่ถูกตั้งค่า

**วิธีแก้:**
ตั้งค่า environment variables ใน Vercel dashboard

#### Static Assets Not Loading

**สาเหตุ:** Public folder path ไม่ถูกต้อง

**วิธีแก้:**
ตรวจสอบว่า assets อยู่ใน `public/` folder

## Debugging Tools

### Browser DevTools

ใช้ SolidJS DevTools:

```bash
bun add -D solid-devtools
```

ตั้งค่าใน `entry-client.tsx`:
```typescript
import "solid-devtools";
```

### Console Logging

ใช้ console logging สำหรับ debug:

```typescript
createEffect(() => {
  console.log("State changed:", state());
});
```

### Source Maps

เปิด source maps ใน development:

```typescript
// app.config.ts
export default defineConfig({
  sourcemap: true,
});
```

## Getting Help

### Documentation

- Official Docs: https://docs.solidjs.com/solid-start
- GitHub Issues: https://github.com/solidjs/solid-start/issues

### Community

- Discord: https://discord.com/invite/solidjs
- Reddit: https://reddit.com/r/solidjs
- Stack Overflow: https://stackoverflow.com/questions/tagged/solidjs
