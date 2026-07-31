# Create Early

สร้าง changeset เมื่อทำการเปลี่ยนแปลง

## Principle

สร้าง changeset ทันทีหลังจากทำการเปลี่ยนแปลง อย่ารอจนกว่าจะ release

## Why Create Early?

1. **Tracking**: ติดตามการเปลี่ยนแปลงได้ง่าย
2. **Documentation**: Document changes ในเวลาจริง
3. **Consistency**: ไม่ลืมสร้าง changeset
4. **Review**: สามารถ review changesets ได้ก่อน release

## Workflow

### Bad Practice
```bash
# Make changes
git commit -m "feat: add new feature"

# Wait weeks/months
# Forget to create changeset
# Release without changelog
```

### Good Practice
```bash
# Make changes
git commit -m "feat: add new feature"

# Create changeset immediately
bunx changeset

# Commit changeset
git add .changesets/
git commit -m "chore: add changeset"
```

## Benefits

### Better Tracking
- ติดตามการเปลี่ยนแปลงได้ง่าย
- รู้ว่ามี changesets อะไรบ้าง
- สามารถ review ได้ก่อน release

### Complete Changelog
- Changelog ครบถ้วน
- ไม่พลาด changes
- Documentation สมบูรณ์

### Consistent Workflow
- Workflow สม่ำเสมอ
- ไม่ลืมสร้าง changeset
- ลดความผิดพลาด

## Implementation

### Pre-commit Hooks
ใช้ pre-commit hooks เพื่อ remind:
```bash
# .husky/pre-commit
bunx changeset status || echo "Don't forget to create a changeset!"
```

### CI Checks
ใช้ CI checks เพื่อ enforce:
```yaml
- name: Check Changesets
  run: bunx changeset status
```

### Team Guidelines
สร้าง guidelines สำหรับ team:
- สร้าง changeset ทุกครั้งที่มีการเปลี่ยนแปลง
- Commit changeset แยกจาก code changes
- Review changesets ใน PR

## Common Mistakes

### Forgetting Changesets
อย่าลืมสร้าง changeset:
- ใช้ pre-commit hooks
- ใช้ CI checks
- ใช้ team guidelines

### Creating Late
อย่ารอจนกว่า release:
- สร้าง changeset ทันที
- Commit changeset แยกจาก code
- Review changesets ใน PR

### Vague Messages
อย่าเขียน changelog ที่ไม่ชัดเจน:
- เขียน message ที่เฉพาะเจาะ
- อธิบาย changes อย่างชัดเจน
- ใช้ consistent format
