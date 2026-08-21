# Tool Version Management

การจัดการ tool versions แยกจาก system packages เพื่อให้แต่ละ project มี environment ที่เฉพาะเจาะจง

## ประโยชน์

- แต่ละ project สามารถใช้ tool versions ที่แตกต่างกัน
- ไม่ต้องใช้ sudo หรือ system-level installation
- สามารถ switch versions ได้อย่างรวดเร็ว
- ลดปัญหา conflicts ระหว่าง projects

## การทำงาน

mise จัดเก็บ tools ใน `~/.local/share/mise/versions/` และ modify PATH ตาม project config

## ตัวอย่าง

```bash
# Project A ใช้ Node 20
cd project-a
mise use node@20.11.0

# Project B ใช้ Node 18
cd project-b
mise use node@18.19.0
```
