---
name: follow-tool-mr-boxington
description: ตั้งค่าและใช้งาน mbx (mr boxington) — shared cache สำหรับ Cargo builds ข้าม worktrees และ CI
argument-hint: "[scope]"
related:
  - follow-tool-mise
  - follow-tool-cargo
  - follow-lang-rust
  - follow-tool-github-actions
  - resolve-errors
  - optimize-build
  - use-git-worktrees
  - setup-cicd
  - cleanup-artifact
  - follow-tool-nextest
---

## Goal

ตั้งค่าและใช้งาน mbx (Mr Boxington) เป็น shared compiler cache สำหรับ Cargo builds — reuse compilations ข้าม projects, worktrees และ CI พร้อม managed `target/` และ machine-wide scheduler

## Scope

ใช้สำหรับ Rust project ที่ต้องการ reuse build artifacts ข้าม checkouts/worktrees/CI และ cleanup `target/` อัตโนมัติ

- Boundary: ถ้าต้องการ cache compiler อื่นนอกเหนือ Rust/C/C++ หรือ distributed compilation → ใช้ `sccache`; mbx defer ให้ `RUSTC_WRAPPER` ที่ชี้ไป cache อื่นอยู่แล้ว
- Latest: `mbx@1.18.0` (verified 2026-09-26, GitHub `jdx/mr-boxington` releases) — crate name `mbx`, mise tool name `mr-boxington`
- References: [cli](references/cli.md) 
## Execute

### 1. Install mbx

> Goal: มี `mbx` binary พร้อมใช้กับ Rust toolchain ที่มีอยู่

1. ตรวจว่ามี Rust toolchain ก่อน (`cargo --version`) — mbx wrap Cargo/rustc ที่ active อยู่ ไม่ติดตั้ง Rust เอง (ยกเว้นผ่าน mise tool `rust`)
2. แนะนำผ่าน mise (ต้อง mise ≥2026.9.2): `mise use --global --tool-option mr_boxington=true rust mr-boxington` — ได้ทั้ง Rust + mbx + Cargo wrapping โดยไม่ต้อง `mbx setup`; เอา `--global` ออกถ้าต้องการเฉพาะ project
3. mise เก่า (2026.8.16–2026.9.1): `mise use --global --postinstall "mbx setup --yes" mr-boxington`
4. ทางเลือก: `cargo install mbx --locked` หรือ release archive จาก GitHub Releases (verify `SHA256SUMS` ก่อน) — platforms: Linux x86-64/ARM64 (gnu+musl), macOS ARM64, Windows x86-64/ARM64
5. ถ้า project ไม่มี mise → ทำ `/follow-tool-mise` ก่อน
6. ยืนยันด้วย `mbx --version` และ `mbx doctor`

### 2. Enable Cargo Wrapping

> Goal: `cargo build`/`cargo test` ธรรมดาไหลผ่าน mbx

1. mise native (≥2026.9.2): tool option `mr_boxington = true` ใน `[tools] rust` entry เปิด wrapping อัตโนมัติ — ใช้ `mise exec -- cargo build`, `mise run` tasks หรือ shell ที่มี mise activation/shims
2. แชร์กับ project โดย commit ใน `mise.toml`:
   ```toml
   [tools]
   rust = { version = "stable", mr_boxington = true }
   mr-boxington = "latest"
   ```
3. Standalone (ไม่ใช้ mise หรือต้องการ rust-analyzer integration): `mbx setup` ติดตั้ง stable Cargo shim — scope: `--global`, `--local`, หรือ `--yes` รับคำแนะนำ; ตรวจด้วย `mbx setup --status`
4. Verify ว่า `cargo` resolve ไปที่ wrapper/shim: `where.exe cargo` (Windows) หรือ `command -v cargo` (Unix)
5. Desktop apps/agents ที่ไม่ inherit PATH → ใช้ `mise exec -- cargo build` หรือ prepend shim dir ที่ `mbx setup` พิมพ์ออกมา
6. ถอน wrapping: เอา `mr_boxington` ออกจาก Rust tool entry + `mise reshim`; ถ้าเคย `mbx setup` → `mbx setup --uninstall` ต่อ scope

### 3. Run Builds

> Goal: build/test/clippy ผ่าน mbx ด้วย args เดิมของ Cargo

1. ใช้ `mbx <cargo-subcommand>` ได้ทุกตัว: `mbx build`, `mbx test --workspace --all-features`, `mbx clippy --workspace --all-targets -- -D warnings`
2. เลือก toolchain แบบ rustup: `mbx +stable check --workspace`
3. Cargo aliases และ installed subcommands ยังใช้ได้ — ใช้ toolchain/features/profile เดียวกันข้าม builds เพื่อ reuse cache เดียวกัน
4. Build แรก fill store — ยังไม่มี hits; mbx สร้าง managed target และทิ้ง `target` symlink ไว้ที่ workspace (existing `target/` ถูกย้ายเข้า managed root พร้อม outputs)

