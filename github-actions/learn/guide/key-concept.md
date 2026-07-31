# Key Concepts

## แนวคิดหลักและหลักการทำงาน

### Workflow

ไฟล์ YAML ที่กำหนด automation process อยู่ใน `.github/workflows/`

### Job

กลุ่มของ steps ที่รันบน runner เดียวกัน สามารถกำหนด dependencies ระหว่าง jobs

### Step

งานเดียวที่รัน command หรือ action แต่ละ step รันตามลำดับ

### Action

Reusable unit ของ code สามารถใช้ซ้ำได้ มีทั้ง official actions และ community actions

### Runner

Server ที่รัน jobs มีให้เลือก: ubuntu-latest, windows-latest, macos-latest

### Event

Trigger ที่เริ่ม workflow เช่น: push, pull_request, schedule, manual

### Secret

ค่าที่ sensitive จัดเก็บใน repository settings ใช้ใน workflow ด้วย `${{ secrets.SECRET_NAME }}`

### Environment

ชุดของ environment variables สำหรับ deployment stages (dev, staging, production)
