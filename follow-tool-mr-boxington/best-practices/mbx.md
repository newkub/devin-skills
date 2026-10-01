# mbx (Mr Boxington) — Shared Cargo Build Cache

## Recommended Patterns

### Installation และ Wrapping

- prefer `mise use -g --tool-option mr_boxington=true rust mr-boxington` — ได้ Rust + mbx + Cargo wrapping ใน step เดียว ไม่ต้อง `mbx setup`
- ถ้า toolchain ผ่าน mise อยู่แล้ว → เพิ่ม `mr_boxington = true` เข้า existing `rust` tool entry — อย่าเปลี่ยน version pin ที่มี
- standalone setup: `mbx setup` → ติดตั้ง Cargo shim; verify ด้วย `mbx setup --status` และ `mbx doctor`
- verify ว่า `cargo` resolve ไปที่ wrapper: `command -v cargo` (Unix) / `where.exe cargo` (Windows) — install binary เฉยๆ ไม่พิสูจน์ว่า builds ผ่าน mbx

### Verify Cache Hits จริง

- build แรก = fill store — ห้ามสรุปว่า cache พังจาก run แรกที่ misses ทั้งหมด
- ทดสอบ reuse ด้วย fresh `target/` หรือ worktree ใหม่ command เดิม — rebuild ที่ target up-to-date ไม่นับ hit เพราะ Cargo skip เอง
- ไม่มี hits → `mbx explain --last` ดูเหตุผลต่อ action ก่อนเปลี่ยน config; `mbx tui` ดู live, `mbx stats` ดู savings รวม
- อ่าน summary หลัง build: `hits` restored, `misses` compile ใหม่, `bypassed` ไม่เข้า shared cache — `bypassed` สูงผิดปกติ = เช็ค explain

### Parallel Builds / Multi-Agent

- scheduler เปิด default — pool = `scheduler.cpus` − `scheduler.reserve_cpus`, memory cap ~85% RAM
- รัน Cargo commands หลายตัวพร้อมกันต้องแยก `CARGO_TARGET_DIR` ต่อ command — mbx dedupe in-flight work ให้เอง แต่ Cargo lock serialize ถ้า target เดียวกัน
- agents/test binaries จำนวนมาก → `scheduler.tests = true` หรือ `MBX_SCHEDULER_TESTS=1` เพื่อให้ test binaries เข้า pool เดียวกัน
- editor/background builds ตั้ง `scheduler.priority = "low"` ให้ foreground builds ได้ CPU ก่อน

### Config Precedence และ Scope

- precedence: `MBX_*` env → `.mbx.toml` (workspace root) → `mbx/config.toml` (platform dir)
- `.mbx.toml` ใน repo เก็บเฉพาะ workspace settings — ห้ามใส่ `[remote]` url/credentials/machine paths (reject อยู่แล้ว)
- unknown TOML keys = error ทันที — typo fail fast ดีแล้ว อย่า suppress
- `[remote]` ใส่ได้เฉพาะ global config หรือ `MBX_REMOTE_*` env

## Do / Don't

| Do | Don't |
|---|---|
| เลือก compiler cache ตัวเดียว (mbx หรือ sccache) | ซ้อน `RUSTC_WRAPPER` ชี้ sccache + expect mbx cache เองด้วย — mbx defer ให้ตัวนั้น |
| preview `mbx gc --dry-run` / `mbx adopt --dry-run` ก่อน | run `mbx gc` / `adopt` ตรงๆ บน directory ใหญ่ |
| keep cache/target บน local disk | ชี้ `MBX_CACHE_DIR` ไป network drive — NFS ถูก reject, cache ต้อง local |
| scope remote write เฉพาะ trusted branches | ให้ PR jobs publish เข้า remote cache — env enforce read-only อยู่แล้วแต่ตั้ง role ให้ชัด |
| `mbx doctor` + build จริงก่อนสรุป setup สำเร็จ | ดู `mbx --version` อย่างเดียว |

## Common Pitfalls

- `mbx doctor` เตือนว่า shim หายแม้ mise-native wrapping ทำงานปกติ → verify ด้วย build จริง อย่าเพิ่ง `mbx setup` ซ้ำ
- Windows: `target` symlink ต้อง Developer Mode หรือ privilege — สร้างไม่ได้ Cargo fallback เป็น target ปกติ (cache ยังทำงาน)
- explicit `CARGO_TARGET_DIR`/`--target-dir`/`build.target-dir` → mbx ไม่ manage target นั้น — ตั้งใจหรือเปล่าเช็คก่อน
- incremental ไม่ share — mbx force `CARGO_INCREMENTAL=0`; อย่าพยายาม cache incremental artifacts
- ลบ cache dir ขณะ build กำลังรัน → build พัง; cache rebuild ได้เสมอ แต่ interrupt ไม่ได้

## Performance Notes

- reflinks (APFS/btrfs/XFS/ReFS/Dev Drive) เร็วกว่า byte copy มาก — บน Windows ใช้ Dev Drive ถ้าทำได้
- collection รันอัตโนมัติ ≤ชม.ละครั้งหลัง build — ปรับ `target.max_age` (default 30d), `target.max_size` (default 10% disk) ตาม disk
- build-script execution ถูก cache ตาม `rerun-if-*` — ปิดด้วย `build_script_execution = false` ถ้า script มี side effects นอกเหนือ output
- cache hits ไม่ต้องรอ scheduler permit — reuse path เร็วกว่า compile path เสมอ

## CI Notes

- GitHub Actions: `jdx/mr-boxington-action` ก่อน build — push ขึ้น default branch publish, PRs restore-only
- self-hosted remote: `[remote] url` + `namespace` + `mode = "read-write"` + token/OIDC — PR contexts ไม่ publish แม้ config เป็น read-write
- ทางเลือก portable: `MBX_CACHE_EXPORT_GROUP` + `mbx cache export`/`import` ผ่าน artifact tar
