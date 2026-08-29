---
name: run-checks
description: พบ runtime และ build issues ก่อน report
---

# Run Checks

รัน verification commands เพื่อตรวจสอบ workspace health

## Goal

พบ runtime และ build issues ก่อน report

## Checks

1. ทำ `/run-verify` เพื่อรัน lint, typecheck, scan หรือ full verify
2. ถ้ามี scripts ให้รัน `bun run verify` หรือ `bun run ci` ตามลำดับ
3. ถ้าเป็น Rust ให้รัน `cargo clippy && cargo check && cargo test`
4. บันทึก errors และ failures พร้อม evidence

