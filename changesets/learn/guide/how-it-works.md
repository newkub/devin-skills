# How It Works

หลักการทำงานและ workflow ของ Changesets

## Architecture

```
Developer
    ↓
Create Changeset (.md)
    ↓
Changesets Directory (.changesets/)
    ↓
Version Command
    ↓
Update package.json
    ↓
Generate Changelog
    ↓
Publish to Registry
```

## Changeset File Structure

```markdown
---
"@my-package": minor
"@other-package": patch
---

Add new feature
```

## Versioning Process

### 1. Changeset Creation
สร้าง changeset file ใน `.changesets/`:
- ระบุ packages ที่มีการเปลี่ยนแปลง
- กำหนด version bump type
- เขียน changelog message

### 2. Version Calculation
Changesets คำนวณ version:
- Aggregate all changesets
- Determine highest bump type
- Update package.json

### 3. Changelog Generation
สร้าง changelog:
- Read all changesets
- Generate markdown
- Update CHANGELOG.md

### 4. Publishing
Publish packages:
- Build packages
- Publish to registry
- Clean up changesets

## Dependency Handling

### Internal Dependencies
Changesets จัดการ dependencies ระหว่าง packages:
- Auto-update internal versions
- Handle circular dependencies
- Maintain consistency

### External Dependencies
External dependencies ต้องจัดการเอง:
- Manual version updates
- Check compatibility
- Test before release

## Example Workflow

```bash
# 1. Create changeset
bunx changeset
# Select packages, bump type, write message

# 2. Commit changeset
git add .changesets/
git commit -m "feat: add new feature"

# 3. Version packages
bunx changeset version
# Updates package.json, CHANGELOG.md

# 4. Commit version changes
git add .
git commit -m "chore: version packages"

# 5. Publish
bunx changeset publish
# Publishes to bun
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Create Release PR
  run: bunx changeset version
  run: git commit -am "chore: version packages"
  run: git push
```

### Automated Publishing
```yaml
- name: Publish
  run: bunx changeset publish
```
