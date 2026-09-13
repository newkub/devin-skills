# setup-* Template

ติดตั้งและตั้งค่า tools, services, infrastructure ให้พร้อมใช้งาน — first-time configuration ไม่ใช่ ongoing maintenance

## Execute Pattern

- ตรวจสอบ prerequisites และ current state ก่อน — ถ้า setup ไปแล้ว (idempotent check) → skip หรือ verify เท่านั้น. ตรวจ version, config files, credentials ที่ต้องมี. ถ้าขาด secret/env → stop และแจ้ง user
- ติดตั้ง/ตั้งค่าตาม official docs เป็นแหล่งหลัก — ทำ `/learn` (web) ถ้าไม่แน่ใจ. เขียน config ขั้นต่ำที่จำเป็นก่อน แล้วค่อยเพิ่ม options. เก็บ secrets ผ่าน `/follow-secret-manager` ห้าม commit
- verify หลัง setup: รัน smoke check ที่ tool นั้นรองรับ (เช่น `--version`, `doctor`, `status`, health endpoint) แล้ว report ผล. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report. สำเร็จ → `/suggest-next-action`
