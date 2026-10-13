---
name: open-file-in-gitui
description: เปิดไฟล์ใน gitui TUI ด้วย gitui -f <file> ผ่าน terminal ที่รองรับ TTY
argument-hint: "[file]"
related:
  - follow-tool-git
  - open-wezterm
  - open-in-zed
  - open-diff
  - git-file-history
  - open-in-explorer
---

## Goal

เปิดไฟล์ที่ระบุใน tab Files ของ gitui ด้วย `gitui -f <file>` โดย spawn ใน terminal ที่真的有 TTY เพราะ gitui เป็น fullscreen TUI ที่ block จนกว่าจะออก

## Scope

ใช้เมื่อต้องการดูสถานะ stage/unstage และ diff ของไฟล์หนึ่งไฟล์ใน gitui จาก context ปัจจุบัน (path ที่ user ระบุ, ไฟล์ที่เปิดอยู่, หรือ current working directory) รองรับ Windows, macOS, Linux ที่มี `gitui` ใน PATH — ถ้าอยากดู diff ใน browser ใช้ /open-diff, ถ้าเปิดไฟล์ใน editor ใช้ /open-in-zed, ถ้าเปิด terminal เปล่า ๆ ใช้ /open-wezterm

## Execute

### 1. Prepare Context

> Goal: ระบุ file, repo root และ terminal ที่ใช้ได้

1. ระบุ target file จาก user input หรือไฟล์ที่เปิดอยู่ → แปลงเป็น absolute path
2. ตรวจสอบ file มีอยู่จริงด้วย `test -f` — ไม่มีอยู่ → อย่าเพิ่ง stop ให้ค้นก่อนว่าชื่อนี้มีอยู่ใน repo ไหม (`git ls-files "*<name>"`, `find . -name "<name>" -not -path "./.git/*"`) แล้วเสนอ candidates; ถ้าไม่มีเลย → แจ้ง user และ stop (ไม่สร้างไฟล์ใหม่)
3. หา repo root: `git -C "<dir-of-file>" rev-parse --show-toplevel` — ไม่ใน git repo → แจ้ง user แล้ว stop
4. ยืนยันว่า file อยู่ใต้ repo root นั้น (ไม่ใช่ path ข้าม repo)
5. ตรวจสอบ `gitui` ใน PATH ด้วย `command -v gitui` (mise shim → `gitui --version`; verified 0.28.1, 2026-10-12) — ไม่พบ → แจ้งวิธีติดตั้ง (`mise use -g gitui`, `scoop install gitui`, `cargo install gitui`) แล้ว stop
6. เลือก terminal emulator ที่อยู่ใน PATH: `wezterm` → `wt` → `x-terminal-emulator`/`gnome-terminal` (Linux) → `Terminal.app` (macOS) → `tmux` ถ้า session มีอยู่ — ไม่มีเลย → แสดง command ให้ user รันเองใน terminal

### 2. Build Command

> Goal: ประกอบคำสั่ง gitui ที่ถูกต้องตาม context

1. คำสั่งพื้นฐาน: `gitui -f "<absolute-file-path>"` ทำงานจาก repo root
2. ถ้า cwd ต่างจาก repo root ให้เพิ่ม `-w "<repo-root>"` (`--workdir`) หรือใช้ `--cwd` ของ terminal แทน; ถ้า git dir แยก (worktree, submodule) ใช้ `-d "<git-dir>"` (`--directory`)
3. options อื่นจาก `gitui --help` (0.28.1) ใส่ตามความจำเป็น:

   | Flag | ความหมาย |
   |---|---|
   | `-f, --file <file>` | เลือกไฟล์ใน tab Files (เป้าหมายของ skill นี้) |
   | `-w, --workdir <workdir>` | ตั้ง working directory (env `GIT_WORK_TREE`) |
   | `-d, --directory <directory>` | ตั้ง git directory (env `GIT_DIR`) |
   | `-t, --theme <file>` | theme file จาก config dir (default `theme.ron`) |
   | `-k, --key-bindings <file>` | custom keybindings file |
   | `-s, --key-symbols <file>` | custom key symbols file |
   | `--watcher` | ใช้ fs watcher แทน tick-based update |
   | `-l, --logging` / `--logfile <file>` | เขียน log ลง cache dir (`%LOCALAPPDATA%/gitui/gitui.log` บน Windows) |
   | `--bugreport` | สร้าง bug report แล้วออก |

4. config dir ของ gitui คือ `%APPDATA%\gitui` บน Windows (`~/.config/gitui` บน macOS/Linux) — dir ว่าง = ใช้ defaults ไม่ได้พัง

### 3. Launch In A TTY

> Goal: เปิด gitui ใน terminal จริง ไม่ block agent shell

