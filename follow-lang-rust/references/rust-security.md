# Rust Security Reference

แนวทางการตั้งค่า security สำหรับ production ใน Rust projects

ตั้งค่า security สำหรับ production

- ใช้ `cargo-audit` สำหรับ vulnerability scanning
- ใช้ `cargo-deny` สำหรับ license และ advisory checks
- ตั้งค่า `forbid unsafe_code` ใน workspace
- ตรวจสอบ dependencies ก่อนเพิ่มใหม่
- ใช้ `RUSTSEC` advisory database
- หลีกเลี่ยง `unsafe` blocks ถ้าไม่จำเป็น
