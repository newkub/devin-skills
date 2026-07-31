---
description: ตั้งค่า mise สำหรับ project
---

## Goal

ตั้งค่า project config ด้วย `.mise.toml`

## Execute

### 1. สร้าง .mise.toml

```bash
cd /path/to/project
mise use node@20.11.0
```

หรือสร้างไฟล์ด้วยตนเอง:

```toml
[tools]
node = "20.11.0"
python = "3.12.0"
bun = "1.1.0"
```

### 2. ติดตั้ง Tools

```bash
mise install
```

### 3. ตรวจสอบ Versions

```bash
mise current
```

### 4. Commit Config

```bash
git add .mise.toml
git commit -m "Add mise config"
```

## Expected Outcome

- Project มี `.mise.toml` ที่กำหนด tools
- Tools ติดตั้งและพร้อมใช้งาน
- Team members สามารถ setup environment ได้อัตโนมัติ