### 4. Verify Cache Reuse

> Goal: ยืนยันว่า compilations ถูก restore จริง

1. รัน `mbx doctor` — ตรวจ Cargo/rustc pair, wrapping และ store health (mise native: doctor อาจเตือน standalone shim หายแม้ wrapping ทำงาน — ให้ verify ด้วย build จริง)
2. อ่าน summary หลัง build: `hits` = restored, `misses` = compile ใหม่แล้ว fill cache, `bypassed` = ไม่ผ่าน shared cache
3. Build เดิมซ้ำที่ `target/` up-to-date ไม่นับเป็น hit — ทดสอบ reuse ด้วย fresh target dir หรือ worktree ใหม่ command เดิม
4. ถ้าไม่มี hits → `mbx explain --last` หาเหตุผลต่อ action; ดู live ด้วย `mbx tui` และสรุปด้วย `mbx stats`

### 5. Manage Targets And Cache

> Goal: `target/` ถูกจัดการและ store ไม่บวม

1. Managed targets เปิด default: `target -> <cache root>/targets/v1/<checkout digest>` — mbx ใส่ link ใน `.git/info/exclude` เอง
2. `mbx adopt` ย้าย `target/` เดิมเข้า management โดยไม่ลบ: `mbx adopt`, `mbx adopt ~/src/project`, `mbx adopt --recursive --dry-run ~/src`
3. Collection รันอัตโนมัติหลัง build (สูงสุดชม.ละครั้ง): ลบ target ของ checkout ที่หาย, unused >`target.max_age` (30d), และ LRU เมื่อเกิน `target.max_size` (10% disk)
4. Inspect store: `mbx cache stats`, `mbx cache projects`, `mbx cache largest`, `mbx cache dir`; preview cleanup ด้วย `mbx gc --dry-run` ก่อน `mbx gc`
5. Explicit `CARGO_TARGET_DIR`/`--target-dir`/`build.target-dir` → mbx ไม่แตะ target นั้น

### 6. Schedule Parallel Builds

> Goal: หลาย builds/agents แชร์ CPU+memory budget เดียวกัน

1. Scheduler เปิด default — pool `scheduler.cpus` (default = logical CPUs) − `scheduler.reserve_cpus`, memory default 85% RAM; cache hits ไม่ต้องรอ permit
2. Parallel Cargo commands ต้องแยก `CARGO_TARGET_DIR` ต่อ command (Cargo lock serialize ถ้า target เดียวกัน) — mbx dedupe work ที่เหมือนกัน in-flight เอง
3. รวม test binaries เข้า pool: `scheduler.tests = true` หรือ `MBX_SCHEDULER_TESTS=1 mbx test --workspace` — เหมาะเมื่อหลาย agents/test suites รันพร้อมกัน
4. Priority ต่ำสำหรับ editor/background: `scheduler.priority = "low"`; pressure control หยุด admission ตอน memory ตึง (`scheduler.pressure`, default on)

### 7. Configure Settings

> Goal: ปรับ behavior ด้วย config ที่ถูก scope

1. Precedence: env `MBX_*` → `.mbx.toml` ที่ workspace root (เฉพาะ workspace settings) → `mbx/config.toml` ใน platform config dir (`%APPDATA%\mbx\config.toml` บน Windows)
2. Unknown TOML keys ถูก reject — typo เป็น error ทันที
3. Settings ที่ใช้บ่อย: `gc.max_size`, `target.max_size`/`target.max_age`, `scheduler.reserve_cpus`, `summary = "short"|"full"|"ci"|"off"`, `savings = "quips"|"plain"|"off"`, `[linker.profiles.*]`
4. `[remote]` settings ใส่ได้เฉพาะ global config หรือ `MBX_REMOTE_*` env — `.mbx.toml` ใน repo ไม่รับ
5. รายละเอียด settings ทั้งหมดดู 

### 8. Set Up CI Sharing

> Goal: CI restore cache ที่ trusted builds publish

1. GitHub Actions: ใช้ `jdx/mr-boxington-action@v1` ก่อน build step — push ขึ้น default branch save entry, PRs (รวม forks) เป็น restore-only; ดู inputs เต็มที่ 
2. Remote cache server: `[remote] url`, `namespace` (required เมื่อมี url), `mode = "read-write"` + bearer token หรือ OIDC (`id-token: write`)
3. S3-compatible (รวม R2/MinIO): `url = "s3://bucket[/prefix]"` + AWS env credentials + `s3_endpoint`/`s3_region` สำหรับ non-AWS
4. Transport อื่น: `MBX_CACHE_EXPORT_GROUP` per job → `mbx cache export --group <g> out.tar` / `mbx cache import in.tar`
5. Write policy ถูก enforce ฝั่ง environment เสมอ — PR contexts ไม่ publish แม้ config เป็น `read-write`

