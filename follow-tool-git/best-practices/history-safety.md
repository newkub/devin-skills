# Git History Safety Best Practices

แนวทางแก้ history, recover งาน, และใช้คำสั่งอันตรายอย่างปลอดภัย — rebase, reset, revert, reflog

## Recommended Patterns

### 1. Rebase เฉพาะ branch ตัวเอง

```bash
git rebase main              # เลื่อน feature branch ไปบน main ล่าสุด
git rebase -i HEAD~3         # squash/reword 3 commits ล่าสุด
```

- Golden rule: อย่า rebase commits ที่ push ไปแล้วและคนอื่นอาจ base งานอยู่ — เปลี่ยน hash ทำให้ history คนอื่นขยะ
- rebase ก่อน merge เพื่อ linear history (ถ้าทีมตกลง)
- ถ้า conflict เยอะ: `git rebase --abort` ยกเลิกได้เสมอ — อย่าฝืนต่อถ้าไม่มั่นใจ

### 2. Revert สำหรับ shared history, reset สำหรับ local

| สถานการณ์ | ใช้ |
|---|---|
| commit ผิดแต่ยังไม่ push | `git reset --soft HEAD~1` (เก็บ changes เป็น staged) |
| commit ผิดและ push แล้ว | `git revert <sha>` — สร้าง inverse commit ไม่เขียนทับ history |
| ทิ้ง changes ทั้งหมดใน working tree | `git restore .` + `git clean -nd` (dry-run ก่อนเสมอ) |

- `git reset --hard` = ลบงานถาวร — dry-run ด้วย `git stash` หรือ commit WIP ก่อนเสมอ
- `git revert` ปลอดภัยบน shared branch เสมอ เพราะเป็น commit ใหม่

### 3. Reflog คือ safety net

```bash
git reflog                   # ดู HEAD history ทุกครั้งที่ย้าย
git reset --hard HEAD@{3}    # กลับไปจุดก่อน rebase พัง
```

- reflog เก็บทุก HEAD movement ~90 วัน — rebase ผิด/reset เกินกู้ได้เสมอ
- ก่อน rebase/reset ครั้งใหญ่: `git branch backup/xxx` หรือจด HEAD sha ไว้ — กู้ยากกว่าถ้าไม่รู้จุดเดิม

### 4. Bisect หา bad commit

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# git จะ checkout กลางทาง — test แล้ว mark good/bad จนเจอ
git bisect run npm test      # automate: bisect เองจนเจอ failing commit
git bisect reset
```

- `git bisect run <script>` ทำ automated bisect — script exit 0 = good, non-zero = bad

## Do / Don't

| Do | Don't |
|---|---|
| `git push --force-with-lease` เมื่อต้อง rewrite pushed branch | `git push --force` (เขียนทับงานคนอื่นได้เงียบๆ) |
| สร้าง backup branch ก่อน interactive rebase | rebase -i โดยไม่มีจุดกลับ |
| ใช้ `git revert` แก้ commit บน shared branch | `git reset --hard` + force push บน shared branch |
| `git cherry-pick -n` เมื่ออยาก review ก่อน commit | cherry-pick ตรงๆ แล้ว conflict ทับกัน |
| รัน tests หลัง rebase/merge/cherry-pick | assume ว่า rebase ผ่านแล้ว code ยังทำงาน |

## Common Pitfalls

- Force push ทับงานเพื่อน: ใช้ `--force-with-lease` เสมอ — `--force` ดื้อๆ ไม่เช็ค remote state
- Rebase กลาง conflict แล้วหลุด: `git status` บอกว่าอยู่ใน rebase — อย่า commit ปกติระหว่าง rebase ให้ `--continue`/`--abort`/`--skip`
- `reset --hard` แล้วหาไฟล์ไม่เจอ: untracked files ไม่อยู่ใน reflog — สูญถาวร; commit หรือ stash ก่อน
- Merge vs rebase ปนกัน: rebase feature → main แต่มีคน merge main → feature ระหว่างนั้น → duplicate commits; ตกลงกลยุทธ์เดียวต่อ branch
- Cherry-pick ข้าม branches ทำ duplicate commits: เมื่อ merge กลับ git เห็น content เดียวกัน 2 commits — ปกติไม่พังแต่ history อ่านยาก

## Recovery Playbook

```bash
# หา commit ที่หลัง rebase/reset ทำหาย
git reflog
git reset --hard <sha>

# กู้ไฟล์ที่ลบใน commit เก่า
git checkout <sha> -- path/to/file
git restore --source=<sha> path/to/file

# ยกเลิก merge ที่ยังไม่ push
git merge --abort            # ถ้ายังอยู่ใน merge
git reset --hard ORIG_HEAD   # ถ้า merge เสร็จแล้ว
```