1. ห้ามรัน `gitui` ตรง ๆ ใน shell ของ agent — เป็น blocking TUI ที่ไม่มี TTY แล้วแขวนจนกว่าจะโดน kill (ยืนยันกับ 0.28.1 แล้ว)
2. spawn ผ่าน terminal ตาม platform:
   - Windows + WezTerm: `wezterm start --cwd "<repo-root>" -- gitui -f "<file>"` (ดู /open-wezterm)
   - Windows Terminal: `wt -d "<repo-root>" pwsh -NoExit -c "gitui -f '<file>'"`
   - Linux: `x-terminal-emulator --working-directory="<repo-root>" -e gitui -f "<file>"` หรือ `gnome-terminal --working-directory="<repo-root>" -- gitui -f "<file>"`
   - macOS: `osascript -e 'tell application "Terminal" to do script "cd <repo-root> && gitui -f <file>"'`
   - มี tmux session ค้าง: `tmux new-session -d -c "<repo-root>" gitui -f "<file>"` แล้ว `tmux attach -t <session>`
3. หลายไฟล์ → เปิดทีละ window/session ละหนึ่งไฟล์ เพราะ `-f` รับได้หนึ่ง path ต่อการเปิด
4. ถ้าไม่มี terminal ให้ print คำสั่งสำเร็จรูป (`cd "<repo-root>" && gitui -f "<file>"`) ให้ user คัดลอกไปรัน — ใช้ /open-wezterm เปิด terminal ก่อนได้

### 4. Verify And Report

> Goal: ยืนยันว่า gitui เปิดและไฟล์ถูกเลือก

1. ตรวจว่า terminal process ถูก spawn (`wezterm` exit 0, หรือ `tmux ls` มี session ใหม่) — ไม่ได้แปลว่า gitui ยังรันอยู่ แค่ยืนยันว่าส่งคำสั่งสำเร็จ
2. ถ้า gitui เปิดแต่ไฟล์ไม่ถูกเลือก = ไฟล์นั้นไม่มี change ใน tab Files (clean/ignored) → บอก user ตรง ๆ แล้วเสนอทางออก: แก้ไฟล์ก่อน, ใช้ `git log -p -- <file>` / /git-file-history ดูประวัติ, หรือเปิด diff ใน browser ด้วย /open-diff
3. รายงาน: file path, repo root, terminal ที่ใช้, คำสั่งเต็มที่ใช้, และ note ว่า key bindings ดูได้จาก footer ของ gitui (กด `?` ใน normal mode)
4. ถ้าต้องการเลือกไฟล์ใน File Explorer แทน TUI ใช้ /open-in-explorer; ถ้าต้องการเปิดใน editor ใช้ /open-in-zed

## Rules

### 1. Safety

- ห้ามรัน `gitui` แบบ inline ใน non-TTY shell — ให้ spawn ผ่าน terminal เสมอ
- ไม่สร้างไฟล์หรือ directory ใหม่ถ้า target ไม่มีอยู่
- ไม่ commit, stage, stash, reset หรือ push ให้ user ผ่าน TUI อัตโนมัติ — gitui เป็น interactive UI ให้ user เป็นผู้กดเอง
- ไม่ปิด gitui session ที่ user เปิดค้างไว้
- ถ้า user ไม่ระบุ path ให้ถามก่อน ไม่เดาไฟล์

### 2. Determinism

- หา `gitui` จาก PATH/mise shim ก่อน ไม่ hardcode absolute path ของ binary
- ใช้ absolute path สำหรับทั้ง file และ `--cwd`/`-w` ใส่ quotes เสมอ (path มี space)
- resolve repo root จาก `git rev-parse` ทุกครั้ง ไม่สมมติว่า cwd คือ root
- output เดียวกันเมื่อ input เดิม: file + repo root + command string เดิม

### 3. Output

- รายงานเป็นรายการ: file, repo root, terminal, command ที่ใช้
- ถ้า fail ให้ระบุสาเหตุ (no gitui / not a repo / file clean / no terminal) พร้อมขั้นตอนต่อไปที่ชัด

- ใช้ /follow-tool-git ถ้าจำเป็น
- ใช้ /open-wezterm ถ้าจำเป็น
- ใช้ /open-in-zed ถ้าจำเป็น
- ใช้ /open-diff ถ้าจำเป็น
- ใช้ /git-file-history ถ้าจำเป็น
- ใช้ /open-in-explorer ถ้าจำเป็น

## Expected Outcome

- gitui เปิดใน terminal ใหม่พร้อมเลือกไฟล์เป้าหมายใน tab Files หรือรายงานสาเหตุที่ทำไม่ได้
- ได้ command string ที่รันซ้ำเองได้ใน shell
- ไม่มี process ของ agent ถูก block และไม่มี git operation ที่ user ไม่ได้สั่ง