## Rules

### 1. Installation And Wrapping

- Prefer `mise use -g --tool-option mr_boxington=true rust mr-boxington` (mise ≥2026.9.2) ตาม `global_rules` — อย่า `cargo install` ถ้า mise จัดการ Rust อยู่
- Keep existing Rust version pin เมื่อเพิ่ม `mr_boxington = true` — แก้เฉพาะ tool entry ไม่เปลี่ยน version
- `mbx setup` เขียน explicit `[wrappers.cargo]` (ต้อง mise ≥2026.8.16) — explicit wrapper มี precedence เหนือ Rust tool option
- Upgrade ผ่าน method เดิมที่ติดตั้ง — stable shim follow upgrades ไม่ต้อง setup ใหม่

### 2. Compiler Cache Interop

- ถ้า `RUSTC_WRAPPER` ชี้ cache อื่น (`sccache`, `kache`) → mbx ส่ง compilations ให้ cache นั้นและไม่ cache เอง — ตัดสินใจเลือกตัวเดียว อย่าซ้อน
- `mbx exec` สำหรับ C/C++ builds นอก Cargo: `mbx exec make -j8`, `mbx exec cmake --fresh -S . -B build`
- ห้ามลบ cache dir ขณะ build กำลังรัน — cache rebuild ได้เสมอแต่ interrupt build ไม่ได้

### 3. Storage And Filesystem

- Working cache + target ต้องอยู่ local storage — mbx reject NFS บน Linux/macOS (`cache_dir`/`MBX_CACHE_DIR`, `target.root`/`MBX_TARGET_ROOT`)
- Reflinks ต้อง CoW filesystem: APFS (macOS), btrfs/XFS (Linux), ReFS/Dev Drive (Windows) — NTFS/ext4 ใช้ byte copy แทน (cache ยังทำงาน)
- Windows: `target` symlink ต้อง Developer Mode หรือ privileged process — ถ้าสร้างไม่ได้ Cargo ใช้ target ปกติต่อ
- Preview ก่อนลบเสมอ: `mbx gc --dry-run`, `mbx adopt --dry-run`

### 4. Caching Limits

- Incremental compilations ไม่ถูก share — mbx force `CARGO_INCREMENTAL=0` และเก็บ learned incremental state เป็น private ต่อ checkout (`gc.incremental_max_size`)
- Build-script execution ถูก cache ตาม `rerun-if-changed`/`rerun-if-env-changed` — ปิดด้วย `build_script_execution = false`
- Native links cache เฉพาะ host ที่ linker/SDK/CRT describe ได้ (Linux, macOS, Windows MSVC/LLVM) — `cache_links`/`MBX_CACHE_LINKS=0` ปิด
- WASM targets ที่ built-in (`wasm32-unknown-unknown`, `wasm32-wasip1/2`, `wasm64-unknown-unknown` ฯลฯ) cache ได้ทุก platform

### 5. Safety And Verification

- `mbx doctor` + representative build ก่อนสรุปว่า setup สำเร็จ — install binary เฉยๆ ไม่ใช่หลักฐานว่า cargo ใช้ mbx
- `.mbx.toml` ใน repo เก็บเฉพาะ workspace settings — ห้ามใส่ remote URL, credentials, machine paths
- Remote write credentials scope เฉพาะ trusted branches — PR jobs ใช้ read-only role
- ถ้าเจอ error → ทำ `/resolve-errors`; ดู [references/cli.md](references/cli.md) สำหรับ debug commands (`explain`, `cache trace`, `cache verify`)

- ใช้ `/follow-tool-mise` สำหรับติดตั้ง/จัดการ tool versions
- ใช้ `/follow-tool-cargo` สำหรับ Cargo config และ lint rules
- ใช้ `/follow-lang-rust` สำหรับ Rust project structure
- ใช้ `/follow-tool-github-actions` สำหรับ CI workflow ทั่วไป

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `mbx` ติดตั้งและ `cargo`/`mbx` builds ผ่าน shared cache
- `mbx doctor` ผ่าน และ build ซ้ำข้าม worktree/fresh target มี cache hits จริง
- `target/` ถูก managed และ collection คืน disk อัตโนมัติ
- CI restore จาก cache ที่ default branch publish (ถ้าตั้งค่า)
- Parallel builds แชร์ CPU/memory budget เดียวกันไม่ overwhelm เครื่อง
