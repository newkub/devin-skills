# Refactor Principles

หลักการ refactor ฉบับเต็ม — SKILL.md ใช้เป็น checklist สั้น; ไฟล์นี้คือ detail ของแต่ละ rule

## 1. Preserve Behavior (Two Hats)

- refactor = เปลี่ยน structure โดยไม่เปลี่ยน observable behavior — ห้าม mix feature change/bug fix ใน commit เดียวกับ refactor
- ถ้าเจอ bug ระหว่าง refactor → commit fix แยกก่อน แล้วค่อย refactor ต่อ
- public API และ behavior ที่ consumer เห็นต้องเหมือนเดิม — ตรวจด้วย `/check-backward-compatibility` เมื่อแตะ exported API

## 2. Safety Net First

- ห้าม refactor code ที่ไม่มี test coverage โดยไม่มี safety net — ถ้าไม่มี tests → ทำ `/update-tests` เขียน characterization tests ล็อก behavior ปัจจุบันก่อน
- tests ต้องเขียวก่อน refactor และเขียวหลัง refactor — test ที่ pass ก่อนแก้ต้อง pass หลังแก้เหมือนเดิม
- ถ้าสงสัยว่า test suite จับ regression ได้จริง → `/deep-test mutation` วัดความแข็งแรงของ tests ก่อนเชื่อถือ

## 3. Small Steps

- ทำทีละ refactoring เดียว (extract, rename, move) แล้ว verify green ก่อน step ถัดไป — ห้ามรวมหลาย transformation ใน step เดียว
- commit checkpoint ด้วย `/git-commit` หลังทุก batch ที่เขียว — rollback ได้ทุกจุด
- mechanical refactor ขนาดใหญ่ (rename/move/pattern change หลายไฟล์) → ใช้ `/edit-with-astgrep` (dry-run + confirm ก่อนเขียนทับเสมอ); migration ทั้ง codebase ด้วย rule file → `/migration-by-astgrep`; syntax ลึก → `/use-astgrep`

## 4. Context Aware

- ไม่เดา scope ถ้าไม่ชัด — ถ้าไม่ชัดให้ทำ `/ask-me`
- ไม่ dispatch หลาย sub-skill พร้อมกัน — ทำทีละตัวตาม priority

## 5. Minimal Change

- ทำ `/dont-over-engineer`
- ทำ `/use-lib-effective` เมื่อเจอ code ที่อาจ reinvent dep ที่มีอยู่ — แทนด้วย lib ใน manifest หรือ catalog แทนการเขียนเอง
- ทำ `/follow-reusable` ก่อนเขียน implementation ใหม่หรือเมื่อเจอ duplicates — reuse > extend > extract > create ตาม rule of three
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น; รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- dead code ที่เจอระหว่าง refactor → ลบด้วย `/check-repo-hygiene unused` ยืนยันก่อน
- เลือก technique จาก `references/code-smells.md` — smell → technique ตรง root cause
- แก้ที่ root cause เสมอ — shotgun surgery (fix เดียวต้องแก้หลายจุด) → รวมไป canonical source เดียว
- ห้าม perf tuning ใน refactor pass — optimization เปลี่ยน behavior/timing เสี่ยง regression; เจอ perf issue → note ไว้แยก commit (`/review-performance`)

## 6. SRP And Consistency

- หนึ่ง function ทำหนึ่ง operation; หนึ่ง file ครอบคลุมหนึ่ง concern
- ไฟล์ไม่เกิน 250 บรรทัด ยกเว้น barrel/index — ตรวจด้วย `/check-long-files`
- หนึ่ง fact มี canonical source เดียว — duplicate constants/config/logic → extract ตาม `/follow-single-of-source`
- รักษา naming, patterns, structure สอดคล้องกันทั้ง scope

## 7. Safety

- การย้าย/ลบ/rename ต้อง `/update-references`
- destructive actions ต้อง dry run + user confirmation
- ไม่ force push

## 8. Verification

- ทุก refactor ต้องผ่าน `/run-verify`
- ไม่มี broken references
