# Plugin System

mise ใช้ plugin สำหรับจัดการ tools แต่ละประเภท

## การทำงาน

- Plugins จัดการ logic สำหรับ download, install, และ version detection
- Auto-load plugins จาก community repository
- สามารถใช้ custom plugins สำหรับ internal tools

## Plugin Sources

- Official mise plugins (mise-registry)
- Community plugins
- Custom plugins

## ตัวอย่าง

```bash
# ดู plugins ที่มี
mise plugins

# ติดตั้ง plugin
mise plugins install node

# Update plugins
mise plugins update
```
