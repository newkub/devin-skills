# Bruno Best Practices

แนวทางจัดการ Bruno collections (`.bru` / OpenCollection) ให้ Git-native, ปลอดภัย และรันใน CI ได้เสถียร

## Recommended Patterns

### Collection Hygiene

- Commit collection เข้า repo เดียวกับ API code — ทุก API change จะเห็น request/test diff ใน PR เดียวกัน
- แยก folder ตาม domain/resource ไม่ใช่ตาม environment — environments อยู่ใน `environments/` แยกอยู่แล้ว
- เลือก format เดียวต่อ collection: `opencollection` (YAML, default ใหม่) หรือ `bru` (classic) — ปนกันทำ diff/review ยาก
- เขียน tests (`assert`/`test` blocks) ใน request file เลย — collection ที่ไม่มี assertions ใช้เป็น smoke test ใน CI ไม่ได้
- ใช้ `bru import openapi` เป็น starting point แล้ว curate ต่อ — อย่า import ซ้ำทับ collection ที่แก้มือแล้วเพราะจะ overwrite

### Environments And Secrets

- ใช้ `environments/*.bru` เก็บ non-secret config เท่านั้น (baseUrl, timeouts, public ids)
- Secrets (API keys, tokens) ใช้ `vars:secret` หรือ dotenv `.env` ที่ gitignore — Bruno mask secret vars ใน UI/logs ให้
- ใน CI: inject ผ่าน `--env-var KEY=$SECRET` หรือ `--secrets-env-file` ดึงจาก Vault/AWS/Azure/GCP — ห้าม commit ไฟล์ secrets
- ตั้ง env name ให้สื่อ เช่น `staging`, `prod-readonly` — ลดโอกาสยิงผิด env

### Test Execution

- ใช้ `--bail` ใน CI เพื่อ fail-fast เมื่อ request แรกๆ พัง — ประหยัดเวลาและอ่าน log ง่ายกว่า fail ทีละตัว
- ใช้ `--tags`/`--exclude-tags` แยก smoke vs full regression — smoke รันทุก PR, full รัน nightly
- ใช้ `--tests-only` เมื่อ collection ปน exploratory requests ที่ไม่มี assertions
- Data-driven: `--csv-file-path`/`--json-file-path` สำหรับ iterations — เก็บ fixture files ใน `data/` ข้าง collection
- ใช้ `--iteration-count` + `--delay` เมื่อต้องการ soak/rate-limit — อย่า spam API โดยไม่จำเป็น

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| Secrets ใน `.bru` env file | credential leak ใน git history | ใช้ secret vars / external secrets / env injection |
| `--sandbox developer` เปิดทิ้ง | scripts เข้าถึง Node APIs/fs เต็ม | default `safe` sandbox; เปลี่ยนเฉพาะเมื่อจำเป็นจริง |
| `--parallel` กับ rate-limited API | flaky CI, 429 responses | รัน sequential หรือจำกัด concurrency + `--delay` |
| Reporter artifacts มี secrets | tokens หลุดใน junit/html | ใช้ `--reporter-skip-headers`/`--reporter-skip-body` flags |
| Mixed `bru` + `opencollection` files | CLI confuse, review ยาก | convert ให้ format เดียวด้วย export/import |
| ชี้ `--env prod` โดยไม่เช็ค | mutating requests ไป production | gate prod runs ด้วย manual approval / separate workflow |
| Collection นอก repo | tests ไม่ตาม code version | keep collection ใน repo เดียวกันเสมอ |

## Do / Don't

| Do | Don't |
|---|---|
| `bru run --env staging --bail --reporter-junit results.xml` ใน CI | รัน collection โดยไม่มี reporter — debug ยากเมื่อ fail |
| tag requests (`@smoke`, `@critical`) | รันทั้ง collection เมื่อต้องการแค่ subset ทุกครั้ง |
| pin `bru-version` ใน CI action | ใช้ latest CLI ที่ behavior เปลี่ยนระหว่าง runs |
| gate production env ด้วย approval | ให้ PR workflow ยิง prod env ได้เลย |
| เก็บ expected fixtures ใน repo | hardcode response values ใน test scripts |

## Performance And CI Notes

- `usebruno/bruno-cli-action` เป็น composite — เขียน `run --env staging` ไม่ต้องมี `bru` นำหน้า และ inject `--reporter-junit` ให้อัตโนมัติ
- Action expose outputs `exit-code`, `passed`, `failed` — feed ต่อ PR comment / status checks ได้โดยไม่ parse XML
- Cache `bru` binary ผ่าน `bru-version` input แทน `npm i -g` ทุก run
- `--parallel` ลดเวลา wall-clock แต่เพิ่ม flakiness กับ rate limits — ใช้เมื่อ API รองรับ
- Publish junit report ผ่าน test-reporter actions เพื่อเห็น failures บน PR โดยไม่เปิด logs
- Keep CI collections lean — full collection ที่ช้าให้รันเป็น scheduled workflow แยกจาก PR gate

## Config Guidance

`bruno.json` ที่แนะนำ:

```json
{
  "version": "1",
  "name": "my-api",
  "type": "collection",
  "ignore": ["node_modules", ".git"],
  "size": 10
}
```

- ตั้ง `ignore` ให้ครอบคลุม generated/temp dirs — Bruno จะไม่ parse ไฟล์ไม่เกี่ยว
- Structure ที่แนะนำ:

```text
collection/
├── bruno.json
├── environments/
│   ├── local.bru
│   ├── staging.bru
│   └── prod.bru          # secrets เป็น vars:secret refs เท่านั้น
├── data/                  # csv/json fixtures
├── smoke/                 # tagged requests
└── <domain>/
    └── *.bru
```

- Document env setup ใน collection `README` — contributor จะได้รู้ว่าต้อง set secrets อะไรบ้าง
