---
name: electron
description: "Framework for building cross-platform desktop applications using web technologies (HTML, CSS,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง cross-platform desktop applications ด้วย web technologies


## Scope

ใช้สำหรับการสร้าง desktop applications ด้วย HTML, CSS, JavaScript และ Node.js integration


## When To Use

- เมื่อต้องการสร้าง cross-platform desktop applications
- เมื่อต้องการใช้ web technologies (HTML, CSS, JavaScript) สำหรับ desktop
- เมื่อต้องการ Node.js integration สำหรับ backend logic
- เมื่อต้องการ native features ของ desktop applications


## Execute

### 1. Create Project

```bash
bun create electron-app
```

### 2. Configure Main Process

ตั้งค่า main process และ window

### 3. Implement Renderer

Develop UI ด้วย web technologies

### 4. Setup IPC

Configure IPC สำหรับ communication ระหว่าง processes


## Rules

### Development
- ใช้ TypeScript สำหรับ type safety
- Separate main และ renderer processes
- ใช้ IPC สำหรับ secure communication

### Security
- ใช้ context isolation
- Disable node integration ใน renderer
- Validate IPC messages

### Best Practices
- ใช้ preload scripts สำหรับ secure APIs
- Optimize bundle size
- Test บน target platforms


## References

- [Electron Docs](https://www.electronjs.org/docs)
- [Electron GitHub](https://github.com/electron/electron)
- [Electron Fiddle](https://www.electronjs.org/fiddle)


## Related Skills

- `follow-write-devin-skills` - มาตรฐานการเขียน skills
- lang-javascript
- lang-typescript
- bun


## Expected Outcome

- Cross-platform desktop applications
- Secure IPC communication
- Native features integration
