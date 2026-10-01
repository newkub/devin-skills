# moonrepo — CI Integration และ Git Hooks

## Recommended Patterns

### `moon ci` vs `moon run`

- `moon ci` = CI mode — เลือกเฉพาะ affected targets ที่ตั้ง `runInCI` ไว้, print summary แบบ structured
- `moon run` = local/dev mode — respect cache เต็มรูปแบบ แต่ไม่ filter ตาม base branch
- ห้ามใช้ `moon run` ใน CI pipeline หลัก — จะรัน task ที่ไม่จำเป็นและเสียเวลา
- ใช้ `moon ci :build :test :lint` เพื่อบังคับ target set แทน default run-everything

### Affected Detection

- affected = projects ที่ไฟล์เปลี่ยนตั้งแต่ base — ต้องมี git history เพียงพอ
- CI checkout ต้อง `fetch-depth: 0` (หรืออย่างน้อยเทียบได้กับ merge-base) — shallow clone ทำให้ moon เห็นทุก project เป็น affected หรือไม่เห็นเลย
- PR pipelines เทียบ base กับ `vcs.defaultBranch` — ตั้งใน `.moon/workspace.yml` ให้ตรง branch จริง (`main`/`dev`)
- debug affected ด้วย `moon query affected --base <ref>` ก่อน push

### Sharding และ Reports

- repo ใหญ่ shard ด้วย `moon ci --shard <i>/<total>` หรือ `--job <i>`/`--jobTotal <i>` บน matrix jobs
- เก็บ reports: `moon ci` เขียน summary ลง `.moon/cache` — upload เป็น artifact เมื่อต้อง audit ว่า tasks ไหนรันจริง
- combine shards ที่ end-of-pipeline step เพื่อรวม pass/fail

### Git Hooks ผ่าน `vcs.hooks`

- repo ที่ใช้ moon → ใช้ `vcs.hooks` ใน `.moon/workspace.yml` เป็น default — ไม่ต้อง hook manager ภายนอก
- hook ต้องเร็ว: ใช้ `--affected` + `--status=staged` เสมอ — moon รู้ graph + cache อยู่แล้ว
- generated hooks อยู่ใน `.moon/hooks` — `sync: true` ให้ moon ตั้ง `core.hooksPath` อัตโนมัติ
- ถ้าทีมบางคนอยาก opt-out → ลบ `sync` แล้วให้รัน `moon sync hooks` เอง แต่เขียนไว้ใน docs

## Do / Don't

| Do | Don't |
|---|---|
| `fetch-depth: 0` ใน CI checkout | shallow clone แล้ว expect affected detection ทำงาน |
| ตั้ง `runInCI: false` ให้ `dev`/`serve`/watch tasks | ปล่อยให้ persistent task ถูก pick ใน CI แล้ว hang |
| ใช้ `vcs.hooks` สำหรับ repo นี้ | เพิ่ม husky/hk ซ้อนถ้า moon hooks เพียงพอ |
| verify hook path ด้วย `git config core.hooksPath` | assume hooks ติดตั้งเพราะ config มีอยู่ |
| run `moon ci` บน test branch ก่อน merge config ใหญ่ | แก้ CI config แล้ว merge ตรงเข้า main |

## Common Pitfalls

- affected detection ว่างเปล่า → defaultBranch ผิด หรือ base ref ไม่มีใน CI clone
- hooks ไม่ทำงานหลัง `git clone` ใหม่ → ลืม `sync: true` หรือไม่มีใครรัน moon command เลย (hooks sync ตอน task รัน)
- CI ช้ากว่า local → remote cache ไม่ได้ตั้ง หรือ runner cache dir ไม่ persist ข้าม job
- `runInCI` ตั้งผิด type → unknown keys อาจถูกเงียบ — validate ด้วย `moon task` ดู merged output
- Windows contributors: hook scripts เป็น shell — test ด้วย `moon sync hooks` แล้วลอง commit จริงบน Windows

## Performance Notes

- `moon ci` + remote cache ลด CI time ได้เยอะ — worth ตั้งแต่ repo >~10 projects
- matrix sharding คุ้มเมื่อ test suite >10 นาที — ต่ำกว่านั้น overhead spawn แพงกว่า
- hooks ที่ช้าทำให้ dev หนีไป `--no-verify` — เก็บ pre-commit <5s ด้วย `--status=staged` + cache
