# Step: Setup License

> Goal: ตั้งค่า LICENSE.md และ package manifest license field สำหรับ root

## Execute

1. ตรวจสอบไฟล์ `LICENSE.md` ที่มีอยู่และระบุประเภท license ปัจจุบัน
2. เลือก license ตามประเภทโปรเจกต์ตาม Rule `License Selection` — ตรวจความเหมาะสมกับ business model และ dependencies
3. ใช้ template มาตรฐานตามประเภท license ตาม Rule `License Templates And Manifest` — อัปเดตชื่อผู้ถือลิขสิทธิ์ ตรวจความถูกต้อง บันทึก `LICENSE.md`
4. อัปเดต `license` field ใน `package.json` หรือ `Cargo.toml` ให้ตรงกับ `LICENSE.md` โดยใช้ SPDX identifier ที่ถูกต้อง
5. ถ้า workspace ไม่มี `LICENSE.md` → ใช้ของ root (อย่าสร้างซ้ำใน workspace)

## Rules

- ถ้าไม่ต้องการสร้าง `LICENSE.md` → ไม่มี `## License` section ใน README
- ใช้ SPDX identifier ที่ถูกต้องเสมอ
- ไม่ระบุปีใน copyright
