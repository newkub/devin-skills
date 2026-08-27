---
name: check-skills-related
description: ตรวจสอบความสัมพันธ์ระหว่าง skills เร็ว แม่นยำ และเลือก mode รันได้
argument-hint: "[skill-name | mode]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - check-broken-skills-ref
  - check-circular-dependencies
  - review-references
  - use-scripts
  - report-table
---

## Goal

สร้าง call graph ของ skills โดยระบุว่า skill ใดเรียก skills ใดบ้าง ทั้งตรงและแบบ recursive

## Scope

ใช้สำหรับ scan skills directory (global หรือ project) เพื่อหา dependency relations ระหว่าง skills จาก `related:` frontmatter และ `/<skill-name>` references ใน body

จุดเด่นของเวอร์ชันนี้:
- ใช้ Rust binary เร็วและประหยัด memory
- Default รันแค่ Summary (ไม่เปลือง output)
- รองรับหลาย mode: Summary, Tree, Cycles, Orphans, Verify, Full
- ตรวจ cycle ด้วย Tarjan SCC และ BFS หา cycle สั้นทีสุดในแต่ละ SCC
- ผลลัพธ์ deterministic (sorted)

## Execute

### 1. Identify Target

> Goal: ระบุ target directory

1. รับ target directory จาก argument หรือใช้ `%APPDATA%\devin\skills` เป็น default
2. ถ้า argument เป็น skill name (ไม่ใช่ directory) → ใช้ default root + skill name
3. ยืนยันว่า target directory มีอยู่จริง
4. ถ้าไม่มี → stop และ report

### 2. Run Check Binary

> Goal: สร้าง call graph ด้วย Rust binary

1. ถ้า binary ยังไม่อยู่ → รัน `cargo build --release` ก่อน
2. รัน `target/release/check-skills-related.exe` ด้วย `exec`
3. ถ้ามี target skill → ส่ง `<skill-name>` เป็น argument ตำแหน่งที่ 1 หรือใช้ `-Skill`
4. ถ้าไม่มี target → รันโดยไม่มี argument เพื่อดู Summary
5. ใช้ `-Mode <mode>` เลือก mode ทีต้องการ
6. ตรวจสอบว่า binary รันสำเร็จและให้ output

### 3. Modes

| Mode | ใช้เมื่อ | Output |
|------|----------|--------|
| `Summary` | default | สถิติรวม, จำนวน cycle, cycle แรก, orphan count |
| `Tree` | ระบุ `-Skill` | call tree ของ skill นั้น, direct, depth, cycle ใน SCC |
| `Cycles` | หา cycle ทั้งหมด | รายการ cycle ทั้งหมด (สั้นสุดในแต่ละ SCC) |
| `Orphans` | หา skill ไม่มี outgoing | รายการ orphan skills |
| `Verify` | CI check | exit code 1 ถ้ามี cycle, ไม่อย่างนั้น 0 |
| `Full` | ต้องการรายละเอียดทั้งหมด | direct count, depth ของทุก skill (transitive ต้อง `-IncludeTransitive`) |

### 4. Parse Relations

> Goal: แยกความสัมพันธ์ทีถูกต้อง

1. อ่าน `SKILL.md` ของทุก skill ใน target directory
2. ดึง `name` จาก frontmatter (ถ้าไม่มี ใช้ directory name)
3. ดึง `related:` list จาก frontmatter เป็น direct callee
4. ดึง `/<skill-name>` references จาก body (ไม่รวม URL, fenced code blocks, frontmatter)
5. ตรงตัว: body token ต้อง match skill name พอดี ไม่ลดรูปและไม่นับ partial
6. รวม direct relations จาก `related` และ `/` references

### 5. Build And Traverse Graph

> Goal: รู้ว่า skill ไหนเรียก skills ไหน

1. สร้าง adjacency list: `caller -> [callees]`
2. ใช้ Tarjan's SCC หา strongly connected components แบบ deterministic
3. ในแต่ละ SCC ที่มี cycle ใช้ BFS หา cycle สั้นทีสุด
4. ถ้าต้องการ transitive closure ของ skill เดียว → ใช้ `-Skill` และ `-IncludeTransitive`
5. ไม่คำนวณ transitive closure ของทุก skill โดย default เพื่อหลีกเลี่ยง output ใหญ่และ OOM

### 6. Report Findings

> Goal: รายงาน call graph ให้อ่านง่ายและกระชับ

1. Default ใช้ Summary แสดงเฉพาะตัวเลขและ cycle แรก
2. ถ้ามี target skill → แสดง tree ของ target ก่อน
3. สรุปสถิติ: total skills, total relations, circular count, orphan count
4. ถ้าพบ cycle → แนะนำ `/check-circular-dependencies` หรือ `/update-references`

## Rules

### 1. What Counts As Related

- `/<skill-name>` ใน body หมายถึง skill นี้เรียก skill นั้น
- `related:` entries ใน frontmatter หมายถึงความสัมพันธ์โดยตรง
- URL (`https://...`) ไม่นับเป็น skill reference
- Fenced code blocks ถูกละเว้น
- File path (`references/foo.md`, `scripts/bar.ps1`) ไม่นับเป็น skill reference
- Markdown headings, anchors, code comments ไม่นับถ้าไม่อยู่ในรูปแบบ `/<skill-name>`

### 2. Precision

- ไม่นับ skill ทีหมดไปจาก token ยาวกว่า (ไม่ reduce)
- ไม่ count self-reference เป็น relation (กรองออก)
- ไม่คำนวณ transitive closure ทั้งหมดโดย default

### 3. Reproducible Output

- ใช้ Rust binary จาก `target/release/check-skills-related.exe`
- ถ้า binary ไม่อยู่ ให้ build ด้วย `cargo build --release`
- ผลลัพธ์ sorted ทุกครั้ง reproducible

### 4. No Auto-Fix

- `check-skills-related` ตรวจและรายงานเท่านั้น
- ถ้าต้องการแก้ `related` หรือ body references → ใช้ `/update-references`

## Expected Outcome

- Call graph ครบถ้วนของ skills ทั้งหมดใน target directory
- รายงาน direct และ transitive relations ของ skill ทีระบุ (ถ้า `-IncludeTransitive`)
- ระบุ circular references ถ้ามี พร้อม cycle path สั้นทีสุด
- สถิติรวม: skills, relations, cycles, orphans
- แนะนำ next action เมื่องานเสร็จ
