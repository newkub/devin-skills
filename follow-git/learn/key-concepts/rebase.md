# Rebase

## แนวคิด

Rebase เป็นการย้ายหรือ combine ลำดับของ commits ไปยัง base ใหม่ โดยทำการ rewrite commit history

## วิธีการทำงาน

เมื่อทำ rebase จะเป็นการ:
1. หา common ancestor ระหว่าง branch ปัจจุบันและ target branch
2. บันทึก commits ทั้งหมดจาก branch ปัจจุบัน
3. Reset branch ปัจจุบันไปยัง target branch
4. Apply commits ที่บันทึกไว้ทีละอันใหม่บน target branch

## ข้อดี

- **Linear History**: สร้าง commit history ที่เป็นเส้นตรง อ่านง่าย
- **Clean History**: ลด merge commits ที่ไม่จำเป็น
- **Easier Debugging**: บิสเซ็คปัญหาง่ายขึ้นเพราะ history เป็นเส้นตรง

## ข้อเสีย

- **Rewrite History**: เปลี่ยน commit hash ทำให้เกิดปัญหาถ้า share กับผู้อื่น
- **Lost Context**: สูญเสีย context ของ original merge
- **Recovery Hard**: กู้คืนจาก rebase ที่ผิดพลาดยาก

## เมื่อใช้

- ใช้กับ local branches ที่ยังไม่ได้ push
- ใช้เพื่อ keep feature branches up-to-date กับ main branch
- ใช้เพื่อ clean up commit history ก่อน merge

## เมื่อไม่ควรใช้

- ห้ามใช้กับ branches ที่ share กับ team
- ห้ามใช้กับ commits ที่ถูก push แล้ว
- ห้ามใช้ถ้าต้องการ preserve exact history

## Commands

```bash
# Rebase current branch onto main
git rebase main

# Rebase interactively (edit, squash, drop commits)
git rebase -i main

# Continue rebase หลังแก้ conflicts
git rebase --continue

# Abort rebase และกลับสู่สถานะเดิม
git rebase --abort

# Skip current commit ระหว่าง rebase
git rebase --skip
```

## Rebase vs Merge

| Feature | Rebase | Merge |
|---------|--------|-------|
| History | Linear | Non-linear |
| Commit Hash | Changes | Preserved |
| Context | Lost | Preserved |
| Safety | Risky | Safe |
| Readability | High | Medium |
