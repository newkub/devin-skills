# Registers

## Definition

Registers คือที่เก็บ text ชั่วคราวใน Neovim:
- เก็บ yanked, deleted, และ pasted text
- มี registers หลายประเภท
- ใช้สำหรับ paste จากหลาย sources
- สามารถ paste หลายครั้ง

## Register Types

### Unnamed Register (`""`)
- Default register
- เก็บ yanked/deleted text ล่าสุด
- ใช้ `p` หรือ `""p`

### Numbered Registers (`0`-`9`)
- `0`: Yanked text (ไม่ใช่ deleted)
- `1`-`9`: Deleted text (history)
- `1`: ล่าสุด, `2`: รองล่าสุด, ฯลฯ

### Named Registers (`a`-`z`)
- User-defined registers
- ใช้ `"ay` เพื่อ yank ไป register `a`
- ใช้ `"ap` เพื่อ paste จาก register `a`

### System Register (`+`)
- System clipboard
- ใช้ `"+y` เพื่อ yank ไป clipboard
- ใช้ `"+p` เพื่อ paste จาก clipboard

### Delete Register (`-`)
- Small deletes (< 1 line)
- เก็บ text ที่ delete น้อยกว่า 1 line

### Search Register (`/`)
- Last search pattern
- ใช้ `/pattern` แล้ว paste ด้วย `"/p`

## Examples

### Yank to Register
```
"ay   - yank to register a
"by   - yank to register b
"+y   - yank to system clipboard
```

### Paste from Register
```
"ap   - paste from register a
"bp   - paste from register b
"+p   - paste from system clipboard
```

### View Registers
```
:reg  - view all registers
:reg a - view register a
```

## Best Practices

1. **Use Named Registers**: ใช้ named registers สำหรับ text ที่ใช้บ่อย
2. **System Clipboard**: ใช้ `+` register สำหรับ copy/paste กับ apps อื่น
3. **Yank Register**: ใช้ `0` register สำหรับ yanked text
4. **Delete History**: ใช้ numbered registers สำหรับ recover deleted text
5. **View Registers**: View registers เมื่อต้องการ debug
