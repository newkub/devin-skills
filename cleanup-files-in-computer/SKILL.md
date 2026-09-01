---
name: cleanup-files-in-computer
description: ลบไฟล์/แคชทีไม่จำเป็นบนเครื่องด้วย mise cleanup task ใน global mise.toml
argument-hint: "[target]"
related:
  - report-idea-cleanup-files-in-computer
  - follow-tool-mise
  - alternative
  - delete
  - report-table
---

## Goal

ทำความสะอาดไฟล์และ cache บนเครื่องด้วย `mise run cleanup` ทีกำหนดใน global `mise.toml`

## Scope

- ตรวจสอบและสร้าง `[tasks.cleanup]` ใน global `mise.toml` (`~/.config/mise/config.toml` หรือ `~/.config/mise.toml`)
- ลบเฉพาะ cache, temp files, logs, old artifacts ที่ปลอดภัย
- ไม่ลบ source code, config, secrets, หรือไฟล์ส่วนบุคคล

## Execute

### 1. Verify Environment

> Goal: ตรวจสอบ mise และ global config

1. รัน `mise --version`
2. รัน `mise config` เพื่อหา global config path
3. ถ้ายังไม่มี global config → สร้าง `~/.config/mise/config.toml`
4. รัน `mise doctor` เพื่อตรวจสุขภาพ

### 2. Evaluate Cleanup Tools

> Goal: เลือก cleanup tools ทีเหมาะสม

1. ตรวจสอบ package managers/CLI ที่ติดตั้ง: `bun`, `pnpm`, `npm`, `pip`, `cargo`, `scoop`, `mise`, `uv`, `pnpm`
2. ใช้ `/alternative` เพื่อประเมิน cleanup tools เช่น:
   - `mise cache prune` vs `mise prune`
   - `bun pm cache clean` vs `npm cache clean`
   - `scoop cleanup *` vs `scoop cache rm *`
   - `cargo-sweep` vs `cargo clean`
   - `pip cache purge` vs `uv cache clean`
3. เลือก tools ทีปลอดภัยและมีอยู่จริงบนเครื่อง

### 3. Define cleanup Task

> Goal: สร้าง `[tasks.cleanup]` ใน global `mise.toml`

1. เปิด global `mise.toml`
2. เพิ่มหรืออัปเดต `[tasks.cleanup]`:
   ```toml
   [tasks.cleanup]
   description = "clean temp files and caches"
   shell = "pwsh -NoProfile -Command"
   run = '''
   # dry-run mode: pass --dry-run to see what would be deleted
   param($dryRun = $false)

   $cmds = @(
       @{ name = "mise cache prune"; cmd = "mise cache prune" },
       @{ name = "mise prune";       cmd = "mise prune" },
       @{ name = "bun cache";        cmd = "bun pm cache clean" },
       @{ name = "pnpm store";       cmd = "pnpm store prune" },
       @{ name = "npm cache";        cmd = "npm cache clean --force" },
       @{ name = "pip cache";        cmd = "pip cache purge" },
       @{ name = "uv cache";         cmd = "uv cache clean" },
       @{ name = "scoop cleanup";    cmd = "scoop cleanup *" },
       @{ name = "cargo sweep";      cmd = "cargo sweep -r ~" }
   )

   foreach ($c in $cmds) {
       Write-Host "[$($c.name)]"
       if ($dryRun) {
           Write-Host "  would run: $($c.cmd)"
       } else {
           try { Invoke-Expression $c.cmd } catch { Write-Host "  skipped: $_" }
       }
   }
   '''
   ```
3. ปรับ commands ตาม OS: Windows ใช้ PowerShell, macOS/Linux ใช้ bash/zsh
4. บันทึก global config

### 4. Dry Run

> Goal: แสดงสิ่งทีจะลบก่อนจริง

1. รัน `mise run cleanup -- --dry-run`
2. หรือ `mise run cleanup --dry-run`
3. รวบรวม output: cache paths, sizes, commands
4. ทำ `/report-table` หรือ `/report-idea-cleanup-files-in-computer` เพื่อสรุป

### 5. Confirm

> Goal: ได้รับ explicit confirmation

1. ถาม user ว่าต้องการลบจริงหรือไม่
2. ถ้า user ตกลง → ไปขั้นตอน 6
3. ถ้า user ไม่ตกลง → stop และรายงาน

### 6. Run Cleanup

> Goal: รัน cleanup จริง

1. รัน `mise run cleanup`
2. ตรวจสอบ exit code
3. ถ้ามี command ล้มเหลว → บันทึกและ report

### 7. Validate

> Goal: ยืนยันว่า cleanup เสร็จ

1. รัน `mise list` เพื่อตรวจสอบ tools
2. ตรวจสอบ disk space ก่อน/หลังด้วย `dua`, `duf` หรือ `Get-PSDrive`
3. รายงานสิ่งทีลบ, ขนาดทีประหยัดได้, และ errors

## Rules

### 1. Dry Run First

- ต้อง dry run เสมอ
- ไม่รัน destructive โดยไม่ได้ user confirm
- แสดง commands ทีจะรัน

### 2. Safe Targets

- ลบเฉพาะ cache, temp, logs, old artifacts
- ไม่ลบ source code, `.env`, secrets, credentials
- ไม่ลบ system directories เช่น `C:\Windows`, `C:\Program Files`

### 3. Tool-Specific Cleanup

- ใช้คำสั่ง cleanup ของ tool เอง เช่น `bun pm cache clean` แทน `rm -rf`
- ห้ามลบไฟล์ `.mise` หรือ `~/.local/share/mise` โดยตรง
- ใช้ `mise cache prune` และ `mise prune` สำหรับ mise

### 4. Global Config

- แก้ไขเฉพาะ global `mise.toml`
- ไม่แก้ไข project `mise.toml` โดยไม่ได้รับอนุญาต
- commit หรือ backup global config ก่อนแก้ถ้าจำเป็น

- ใช้ /follow-tool-mise ถ้าจำเป็น
- ใช้ /delete ถ้าจำเป็น

## Expected Outcome

- `[tasks.cleanup]` อยู่ใน global `mise.toml`
- `mise run cleanup --dry-run` แสดงรายการทีจะลบ
- หลัง user confirm ลบ cache/temp/artifacts ทีเลือก
- รายงาน disk space ประหยัดได้และ errors

