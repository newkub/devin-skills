# Version Regularly

Version packages อย่างสม่ำเสมอ

## Principle

Version packages เป็นรอบ (weekly, bi-weekly) อย่ารอจนกว่ามี changesets เยอะ

## Why Version Regularly?

1. **Consistent Releases**: Releases สม่ำเสมอ
2. **Smaller Changesets**: Changesets น้อยลงต่อ release
3. **Easier Review**: ง่ายต่อการ review changelog
4. **Faster Feedback**: ได้ feedback เร็วขึ้น

## Workflow

### Bad Practice
```bash
# Wait months
# Accumulate 50+ changesets
# Version all at once
# Huge changelog
# Hard to review
```

### Good Practice
```bash
# Version weekly
# 5-10 changesets per release
# Manageable changelog
# Easy to review
```

## Release Schedule

### Weekly
```bash
# Every Monday
bunx changeset version
git commit -m "chore: version packages"
bunx changeset publish
```

### Bi-weekly
```bash
# Every other Monday
bunx changeset version
git commit -m "chore: version packages"
bunx changeset publish
```

### Monthly
```bash
# First Monday of month
bunx changeset version
git commit -m "chore: version packages"
bunx changeset publish
```

## Benefits

### Consistent Releases
- Users คาดหวัง releases สม่ำเสมอ
- ง่ายต่อการ planning
- ลดความผิดพลาด

### Smaller Changesets
- Changelog อ่านง่าย
- Review ได้เร็ว
- ลด risk

### Easier Debugging
- ง่ายต่อการ pinpoint issues
- ลด scope ของ debugging
- Faster fixes

## Implementation

### Automated Scheduling
ใช้ CI/CD สำหรับ automation:
```yaml
# GitHub Actions
on:
  schedule:
    - cron: '0 9 * * 1' # Every Monday 9am
```

### Manual Trigger
ใช้ manual trigger สำหรับ flexibility:
```yaml
# GitHub Actions
on:
  workflow_dispatch:
```

### Release PRs
สร้าง release PRs อัตโนมัติ:
```yaml
- name: Create Release PR
  run: bunx changeset version
  run: git commit -m "chore: version packages"
  run: git push
```

## Best Practices

1. **Choose Schedule**: เลือก schedule ที่เหมาะสม
2. **Stick to Schedule**: ทำตาม schedule อย่างสม่ำเสมอ
3. **Review Before Release**: Review changelog ก่อน publish
4. **Test Locally**: Test ก่อน publish

## Common Mistakes

### Waiting Too Long
อย่ารอจนกว่ามี changesets เยอะ:
- Version เป็นรอบ
- ไม่รอจนกว่ามี changesets เยอะ
- ปรับ schedule ถ้าจำเป็น

### Inconsistent Schedule
อย่าข้าม schedule:
- ทำตาม schedule อย่างสม่ำเสมอ
- ปรับ schedule ถ้าจำเป็น
- แจ้ง team ถ้ามีการเปลี่ยนแปลง

### Skipping Review
อย่า skip review:
- Review changelog ก่อน publish
- Test ก่อน publish
- แจ้ง team ก่อน release
