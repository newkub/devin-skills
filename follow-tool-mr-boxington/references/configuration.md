# mbx Configuration

Defaults ใช้ได้โดยไม่ต้องมี config file — เพิ่มเฉพาะค่าที่ต้องการเปลี่ยน Unknown TOML keys ถูก reject (typo = error)

## Sources (first wins)

1. Environment variables `MBX_*`
2. `.mbx.toml` ที่ workspace root — เฉพาะ supported workspace settings
3. `mbx/config.toml` ใน platform config dir:
   - Linux: `~/.config/mbx/config.toml` (`$XDG_CONFIG_HOME`)
   - macOS: `~/Library/Application Support/mbx/config.toml`
   - Windows: `%APPDATA%\mbx\config.toml`

## Common Settings

| Change | Setting |
|---|---|
| เว้น CPU ให้ editor | `scheduler.reserve_cpus = 2` |
| จำกัด action store | `gc.max_size = "20GiB"` (default 5% ของ disk) |
| เก็บ live targets นานขึ้น | `target.max_age = "60d"` (default `30d`) |
| จำกัด managed targets | `target.max_size = "30GiB"` (default 10% ของ disk) |
| savings message แบบ factual | `savings = "plain"` (`quips`/`plain`/`off`) |
| cache detail เพิ่ม | `summary = "full"` (`auto`/`short`/`ci`/`full`/`off`) |
| ย้าย managed targets ไป disk อื่น | `target.root = "/path/to/targets"` (`MBX_TARGET_ROOT`) — same filesystem เท่านั้นถึงจะ rename ได้ |
| ย้าย cache root | `cache_dir = "/var/cache/mbx"` (`MBX_CACHE_DIR`) — ต้อง local storage, NFS ถูก reject บน Linux/macOS |
| แยก shims ออกจาก shared cache (containers) | `shims_dir` (`MBX_SHIMS_DIR`) — dir เฉพาะ mbx shims, ห้ามมี real compilers |

`"none"` ใน `gc.max_size`/`target.max_size`/`target.max_age`/`gc.incremental_max_size`/`gc.incremental_max_age`/`gc.max_total_size` = ปิด limit นั้น

## Scheduler

```toml
[scheduler]
reserve_cpus = 0          # เว้นนอก pool
memory = "85%"            # default 85% physical RAM; "none" = CPU permits อย่างเดียว
pressure = true           # หยุด admission ตอน memory ตึง (Linux PSI / macOS headroom)
priority = "low"          # build ยอมให้ normal-priority work (เหลือ 1/4 pool)
tests = true              # test binaries เข้า pool — เหมาะหลาย agents/test suites
suspend = true            # experimental: cgroup v2 supervision บน Linux
cgroup_root = "/sys/fs/cgroup/my-delegated-builds"  # ต้อง delegated+writable; user/env only
```

Cargo `-j`/`CARGO_BUILD_JOBS` จำกัดส่วนของ pool ที่ build เดียวถือ — pool เอง machine-wide

## Linker

```toml
[linker]
default = "system"

[linker.profiles.dev]
x86_64-unknown-linux-gnu = "mold@2.42.0"
aarch64-unknown-linux-gnu = "wild@0.10.0"
default = "rust-lld"
```

## Remote Cache

ใส่ได้เฉพาะ global config หรือ `MBX_REMOTE_*` env — `.mbx.toml` ใน repo ไม่รับ:

```toml
[remote]
url = "https://cache.example.com"   # หรือ "s3://bucket[/prefix]"
namespace = "acme/backend"          # required เมื่อมี url
mode = "read-write"                 # subject to environment write policy (PRs never publish)
# s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
# s3_region = "auto"
```

Auth:
- Cache server: `MBX_REMOTE_TOKEN` / `MBX_REMOTE_TOKEN_FILE` / `MBX_REMOTE_OIDC_AUDIENCE` (GitHub OIDC ต้อง `id-token: write`)
- S3: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`; region จาก `MBX_REMOTE_S3_REGION` → `AWS_REGION`/`AWS_DEFAULT_REGION`
- IAM: readers ต้อง `s3:GetObject` + `s3:ListBucket` (ไม่มี → miss vs refuse แยกไม่ออก); writers เพิ่ม `s3:PutObject` (create-only)
- `MBX_REMOTE_S3_CONDITIONAL_WRITES=required` — ปฏิเสธ store ที่ไม่รองรับ conditional writes (ใช้กับ prefetch manifest)

## Workspace Settings (`.mbx.toml`)

ยอมรับเฉพาะ workspace-scoped keys (เช่น `summary`, `savings`, `build_script_execution`, `cc`, `share_out_dir`, `share_workspace_root`) — remote/machine paths ห้าม commit

## Useful Env Vars

| Env | Effect |
|---|---|
| `MBX_SCHEDULER=0` | ปิด shared pool |
| `MBX_SCHEDULER_TESTS=1` | schedule test binaries |
| `MBX_SCHEDULER_PRESSURE=0` | ปิด pressure control |
| `MBX_SCHEDULER_PRIORITY=low` | low-priority build |
| `MBX_INCREMENTAL=1` | trade: incremental แทน caching |
| `MBX_TARGET_SEED=0` | ปิด copy dependency units จาก checkout อื่น (Cargo ≥1.100) |
| `MBX_CACHE_LINKS=0` | ปิด native link caching |
| `MBX_BUILD_SCRIPT_EXECUTION=0` | ปิด build-script execution caching |
| `MBX_SUMMARY` | `short`/`full`/`ci`/`off` |
| `MBX_CACHE_EXPORT_GROUP` | receipt group สำหรับ `mbx cache export` (action ตั้งเอง) |
