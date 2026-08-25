# Dependencies And References

ทุก skill ที่มี dependencies ต้องมี `references/` เสมอ (บังคับ ห้ามข้าม)

## Rules

- ทุก skill ที่มี dependencies (จำเป็นหรือ optional) ต้องมี `references/` เสมอ. ทุก dependency ต้องมี reference file ของตัวเองใน `references/` ที่เขียนจริงโดย `/learn-from-web` (บังคับ ห้ามข้าม ห้ามมีแค่ placeholder)
- ทุกการติดตั้ง dependencies ต้องทำ `/learn-from-web` จาก official docs เสมอ ก่อน install และต้องเขียน references จริง. ยืนยัน: install command ล่าสุด, version ที่ stable (ตีพิมพ์ ≥7 วัน), peer dependencies, และ compatibility กับ ecosystem ปัจจุบัน
- หลีกเลี่ยง floating ranges (`latest`, `*`, unbounded `>=`) ที่ auto-resolve เป็น brand-new releases. บันทึก version ที่ติดตั้งจริง. ถ้ามี breaking changes → ระบุ migration steps. ถ้า optional → ถามผู้ใช้ก่อน install
- ถ้า `/learn-from-web` ถูกเรียกเพื่อ dependency แต่ไม่เขียน reference file จริง → ถือว่า task ล้มเหลว ให้ stop และ report
