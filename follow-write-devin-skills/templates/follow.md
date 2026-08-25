# follow-* Template

implement best practices ของ tools/libraries/frameworks

## Execute Pattern

- อ่าน `package.json`, `Cargo.toml` ตรวจสอบ version. ถ้าไม่พบ tool → stop และ report. ถ้า optional → ถามผู้ใช้. ทำ `/learn-from-web`, `/check-reference`, `/follow-best-practice`. ใช้ official docs เป็นแหล่งหลัก. ตรวจ version compatibility
- สร้าง/อัปเดท config ด้วย `/follow-config`. ถ้ามี breaking changes → migration steps. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`. รัน typecheck, lint, tests. ถ้ามี errors → ทำ `/resolve-errors`. ถ้าผ่าน → ทำ `/suggest-next-action`
- Minimal changes เสมอ. ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะ config. ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้
