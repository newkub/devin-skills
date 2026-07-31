---
title: Frontend Issues
description: การแก้ปัญหา frontend issues ที่พบบ่อย
---

## Error: "White screen on launch"

**Cause**: Frontend build path ไม่ถูกต้อง

**Solution**:
```json
// tauri.conf.json
{
  "build": {
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  }
}
```

## Error: "Hot reload not working"

**Cause**: Vite dev server ไม่ทำงาน

**Solution**:
```bash
# ตรวจสอบว่า dev server ทำงาน
bun run dev

# ตรวจสอบ port ใน tauri.conf.json
"devUrl": "http://localhost:5173"
```
