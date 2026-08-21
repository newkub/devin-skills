# CLI Reference

## Git Commands Reference

### Getting Help

| Command | Description |
|---------|-------------|
| `git --version` | แสดงเวอร์ชันของ Git |
| `git help <command>` | แสดง help สำหรับ command นั้นๆ |
| `git <command> -h` | แสดง help แบบสั้น |
| `git <command> --help` | แสดง help แบบเต็ม |

### Setup & Config

| Command | Description |
|---------|-------------|
| `git config --global user.name <name>` | ตั้งชื่อผู้ใช้ |
| `git config --global user.email <email>` | ตั้ง email |
| `git config --list` | แสดง configuration ทั้งหมด |
| `git config --global <key> <value>` | ตั้งค่า configuration |

### Creating & Cloning

| Command | Description |
|---------|-------------|
| `git init` | สร้าง Git repository ใหม่ |
| `git clone <url>` | Clone repository จาก URL |
| `git clone <url> <directory>` | Clone ลงใน directory ที่กำหนด |
| `git clone --depth 1 <url>` | Clone เฉพาะ commit ล่าสุด |

### Basic Snapshotting

| Command | Description |
|---------|-------------|
| `git add <file>` | เพิ่มไฟล์ไป staging area |
| `git add .` | เพิ่มไฟล์ทั้งหมด |
| `git add -A` | เพิ่มทุกไฟล์รวมทั้ง deleted files |
| `git add -p` | เพิ่มทีละส่วนของไฟล์ |
| `git commit -m "<msg>"` | สร้าง commit พร้อม message |
| `git commit -am "<msg>"` | Add และ commit ในคำสั่งเดียว |
| `git commit --amend` | แก้ไข commit ล่าสุด |
| `git commit --amend --no-edit` | แก้ไข commit โดยไม่เปลี่ยน message |

### Branching

| Command | Description |
|---------|-------------|
| `git branch` | แสดง branches ทั้งหมด |
| `git branch -a` | แสดงทั้ง local และ remote branches |
| `git branch <name>` | สร้าง branch ใหม่ |
| `git branch -d <name>` | ลบ branch (ที่ merge แล้ว) |
| `git branch -D <name>` | ลบ branch (บังคับ) |
| `git branch -m <old> <new>` | เปลี่ยนชื่อ branch |

### Switching Branches

| Command | Description |
|---------|-------------|
| `git checkout <branch>` | สลับไป branch นั้นๆ |
| `git checkout -b <branch>` | สร้างและสลับไป branch ใหม่ |
| `git checkout -b <branch> <start-point>` | สร้าง branch จาก point ที่กำหนด |
| `git switch <branch>` | สลับไป branch (ใหม่) |
| `git switch -c <branch>` | สร้างและสลับไป branch ใหม่ |

### Merging

| Command | Description |
|---------|-------------|
| `git merge <branch>` | รวม branch เข้ามา |
| `git merge --no-ff <branch>` | รวมแบบไม่ fast-forward |
| `git merge --squash <branch>` | รวมหลาย commits เป็น commit เดียว |
| `git merge --abort` | ยกเลิก merge |

### Rebasing

| Command | Description |
|---------|-------------|
| `git rebase <branch>` | Rebase บน branch นั้นๆ |
| `git rebase -i <commit>` | Interactive rebase |
| `git rebase --continue` | ทำต่อหลัง resolve conflict |
| `git rebase --abort` | ยกเลิก rebase |

### Remote Operations

| Command | Description |
|---------|-------------|
| `git remote -v` | แสดง remotes ทั้งหมด |
| `git remote add <name> <url>` | เพิ่ม remote ใหม่ |
| `git remote remove <name>` | ลบ remote |
| `git remote rename <old> <new>` | เปลี่ยนชื่อ remote |
| `git fetch <remote>` | ดึง metadata จาก remote |
| `git fetch --all` | ดึงจากทุก remotes |
| `git pull <remote> <branch>` | Pull และ merge |
| `git pull --rebase <remote> <branch>` | Pull แบบ rebase |
| `git push <remote> <branch>` | Push ไป remote |
| `git push -u <remote> <branch>` | Push และตั้ง upstream |
| `git push --force` | Force push |

### Stashing

| Command | Description |
|---------|-------------|
| `git stash` | เก็บ changes ชั่วคราว |
| `git stash save "<message>"` | เก็บพร้อม message |
| `git stash list` | แสดง stashes ทั้งหมด |
| `git stash pop` | นำ stash ล่าสุดมาใช้ |
| `git stash apply` | นำ stash มาใช้ (เก็บไว้) |
| `git stash drop` | ลบ stash ล่าสุด |
| `git stash clear` | ลบ stashes ทั้งหมด |

### History & Inspection

| Command | Description |
|---------|-------------|
| `git status` | แสดงสถานะ working directory |
| `git status -s` | แสดงสถานะแบบสั้น |
| `git log` | แสดงประวัติ commits |
| `git log --oneline` | แสดงสั้นๆ |
| `git log --graph` | แสดง graph |
| `git log -n <count>` | แสดง <count> commits ล่าสุด |
| `git log --author <name>` | กรองตาม author |
| `git show <commit>` | แสดงรายละเอียด commit |
| `git diff` | แสดง changes ที่ยังไม่ staged |
| `git diff --staged` | แสดง changes ที่ staged แล้ว |
| `git diff <branch1>..<branch2>` | เปรียบเทียบ branches |

### Undoing Changes

| Command | Description |
|---------|-------------|
| `git checkout -- <file>` | ย้อนไฟล์กลับไป staged state |
| `git restore <file>` | ย้อนไฟล์กลับ (ใหม่) |
| `git restore --staged <file>` | ย้อนจาก staged ไป unstaged |
| `git reset <file>` | ย้อนจาก staged |
| `git reset --soft <commit>` | ย้อนแต่เก็บ changes ไว้ |
| `git reset --hard <commit>` | ย้อนทั้งหมด |
| `git revert <commit>` | สร้าง commit ย้อนกลับ |

### Tagging

| Command | Description |
|---------|-------------|
| `git tag` | แสดง tags ทั้งหมด |
| `git tag <name>` | สร้าง tag แบบ lightweight |
| `git tag -a <name> -m "<msg>"` | สร้าง tag แบบ annotated |
| `git tag -a <name> <commit>` | Tag ที่ commit เก่า |
| `git tag -d <name>` | ลบ tag |
| `git push <remote> <tag>` | Push tag |
| `git push <remote> --tags` | Push tags ทั้งหมด |

### Searching

| Command | Description |
|---------|-------------|
| `git grep <pattern>` | ค้นหาในไฟล์ที่ tracked |
| `git grep -n <pattern>` | แสดงบรรทัดที่พบ |
| `git log -S "<string>"` | ค้นหา string ใน history |
| `git log --grep "<pattern>"` | ค้นหาใน commit messages |

### Information Commands

| Command | Description |
|---------|-------------|
| `git ls-files` | แสดงไฟล์ใน index |
| `git ls-tree <branch>` | แสดง tree structure |
| `git reflog` | แสดง reference logs |
| `git blame <file>` | แสดงว่าใครแก้ไขบรรทัดไหน |
| `git shortlog` | สรุป commits ตาม author |
