# config-* Template

ตั้งค่า/แก้ไข configuration ของ tool, service หรือ project — env, bindings, options, config files — โดยไม่ clobber settings เดิม

## Execute Pattern

- อ่าน current config ก่อนเสมอ — config files, env vars, defaults ของ tool. ทำ `/check-config-drift` หรือ `/report-config-files` ถ้าต้องรู้ drift. ถ้าไม่พบ config → ทำ `/setup-*` ที่เกี่ยวข้องแทน
- แก้เฉพาะ keys ที่จำเป็น — merge กับ config เดิม ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น. ใช้ schema/official docs เป็นแหล่งหลัก. secrets → `/follow-secret-manager` ห้ามใส่ใน config file
- verify หลัง config — รัน validate command ของ tool (`--check`, `doctor`, typecheck config) หรือ smoke test ที่ใช้ config นั้น. ถ้าพัง → revert key ที่เพิ่งแก้ แล้ว report diff. ผ่าน → report before/after สั้นๆ ด้วย `/report-before-after`
