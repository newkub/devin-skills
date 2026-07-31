# Sparse Checkout

## แนวคิด

Sparse Checkout เป็น feature ที่ให้ clone หรือ checkout เฉพาะส่วนของ repository ที่ต้องการ แทนที่จะ clone ทั้งหมด ช่วยลด disk space และ clone time

## วิธีการทำงาน

เมื่อใช้ sparse checkout:
1. Enable sparse checkout ใน repository
2. Define patterns สำหรับ files/directories ที่ต้องการ
3. Git จะ checkout เฉพาะ files ที่ match patterns
4. Files อื่นๆ จะถูก skip แต่ยังคง track อยู่ใน Git

## ข้อดี

- **Faster Clone**: Clone เร็วขึ้นเพราะ download เฉพาะที่ต้องการ
- **Less Disk Space**: ใช้ disk space น้อยลง
- **Focused Work**: ทำงานเฉพาะส่วนที่ต้องการ
- **Large Repos**: ทำงานกับ large repos ได้ง่ายขึ้น

## ข้อเสีย

- **Complex Setup**: ต้อง configure patterns
- **Limited Visibility**: ไม่เห็น files ทั้งหมดใน repo
- **Context Loss**: อาจขาด context ของ project โดยรวม
- **Tool Issues**: บาง tools อาจไม่ทำงานดี

## เมื่อใช้

- ทำงานกับ large monorepos
- ต้องการเฉพาะ subdirectories บางส่วน
- Disk space จำกัด
- Network bandwidth จำกัด

## Commands

```bash
# Enable sparse checkout
git config core.sparseCheckout true

# Define patterns
echo "src/" >> .git/info/sparse-checkout
echo "docs/" >> .git/info/sparse-checkout

# Update working directory
git read-tree -mu HEAD

# Clone พร้อม sparse checkout
git clone --sparse https://github.com/user/repo.git
cd repo
git sparse-checkout init
git sparse-checkout set src docs

# Add patterns
git sparse-checkout add lib/

# List patterns
git sparse-checkout list

# Disable sparse checkout
git sparse-checkout disable
```

## Sparse Checkout Patterns

```
# Include directory
src/

# Include specific file
README.md

# Include pattern
*.js

# Exclude directory
!node_modules/

# Include nested
src/components/
```

## Best Practices

- ใช้ cone mode สำหรับ performance ดีขึ้น
- document patterns ใน team
- ใช้สำหรับ large monorepos
- ระวัง missing dependencies
