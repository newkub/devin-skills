# Submodule

## แนวคิด

Submodule เป็น Git repository ที่ฝังอยู่ภายใน Git repository อื่น ใช้สำหรับ manage external dependencies หรือ separate projects ภายใน larger project

## วิธีการทำงาน

เมื่อใช้ submodule:
1. Superproject เก็บ reference ไปยัง specific commit ของ submodule
2. Submodule มี Git directory แยกต่างหาก (.git/modules/)
3. Submodule ไม่ track history ทั้งหมด แต่ track commit เดียว
4. Clone superproject ต้อง init และ update submodules แยก

## ข้อดี

- **Modular**: แยก concerns ออกเป็น modules
- **Version Control**: Control exact version ของ dependencies
- **Independent**: Submodules สามารถ develop แยกกัน
- **Reusable**: share code ระหว่าง projects ได้

## ข้อเสีย

- **Complexity**: เพิ่มความซับซ้อนใน workflow
- **Nested Commands**: ต้อง manage ทั้ง superproject และ submodules
- **Sync Issues**: ต้อง sync submodules อย่างชัดเจน
- **CI/CD**: ต้อง configure เพิ่มสำหรับ submodules

## เมื่อใช้

- Share libraries ระหว่าง multiple projects
- Include third-party code ที่ต้อง modify
- Manage documentation แยกต่างหาก
- Include themes หรือ plugins ที่ version control แยกกัน

## Commands

```bash
# Add submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# Clone repository พร้อม submodules
git clone --recursive https://github.com/user/repo.git

# Init submodules หลัง clone
git submodule init

# Update submodules
git submodule update

# Update submodules ไปยัง latest commit
git submodule update --remote

# Clone และ update ในคำสั่งเดียว
git submodule update --init --recursive

# Status ของ submodules
git submodule status

# Remove submodule
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/modules/path/to/submodule

# Pull changes ใน submodules
git submodule foreach git pull origin main

# Show diff ของ submodules
git diff --submodule
```

## Submodule States

```
# Normal state
1234567 path/to/submodule (heads/main)

# Modified state
1234567 path/to/submodule (modified content)

# Uninitialized state
- path/to/submodule
```

## .gitmodules File

```ini
[submodule "path/to/submodule"]
	path = path/to/submodule
	url = https://github.com/user/repo.git
	branch = main
```

## Best Practices

- ใช้ submodules สำหรับ dependencies ที่ต้อง version control แยก
- commit .gitmodules และ submodule updates แยกกัน
- ใช้ `--recursive` เมื่อ clone
- document submodule dependencies ใน README
- พิจารณา alternatives อื่น (bun, cargo, go modules) ก่อนใช้ submodule
