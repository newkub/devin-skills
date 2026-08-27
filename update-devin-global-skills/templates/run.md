# run-* Template

execute commands พร้อม prerequisites check, error handling, result reporting

## Execute Pattern

- ตรวจสอบ target, dependencies, tools ก่อนรัน. ถ้าขาด → stop และ report. ทำ `/check-should-update` ถ้า target อาจเป็น stale
- รัน command พร้อม timeout: non-blocking สำหรับ long-running (dev server, watch), blocking สำหรับ short tasks (build, test, lint). จับ output และ error แยกกัน. ถ้า errors → ทำ `/resolve-errors`. dependency issue → ทำ `/run-install` แล้ว retry max 1. config issue → ทำ `/review-delivery`. ซ้ำ 3 ครั้ง → stop
- รายงานสั้นกระชับ: success/fail, duration, key metrics. ถ้าสำเร็จ → ทำ `/suggest-next-action`. Safety: อย่ารัน destructive commands โดยไม่ confirm. แจ้ง side effects ก่อนรัน. ใช้ `SafeToAutoRun` เฉพาะ commands ปลอดภัย
