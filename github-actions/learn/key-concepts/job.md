# Job

## ความหมาย

Job คือกลุ่มของ steps ที่รันบน runner เดียวกัน สามารถกำหนด dependencies ระหว่าง jobs

## โครงสร้าง

```yaml
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Step Name
        run: command
```

## คุณสมบัติ

- **runs-on**: runner type (ubuntu-latest, windows-latest, macos-latest)
- **needs**: dependencies ระหว่าง jobs
- **steps**: รายการ steps ที่ต้องทำ
- **strategy**: matrix strategy สำหรับ test หลาย versions
