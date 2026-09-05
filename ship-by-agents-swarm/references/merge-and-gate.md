# Merge And Gate

## Collect Results

1. รวบรวม output ทุก lane: status (pass/fail/skip), files changed, findings
2. ตรวจ file overlap — ถ้า 2 lanes เขียนไฟล์เดียวกัน → conflict ต้อง resolve ก่อน merge
3. lane ที่ fail → re-run เฉพาะ lane นั้น ไม่ restart swarm

## Conflict Resolution

- ไฟล์ชนกัน → apply lane ตาม priority ใน plan (fix > docs > verify)
- merge ด้วย manual edit หรือ `git` — ห้าม overwrite ทับงาน lane อื่น
- ถ้า conflict ซับซ้อน → `/ask-me` หรือ fallback sequential

## Ship Gate

หลังทุก lane ผ่านและ merge เรียบร้อย ต้องผ่าน gates เดียวกับ `/ship`:

1. `/run-verify` + `/deep-verify` + `/run-check` ผ่านครบ
2. commit ตาม project conventions
3. สร้าง PR + review ตาม `/ship` workflow
4. user confirmation ก่อน merge และก่อน release/deploy
5. deploy และ post-deploy checks ตาม `/ship`

ห้ามลด gate เพราะ swarm เร็ว — parallel คือความเร็ว ไม่ใช่การข้ามขั้นตอน

## Failure Fallback

- swarm fail ซ้ำ 2 ครั้ง → fallback ไป `/ship` sequential
- partial success → ship เฉพาะ lanes ที่ผ่านได้เฉพาะเมื่อ lanes นั้น independent จากที่ fail จริง
- ทุก fallback ต้อง report สาเหตุและ lanes ที่ค้าง
