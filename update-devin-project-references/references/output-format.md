# Output Format — ตารางใน website.md / api.md / cli.md

ทุกไฟล์ขึ้นต้นด้วย heading + generated-by note (ห้ามแก้ มือ — re-run แทน) ตารางทุกตารางถูก dedupe และ sort ด้วย `localeCompare(..,'en')` บนคอลัมน์ซ้าย→ขวา ดังนั้นผลลัพธ์ deterministic

## website.md

Section `## Routes` จาก `crw map <url> --format json`:

| Column | ความหมาย |
|---|---|
| URL | full URL ที่ map เจอ |
| Path | pathname เทียบ base (เช่น `/docs/intro`) |
| Segments | path แยกด้วย ` / ` หรือ `(root)` สำหรับ `/` |
| Depth | จำนวน segment (`/` = 0) |

## api.md

### `## Dependencies`

จาก `package.json` (dependencies/devDependencies/peerDependencies) และทุก `Cargo.toml` ([dependencies]/[dev-dependencies])

| Column | ความหมาย |
|---|---|
| Package | ชื่อ dependency |
| Version | version string (clap table ของ Cargo สกัดค่า `version`; inline table ไม่มี version → `(inline)`) |
| Source | manifest file + section เช่น `package.json (devDependencies)` |
| Language | `node/ts` หรือ `rust` |

### `## Exported Symbols`

ast-grep patterns ใน `api.ts` (`TS_SYMBOL_PATTERNS`, `RUST_SYMBOL_PATTERNS`):

| Column | ความหมาย |
|---|---|
| Symbol | ชื่อที่ capture จาก metavar `$N` |
| Kind | function/class/interface/type/const หรือ fn/struct/enum/trait |
| File | path เทียบ `--root` แบบ POSIX (รวม `.d.ts`) |
| Line | 1-based |

### `## Endpoints`

- ts/tsx: pattern `$R.$M($P, $$$)` และ `$R.$M($P)` — filter สองชั้น: method ∈ get/post/put/delete/patch/head/options และ path ขึ้นต้น `/`
- rust: pattern `#[<method>($P)]` ต่อ method (axum-style attrs)

| Column | ความหมาย |
|---|---|
| Method | HTTP method uppercase |
| Path | route path (unquoted) เช่น `/users/:id` |
| File / Line | ตำแหน่ง source |

## cli.md

### `## Commands`

- ts: `$A.command($N)` + `$A.command($N, $$$)` (commander/claude/yargs-like)
- rust: struct ที่ลงท้าย `Args|Opts|Options|Command|Cmd` → ชื่อ command = ตัด suffix แล้ว kebab (Kind เก็บ struct name เดิมไว้); `$A.subcommand($$$)` → `(subcommand)` builder row

| Column | ความหมาย |
|---|---|
| Command | ชื่อ command (kebab) |
| Kind | `command` / `clap group (ServeArgs)` / `clap builder` |
| File / Line | ตำแหน่ง source |

### `## Flags`

- ts: `$A.option($N)` และ `$A.option($N, $$$)` → Flag = token แรกของ option string (เช่น `--port`)
- rust: `#[arg($$$)]` → อ่าน field name จากบรรทัดถัดไปที่ไม่ใช่ attr/comment → `--<kebab-field>`; Definition = ตัว attr ทั้งบรรทัด

| Column | ความหมาย |
|---|---|
| Flag | ชื่อ flag |
| Definition | บทบริบท source ที่ truncate (≤120 chars) |
| File / Line | ตำแหน่ง source |

## Extending

เพิ่มภาษา: แก้ `LANGS` ใน `langs.ts` แล้วเพิ่ม pattern ใน `api.ts`/`cli.ts` ตามโครงเดิม — probe pattern กับ fixture ก่อน (`/use-astgrep`)
