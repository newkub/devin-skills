# Atomic Commits

## Definition

Atomic commit คือ commit ที่:
- ทำสิ่งเดียว (single responsibility)
- เล็กและ focused
- สามารถ review ได้ง่าย
- สามารถ revert ได้โดยไม่กระทบอย่างอื่น
- Pass tests และ build

## Why Atomic Commits?

### Benefits
- **Easy Review**: Reviewer สามารถเข้าใจการเปลี่ยนแปลงได้ง่าย
- **Easy Revert**: Revert ได้โดยไม่กระทบ features อื่น
- **Better History**: History ชัดเจนและเข้าใจง่าย
- **Debugging**: หา bug ได้ง่ายด้วย bisect
- **Rollback**: Rollback ได้เฉพาะส่วนที่มีปัญหา

## Examples

❌ **Bad: Non-atomic commit**
```
feat: add user system and fix login bug and update docs
```
- ทำหลายอย่างใน commit เดียว
- Revert จะกระทบทั้งหมด
- Review ยาก
- History ไม่ชัดเจน

✅ **Good: Atomic commits**
```
feat(user): add user registration
fix(auth): resolve login timeout
docs: update API documentation
```
- แต่ละ commit ทำสิ่งเดียว
- Revert ได้เฉพาะส่วนที่ต้องการ
- Review ง่าย
- History ชัดเจน

## Guidelines

### 1. Single Responsibility
แต่ละ commit ควรทำสิ่งเดียว:
- แก้ bug เดียว
- เพิ่ม feature เดียว
- อัปเดต documentation เดียว
- Refactor ส่วนเดียว

### 2. Small Size
- ไม่เกิน 200-300 บรรทัด
- ไม่เกิน 5-10 ไฟล์
- แก้ไข module เดียวถ้าเป็นไปได้

### 3. Self-Contained
- Pass tests
- Build ผ่าน
- ไม่มี TODO comments
- ไม่มี broken code

### 4. Meaningful Message
- อธิบายสิ่งที่ commit ทำ
- ใช้ conventional commit format
- รวม context ที่จำเป็น

## Common Patterns

### Feature Implementation
```
feat(auth): add login form
feat(auth): implement login API
feat(auth): add token validation
feat(auth): integrate login flow
```

### Bug Fix
```
fix(api): resolve null pointer
fix(api): add error handling
fix(api): update error messages
```

### Refactoring
```
refactor(user): extract validation logic
refactor(user): simplify service layer
refactor(user): update interfaces
```

## When to Break the Rule

บางครั้งอาจต้อง commit หลายอย่างใน commit เดียว:
- **Breaking Changes**: ที่ต้องเปลี่ยนหลายที่พร้อมกัน
- **Cyclic Dependencies**: ที่ต้องเปลี่ยนพร้อมกัน
- **Performance**: ที่ต้อง optimize หลายส่วนพร้อมกัน

แต่ควร:
- Document อย่างชัดเจน
- Test อย่างละเอียด
- Consider splitting ถ้าเป็นไปได้

## Best Practices

1. **Commit Often**: Commit ทุกครั้งที่มี logical unit เสร็จ
2. **Review Before Commit**: Check ว่า commit ทำสิ่งเดียว
3. **Test Before Commit**: ตรวจสอบว่า pass tests
4. **Write Good Messages**: อธิบายอย่างชัดเจน
5. **Use Staging**: Stage เฉพาะที่จำเป็น
6. **Amend if Needed**: แก้ไข commit ถ้ายังไม่ push
