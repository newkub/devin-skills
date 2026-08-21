# Stash

## แนวคิด

Stash เป็นการบันทึกการเปลี่ยนแปลงใน working directory และ staging area ชั่วคราว เพื่อให้สามารถกลับไป working directory ที่สะอาดได้โดยไม่ต้อง commit

## วิธีการทำงาน

เมื่อทำ stash จะเป็นการ:
1. บันทึก state ของ working directory และ index
2. Reset working directory ไปยัง HEAD commit
3. เก็บ stash ไว้ใน stack สำหรับดึงกลับมาใช้ภายหลัง

## ข้อดี

- **Context Switching**: สลับงานได้รวดเร็วโดยไม่ต้อง commit
- **Temporary Save**: บันทึกงานชั่วคราวได้
- **Multiple Stashes**: เก็บได้หลาย stashes พร้อม messages

## ข้อเสีย

- **Not Versioned**: Stashes ไม่ได้ถูก version control
- **Local Only**: Stashes อยู่เฉพาะใน local repository
- **Can Be Lost**: ถ้าลบ repository หรือ machine จะหายไป

## เมื่อใช้

- ต้อง switch branches แต่มี uncommitted changes
- ต้อง pull changes แต่มี conflicts ใน working directory
- ต้องทดสอบ fix ชั่วคราวแต่ไม่อยาก commit
- ต้อง clean working directory สำหรับ operations บางอย่าง

## Commands

```bash
# Stash current changes พร้อม message
git stash push -m "Work in progress on feature X"

# Stash รวม untracked files
git stash push -u

# Stash รวม ignored files
git stash push -a

# List all stashes
git stash list

# Show changes ใน stash
git stash show stash@{0}

# Show detailed diff ของ stash
git stash show -p stash@{0}

# Apply stash แต่ไม่ลบจาก stack
git stash apply stash@{0}

# Apply stash และลบจาก stack
git stash pop stash@{0}

# Drop stash โดยไม่ apply
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

## Stash Structure

```
stash@{0}: On main: Work in progress on feature X
stash@{1}: On develop: WIP bug fix
stash@{2}: On feature/login: Temporary changes
```

## Best Practices

- เสมอใส่ message ที่ชัดเจนเมื่อ stash
- ใช้ `git stash list` ก่อน pop เพื่อตรวจสอบ
- ใช้ `git stash apply` ถ้าต้องการ keep stash ไว้
- clean up stashes เก่าๆ เป็นประจำ
