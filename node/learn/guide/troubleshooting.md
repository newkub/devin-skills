---
description: การแก้ปัญหาที่พบบ่อยใน Node.js
---

## Goal

อธิบายปัญหาที่พบบ่อยและวิธีแก้ไข

## Scope

สำหรับโปรเจกต์ที่ใช้ Node.js เป็น runtime

## Common Issues

### 1. Installation Failed

**Problem:** ไม่สามารถติดตั้ง Node.js ได้

**Solution:**
```bash
# ใช้ nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# ใช้ n (Windows)
bun install -g n
n latest
```

### 2. Module Not Found

**Problem:** `Error: Cannot find module`

**Solution:**
```bash
# ติดตั้ง dependencies
bun install

# ติดตั้ง dev dependencies
bun install -D

# ตรวจสอบ node_modules
ls node_modules
```

### 3. Port Already in Use

**Problem:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# หา process ที่ใช้ port
lsof -i :3000

# Kill process
kill -9 <PID>

# หรือใช้ port อื่น
PORT=3001 node server.js
```

### 4. Memory Leak

**Problem:** Application ใช้ memory มากเกินไป

**Solution:**
```bash
# ตรวจสอบ memory usage
node --inspect server.js

# ใช้ Chrome DevTools Profiler
# หรือใช้ heapdump
bun install heapdump
```

### 5. Event Loop Blocked

**Problem:** Application ช้าหรือ freeze

**Solution:**
- ใช้ async operations แทน sync
- ใช้ worker threads สำหรับ CPU-intensive tasks
- ใช้ clustering สำหรับ multi-core

### 6. Dependencies Outdated

**Problem:** Security vulnerabilities ใน dependencies

**Solution:**
```bash
bun audit
bun audit fix
bun update
```

### 7. TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# ติดตั้ง types
bun install -D @types/node

# ตรวจสอบ tsconfig.json
npx tsc --noEmit
```

## Debugging Tips

### 1. Enable Debug Mode

```bash
node --inspect script.js
```

### 2. Use Console Logging

```javascript
console.log('Debug:', variable);
console.error('Error:', error);
```

### 3. Use Debugger

```javascript
debugger; // Breakpoint
```

### 4. Check Node Version

```bash
node --version
bun --version
```

## Getting Help

- [Node.js Documentation](https://nodejs.org/docs)
- [Node.js GitHub Issues](https://github.com/nodejs/node/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/node.js)
