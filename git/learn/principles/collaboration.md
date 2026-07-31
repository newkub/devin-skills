# Collaboration

## Definition

Collaboration คือการทำงานร่วมกันใน Git repository:
- Multiple developers
- Code review
- Conflict resolution
- Continuous integration

## Pull Requests

### Creating PRs

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push -u origin feature/new-feature

# Create PR on GitHub/GitLab
```

### PR Guidelines

**Title:**
- ใช้ conventional commit format
- อธิบายสิ่งที่ PR ทำอย่างชัดเจน
- ไม่ยาวเกินไป

**Description:**
- อธิบาย why และ what
- รวม screenshots ถ้าเกี่ยวกับ UI
- Link ไปยัง issues ที่เกี่ยวข้อง
- Checklist สำหรับ review

**Checklist:**
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

### Review Process

1. **Request Review**: เลือก reviewers ที่เกี่ยวข้อง
2. **Address Comments**: ตอบและแก้ไข comments
3. **Update PR**: Push changes หลังแก้ไข
4. **Approval**: รอ approval จาก reviewers
5. **Merge**: Merge หลัง approval

## Conflict Resolution

### Identifying Conflicts

```bash
# Pull latest changes
git pull origin main

# Git will show conflicts
```

### Resolving Conflicts

```bash
# Open conflicted files
# Git marks conflicts:
<<<<<<< HEAD
Current branch content
=======
Incoming branch content
>>>>>>> feature-branch

# Resolve conflicts manually
# Edit files to resolve conflicts

# Stage resolved files
git add resolved-file.txt

# Continue merge
git commit
```

### Conflict Tools

```bash
# Use merge tool
git mergetool

# Configure merge tool
git config --global merge.tool vscode
```

## Code Review Best Practices

### For Reviewers

1. **Be Constructive**: ให้ feedback ที่มีประโยชน์
2. **Be Specific**: ระบุจุดที่ต้องปรับปรุง
3. **Explain Why**: อธิบายเหตุผล
4. **Be Timely**: Review อย่างรวดเร็ว
5. **Focus on Important**: เน้นสิ่งสำคัญก่อน

### For Authors

1. **Small PRs**: ทำ PR ขนาดเล็ก
2. **Clear Description**: อธิบายอย่างชัดเจน
3. **Self-Review**: Review เองก่อนส่ง
4. **Respond Promptly**: ตอบ comments อย่างรวดเร็ว
5. **Learn**: เรียนรู้จาก feedback

## Branch Protection

### Rules

- **Require Pull Request**: ไม่อนุญาต direct push
- **Required Reviews**: ต้องมี reviewers อนุมัติ
- **Status Checks**: ต้องผ่าน CI/CD
- **Restrict Who Can Push**: จำกัดผู้ที่ push ได้
- **Require Signed Commits**: ต้องมี signature

### Setting Up

```bash
# On GitHub:
# Settings → Branches → Add rule
# Configure protection rules
```

## Continuous Integration

### CI Pipeline

1. **Trigger**: เมื่อมี PR หรือ push
2. **Install Dependencies**: Install dependencies
3. **Run Tests**: Run unit tests
4. **Run Linting**: Check code quality
5. **Build**: Build project
6. **Deploy**: Deploy to staging (optional)

### CI Platforms

- **GitHub Actions**: Native to GitHub
- **GitLab CI**: Native to GitLab
- **CircleCI**: Popular CI platform
- **Travis CI**: Classic CI platform

## Best Practices

1. **Small PRs**: PR ขนาดเล็ก review ง่าย
2. **Clear Communication**: สื่อสารอย่างชัดเจน
3. **Automated Tests**: ใช้ automated tests
4. **Code Review**: Review ทุก PR
5. **Branch Protection**: ใช้ protection rules
6. **Resolve Conflicts Early**: Resolve conflicts อย่างรวดเร็ว
7. **Document Decisions**: Document การตัดสินใจสำคัญ
