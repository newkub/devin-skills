# Semgrep Scan & CI Best Practices

## Recommended Patterns

- เริ่มจาก ruleset เฉพาะทาง (`p/security-audit`, `p/owasp-top-ten`, `p/<language>`) — ค่อยขยายเมื่อ signal-to-noise ดีแล้ว
- ใช้ `--baseline` บน legacy codebase — เห็นเฉพาะ findings ใหม่ ไม่จมใน backlog เก่า
- ใช้ `--exclude`/`--include` หรือ `.semgrepignore` ข้าม `tests/`, `*.generated.*`, `vendor/`, `dist/` — ลด noise และเวลา scan
- output `--sarif` สำหรับ GitHub code scanning integration, `--json` สำหรับ custom tooling
- ใช้ `semgrep ci` + `semgrep login` เมื่อ integrate กับ Semgrep AppSec Platform — ได้ diff-aware scan, triage UI, policy management
- diff-aware scanning: scan เฉพาะ code ที่เปลี่ยนใน PR — full scan ทำ scheduled/nightly
- gate CI ด้วย severity threshold — เริ่ม fail เฉพาะ `ERROR` findings ใหม่ แล้วค่อยเข้มขึ้น
- triage ก่อน report: จัดกลุ่มตาม severity/confidence, mark false positives ด้วย `// nosemgrep` พร้อมเหตุผล

## Common Pitfalls

- รัน `p/default` บน codebase ใหญ่ครั้งแรก — findings เป็นพัน ไม่มีใครอ่าน; เริ่มแคบก่อน
- scan `node_modules`/`dist`/generated files — เสียเวลา + noise สูง
- ไม่มี baseline สำหรับ legacy — CI fail ทันทีจาก findings เก่า ทีม ignore ทั้งระบบ
- `// nosemgrep` โดยไม่ใส่เหตุผล — ไม่รู้ว่า intentional หรือขี้เกียจแก้
- ruleset ไม่ pin — findings เปลี่ยนเองเมื่อ registry update; reproducibility หาย
- findings dump ดิบเป็น CI log — ใช้ `--sarif`/`--json` + report formatter แทน

## Do / Don't

| Do | Don't |
|----|-------|
| baseline ก่อนเปิด CI gate | block merge ด้วย findings เก่าทั้งหมด |
| pin ruleset/commit hash ใน CI | ดึง `latest` ruleset ทุก run |
| ใช้ `--sarif` สำหรับ GitHub code scanning | parse text output ด้วย regex |
| ใส่เหตุผลข้าง `// nosemgrep` | suppress โดยไม่มี context |
| scan เฉพาะ diff ใน PR, full scan เป็น schedule | full scan ทุก commit บน monorepo ใหญ่ |

## Config Guidance

- local dev: `semgrep scan --config=p/security-audit --config=.semgrep src/` — รวม registry + custom rules
- CI: pin config ผ่าน `--config` ที่ชี้ไปยัง fileใน repo หรือ ruleset ที่ lock ไว้
- ใช้ `--metrics=off` ใน CI ถ้าไม่ต้องการส่ง telemetry
- `--max-target-bytes` ข้ามไฟล์ใหญ่ผิดปกติ (bundled output, minified files)
- `--jobs` ปรับ parallelism ตาม CI runner cores — default auto-detect มักพอ

## Performance & CI

- scan เวลาส่วนใหญ่ไปกับไฟล์จำนวนมาก — `.semgrepignore` เป็น optimization แรกเสมอ
- cache semgrep binary/semgrep-core ใน CI image หรือ setup action — อย่า install ใหม่ทุก run
- แยก jobs: fast pattern rules ใน PR check, taint/dataflow rules ใน nightly — ประหยัดเวลา PR
- findings ที่ survived triage → ส่ง `/deep-review` หรือ `/fix` สำหรับ remediation — semgrep เป็น detection tool ไม่ใช่ fixer
- track findings trend — เพิ่มขึ้นเรื่อยๆ = rules หรือ codebase ต้องทบทวน
