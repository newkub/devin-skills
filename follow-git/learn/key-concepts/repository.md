# Repository

## Definition

Git repository คือที่เก็บ project ทั้งหมด รวมถึง:
- ไฟล์โค้ดทั้งหมด
- History ของการเปลี่ยนแปลงทุก commit
- Configuration และ metadata
- Branches ทั้งหมด
- Tags และ references

## Types

### Local Repository
- อยู่บนเครื่องของคุณ
- เก็บใน `.git` directory
- มี full history
- ทำงาน offline ได้

### Remote Repository
- อยู่บน server (GitHub, GitLab, Bitbucket)
- ใช้สำหรับ collaboration
- Backup และ sharing
- CI/CD integration

## Structure

```
my-project/
├── .git/              # Git metadata
│   ├── HEAD          # Current branch reference
│   ├── config        # Repository configuration
│   ├── objects/      # Git objects (blobs, trees, commits)
│   ├── refs/         # Branch and tag references
│   └── index         # Staging area
├── src/              # Source code
├── README.md         # Documentation
└── .gitignore        # Ignore patterns
```

## Initialization

```bash
# Initialize new repository
git init

# Initialize with specific branch name
git init -b main

# Clone existing repository
git clone https://github.com/user/repo.git
```

## Configuration

```bash
# Repository-specific config
git config user.name "Your Name"
git config user.email "your@example.com"

# View repository config
cat .git/config
```

## Best Practices

- ใช้ `.gitignore` เพื่อ exclude ไฟล์ที่ไม่จำเป็น
- Commit บ่อยๆ เพื่อ maintain history
- Push ไป remote เป็นประจำสำหรับ backup
- ใช้ meaningful branch names
- Tag important releases
