# Shared `## Fix` Boilerplate

Canonical boilerplate สำหรับ section `## Fix` ใน `review-*`/`check-*` skills — reference ไฟล์นี้แทนการคัดลอก (SSOT)

## Disclaimer Line

ใส่ blockquote นี้ใต้ heading `## Fix`:

```
> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`
```

## Standard Fix Steps

ถ้า domain ไม่มี fix workflow เฉพาะ ให้ใช้ skeleton นี้ — `(<domain>)` คือชื่อ domain ของ skill:

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (`<domain>`)
2. `<domain-specific fix route>` — subskill `SKILL.md` หรือ fix steps ของ domain นั้น
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (`<domain>`)

## Usage In SKILL.md

- Disclaimer: เขียน blockquote เต็มหรือ reference — `> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings`
- Steps: เก็บเฉพาะ step ที่ domain-specific ไว้ใน skill — generic steps (severity order, preserve behavior, verify, report) อยู่ที่นี่
- subskills ใช้ `../../shared/review-fix.md`
