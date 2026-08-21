# Submodule Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ submodules เพื่อ manage external dependencies และ separate projects

## เมื่อใช้ Submodules

- Share libraries ระหว่าง multiple projects
- Include third-party code ที่ต้อง modify
- Manage documentation แยกต่างหาก
- Include themes หรือ plugins ที่ version control แยกกัน

## ขั้นตอนพื้นฐาน

### 1. Add Submodule

```bash
# Add submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# Add submodule พร้อม specific branch
git submodule add -b main https://github.com/user/repo.git path/to/submodule
```

### 2. Clone with Submodules

```bash
# Clone พร้อม submodules
git clone --recursive https://github.com/user/repo.git

# หรือ clone แล้ว init/update
git clone https://github.com/user/repo.git
cd repo
git submodule init
git submodule update
```

### 3. Update Submodules

```bash
# Update ไปยัง commits ที่ระบุใน .gitmodules
git submodule update

# Update ไปยัง latest commits บน remote branches
git submodule update --remote

# Update ทุก submodules
git submodule update --init --recursive
```

### 4. Remove Submodule

```bash
# Deinit submodule
git submodule deinit path/to/submodule

# Remove จาก git
git rm path/to/submodule

# Remove จาก filesystem
rm -rf .git/modules/path/to/submodule

# Commit
git commit -m "Remove submodule"
```

## Use Cases

### Add Shared Library

```bash
# Add shared library ใน project
git submodule add https://github.com/company/shared-lib.git libs/shared-lib

# Commit .gitmodules
git add .gitmodules
git commit -m "Add shared library submodule"

# Push
git push origin main
```

### Clone Project พร้อม Submodules

```bash
# Clone project
git clone https://github.com/user/project.git
cd project

# Init และ update submodules
git submodule update --init --recursive
```

### Update Submodule ไปยัง Latest

```bash
# Update submodule ไปยัง latest
cd path/to/submodule
git pull origin main
cd ../..
git add path/to/submodule
git commit -m "Update submodule to latest"
```

### Work ใน Submodule

```bash
# เข้าไปใน submodule
cd path/to/submodule

# Work ตามปกติ
git checkout -b feature-branch
# edit...
git commit -m "Add feature"

# Push
git push origin feature-branch

# กลับไป superproject
cd ../..
git add path/to/submodule
git commit -m "Update submodule commit"
```

## Best Practices

- **Document**: document submodules ใน README
- **Version Pin**: pin specific commits สำหรับ stability
- **Regular Updates**: update submodules เป็นประจำ
- **CI/CD**: configure CI/CD ให้ handle submodules
- **Alternatives**: พิจารณา package managers ก่อนใช้ submodule

## .gitmodules File

```ini
[submodule "libs/shared-lib"]
	path = libs/shared-lib
	url = https://github.com/company/shared-lib.git
	branch = main
```

## Advanced Usage

### Multiple Submodules

```bash
# Add multiple submodules
git submodule add https://github.com/user/repo1.git libs/repo1
git submodule add https://github.com/user/repo2.git libs/repo2

# Update ทุก submodules
git submodule update --init --recursive
```

### Submodule Branch

```bash
# Add submodule พร้อม specific branch
git submodule add -b develop https://github.com/user/repo.git path/to/submodule
```

### Submodule foreach

```bash
# Run command ในทุก submodules
git submodule foreach git pull origin main

# Check status ทุก submodules
git submodule foreach git status
```

## ตัวอย่าง Workflow

```bash
# 1. Create project
git init my-project
cd my-project

# 2. Add submodules
git submodule add https://github.com/user/ui-lib.git libs/ui-lib
git submodule add https://github.com/user/utils.git libs/utils

# 3. Commit
git add .gitmodules
git commit -m "Add submodules"

# 4. Clone ใน machine อื่น
git clone --recursive https://github.com/user/my-project.git

# 5. Update submodules
cd my-project
git submodule update --remote
git add libs/ui-lib libs/utils
git commit -m "Update submodules"
```

## Troubleshooting

### Submodule Detached HEAD

```bash
# Submodule อยู่ใน detached HEAD state
cd path/to/submodule
git checkout main
cd ../..
git add path/to/submodule
git commit -m "Fix submodule detached HEAD"
```

### Submodule Not Initialized

```bash
# Init และ update
git submodule init
git submodule update
```

### Submodule Path Changed

```bash
# Remove และ add ใหม่
git submodule deinit path/to/submodule
git rm path/to/submodule
git submodule add https://github.com/user/repo.git new/path
```

## References

- `key-concepts/submodule.md` - แนวคิดพื้นฐาน
