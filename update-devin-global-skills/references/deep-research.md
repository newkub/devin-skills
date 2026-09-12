# Deep Research

## Goal

มีข้อมูลล่าสุดก่อนแก้ไข

## Steps

1. ทำ `/deep-research` โดยระบุ topic หรือ skill ที่จะอัปเดต
2. ทำ `/check-release-notes` เพื่อดึง latest version, release date, breaking changes จาก GitHub Releases หรือ official changelog/blog — เทียบกับ version ที่ skill อ้างถึง
3. ทำ `/check-all-routes` บน official docs site เพื่อเทียบ `references/routes.md` กับ routes จริง — ถ้ามี undocumented routes → update routes.md
4. ทำ `/learn-web` จาก official docs, changelog, repository เป็นแหล่งหลัก
5. บันทึก: latest version, breaking changes, new commands, deprecations, environment variables, URLs
6. หาตัวอย่าง command, config, output จริง — ไม่เดา API หรือ command
7. ถ้า topic ไม่ต้อง research → ข้ามขั้นตอนนี้
