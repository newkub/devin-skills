# Git Daily Workflow Best Practices

แนวทางใช้ git ในงานประจำวัน — branch, commit, sync อย่างมี discipline

## Recommended Patterns

### 1. Feature branch เสมอ

```bash
git switch -c feat/add-login main
```

- ไม่ commit ตรงลง `main`/`dev` — ทุกงานอยู่บน branch แล้ว merge ผ่าน PR
- ตั้งชื่อตาม convention ของทีม: `feat/`, `fix/`, `chore/`, `refactor/`

### 2. Review ก่อน commit

```bash
git status          # ดูไฟล์ที่เปลี่ยน
git diff            # unstaged changes
git diff --staged   # staged changes — อ่านก่อน commit เสมอ
git add -p          # stage ทีละ hunk — ไม่ใช่ git add -A มั่วๆ
```

- `git add -p` ช่วยแยก unrelated changes ออกเป็นหลาย commits แทน commit เดียวรวมทุกอย่าง
- ระวังไฟล์ที่ไม่ควร commit: `.env`, credentials, `*.local`, build output — ตรวจ `git status` ทุกครั้ง

### 3. Commit ที่อ่านได้

- commit เดียวทำเรื่องเดียว — atomic, revert ง่าย
- message format: `<type>: <what>` + body อธิบาย `why` ถ้าไม่ชัด เช่น `fix: handle null user in checkout`
- เขียน imperative mood: "add feature" ไม่ใช่ "added feature"
- ถ้า commit message ต้องมี "and" หลายอัน → แยก commit

### 4. Sync กับ remote อย่างปลอดภัย

```bash
git fetch --all --prune        # อัปเดต refs + ลบ stale branches
git pull --rebase              # ดึงงานคนอื่นโดยไม่สร้าง merge commit ขยะ
git push -u origin feat/x      # push ครั้งแรกตั้ง upstream
git push --force-with-lease    # force push อย่างปลอดภัย (เฉพาะ branch ตัวเอง)
```

- `--force-with-lease` > `--force` — fail ถ้า remote มี commits ใหม่ที่เราไม่รู้ ป้องกันเขียนทับงานคนอื่น
- `git pull` default = merge → สร้าง merge commit ขยะ; `pull --rebase` ให้ history เส้นตรง

### 5. Worktree สำหรับงานขนาน

```bash
git worktree add ../repo-hotfix hotfix/critical-bug
```

- แทนการ `git stash` แล้ว switch branch — ทำ hotfix โดยไม่รบกวน working tree หลัก
- เหมาะกับ: review PR ของคนอื่น, long-running build บน branch หลัก

## Do / Don't

| Do | Don't |
|---|---|
| `git status` + `git diff` ก่อน commit ทุกครั้ง | `git add -A && git commit` โดยไม่ดูว่า stage อะไร |
| commit เล็กๆ บ่อยๆ บน feature branch | commit เดียวยักษ์ส่งท้ายวัน |
| `pull --rebase` เมื่อ sync branch | `pull` merge สร้าง merge commit noise |
| `git stash push -m "wip: x"` ใส่ message | `git stash` เปล่าๆ แล้วลืมว่าเก็บอะไร |
| `git switch` / `git restore` (modern commands) | `git checkout` ทำทุกอย่าง (ambiguous semantics) |
| ลบ branch ที่ merged แล้ว `git branch -d` | ปล่อย stale branches สะสม |

## Common Pitfalls

- Commit secrets โดยไม่ตั้งใจ: `.env`, API keys ใน diff — ใช้ gitleaks ใน pre-commit (ดู `/follow-tool-hk`) + ตรวจ `git diff --staged`
- `git add -A` stage ทุกอย่างรวมถึงไฟล์ที่ไม่ตั้งใจ: build artifacts, `node_modules`, OS files (`.DS_Store`, `Thumbs.db`) — ใส่ `.gitignore` ให้ครบตั้งแต่เริ่ม
- Amend commit ที่ push แล้ว: `git commit --amend` เปลี่ยน hash → push conflict — amend เฉพาะ commit ที่ยังไม่ push
- Stash แล้วลืม: `git stash list` เช็ค stash ค้างเป็นนิสัย — stash เก่าๆ apply ทับ code ใหม่แล้ว conflict
- Merge conflict แก้ผิด: รีบ mark resolved โดยไม่อ่าน — conflict markers `<<<<<<<` หลงเหลือใน commit; เสิร์ช marker ก่อน commit เสมอ
- `git clean -fd` ลบของที่ยังไม่ commit: รัน `git clean -nd` dry-run ก่อนเสมอ

## CI / Team Notes

- hooks: pre-commit = fast checks (format, lint staged files); pre-push = heavier (typecheck, tests) — อย่าใส่ test เต็มชุดใน pre-commit
- `.gitattributes`: pin `eol` และ binary files (`*.png binary`) — ลด diff noise และ line-ending flip บน Windows
- ตั้ง `git config pull.rebase true` เป็น personal default ถ้าทีมใช้ linear history
- `git config core.hooksPath` หรือ hk/moon hooks — อย่า rely on manual `.git/hooks` ที่ share กันไม่ได้
