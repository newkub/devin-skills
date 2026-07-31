# Key Concepts

แนวคิดหลักของ Lefthook

## What is Lefthook?

Lefthook เป็น Git hooks manager ที่:
- รวดเร็วและทรงพลัง (เขียนด้วย Go)
- รองรับหลายภาษา (Node.js, Ruby, Python, Go, etc.)
- รัน commands แบบ parallel
- รองรับ remote configs

## Core Concepts

### Hooks
Scripts ที่รันเมื่อ Git events เกิดขึ้น:
- pre-commit
- pre-push
- commit-msg
- post-commit
- post-merge
- และอื่นๆ

### lefthook.yml
Configuration file สำหรับกำหนด hooks:
- กำหนด hooks ที่ต้องการ
- กำหนด commands ที่จะรัน
- กำหนด settings สำหรับแต่ละ hook

### Parallel Execution
รันหลาย commands พร้อมกัน:
- เพิ่มประสิทธิภาพ
- ลดเวลาที่ใช้
- ปรับแต่งได้ด้วย `parallel: true`

### Remote Configs
รองรับ extends จาก remote configs:
- ใช้ configs จาก repositories อื่น
- Share configs ทั่ว organization
- Maintain consistency

## Hook Types

### pre-commit
รันก่อน commit:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
```

### pre-push
รันก่อน push:
```yaml
pre-push:
  commands:
    test:
      run: bun test
```

### commit-msg
ตรวจสอบ commit message:
```yaml
commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

## Configuration Structure

```yaml
pre-commit:
  parallel: true
  commands:
    command-name:
      run: command
      files: pattern
```

## Best Practices

1. **Use Parallel**: เปิด parallel execution
2. **Group Commands**: จัดกลุ่ม commands ที่เกี่ยวข้องกัน
3. **Use Files**: ใช้ files pattern เพื่อ filter
4. **Skip When Needed**: ใช้ skip สำหรับ conditional execution
