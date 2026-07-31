# Development Server Issues

## 1. Port Already in Use

**Problem:**
```
Error: Port 5173 is already in use
```

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,  // Change port
  },
})
```

หรือ kill process ที่ใช้ port 5173

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

## 2. HMR Not Working

**Problem:**
HMR ไม่ทำงานเมื่อแก้ไขไฟล์

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,  // Enable polling for some file systems
    },
  },
})
```

## 3. CORS Errors

**Problem:**
CORS errors เมื่อเรียก API จาก dev server

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```
