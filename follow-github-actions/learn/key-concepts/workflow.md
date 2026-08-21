# Workflow

## ความหมาย

Workflow คือไฟล์ YAML ที่กำหนด automation process ทั้งหมด อยู่ใน folder `.github/workflows/`

## โครงสร้าง

```yaml
name: Workflow Name
on:
  # triggers
jobs:
  # jobs
```

## ส่วนประกอบ

- **name**: ชื่อ workflow
- **on**: triggers ที่เริ่ม workflow
- **jobs**: งานที่ต้องทำ
- **env**: environment variables ทั่วทั้ง workflow
