# Step: Prepare

> Goal: เตรียมข้อมูลก่อนเขียน README

## Execute

1. ทำ `/check-should-update` เพื่อตรวจ git changes ก่อน — ถ้าไม่มี changes → skip และ report
2. `/run-release` ถ้ามี tag release (gen CHANGELOG.md อัตโนมัติ)
3. อ่าน `package.json` ตรวจสอบ project type: `cli-sdk` หรือ `app`
4. ตรวจว่ามี `CHANGELOG.md` หรือไม่ — ใช้กำหนด status (`in development` หรือ `active`)
5. ตรวจว่ามี `CONTRIBUTING.md` หรือไม่ — ใช้กำหนดว่ามี `## Contributing` section
6. ตรวจว่ามี `LICENSE.md` หรือไม่ — ใช้กำหนดว่ามี `## License` section
7. ถ้าอ่าน `package.json` ไม่ได้ → stop และ report

## Output

- project type (`cli-sdk` หรือ `app`)
- status (`in development` หรือ `active`)
- has `CONTRIBUTING.md` (boolean)
- has `LICENSE.md` (boolean)
- has `CHANGELOG.md` (boolean)
