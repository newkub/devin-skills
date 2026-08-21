# Modal Editing

## Definition

Modal editing คือแนวคิดที่ editor มีหลาย modes สำหรับการทำงานต่างกัน:
- Normal mode: สำหรับ navigation และ commands
- Insert mode: สำหรับพิมพ์ข้อความ
- Visual mode: สำหรับ selection
- Command mode: สำหรับ ex commands

## Modes

### Normal Mode
- Default mode เมื่อเปิด Neovim
- ใช้สำหรับ navigation และ editing commands
- ไม่สามารถพิมพ์ข้อความได้
- Keys ทำหน้าที่เป็น commands

### Insert Mode
- ใช้สำหรับพิมพ์ข้อความ
- เข้า mode ด้วย `i`, `a`, `o`, ฯลฯ
- ออก mode ด้วย `Esc`
- ทำงานเหมือน text editor ปกติ

### Visual Mode
- ใช้สำหรับ selection text
- เข้า mode ด้วย `v`, `V`, `Ctrl+v`
- สามารถ copy, delete, change ได้
- 3 types: character-wise, line-wise, block-wise

### Command Mode
- ใช้สำหรับ ex commands
- เข้า mode ด้วย `:`
- commands เช่น `:w`, `:q`, `:s/old/new/g`
- มีประวัติ commands

## Key Concepts

### Vim Philosophy
- **Don't repeat yourself**: ใช้ repeats และ macros
- **Think before you type**: วางแผนก่อน execute
- **Composable operations**: ใช้ combinations ของ motions และ operators
- **Efficiency**: ทำงานได้เร็วด้วย keyboard

### Operators
- `d`: delete
- `c`: change
- `y`: yank (copy)
- `p`: paste
- `>`: indent
- `<`: dedent

### Motions
- `w`: word
- `e`: end of word
- `b`: beginning of word
- `0`: beginning of line
- `$`: end of line
- `gg`: beginning of file
- `G`: end of file

## Examples

### Delete Word
```
dw  - delete word
d$  - delete to end of line
dd  - delete line
```

### Change Word
```
cw  - change word
c$  - change to end of line
cc  - change line
```

### Yank (Copy)
```
yw  - yank word
yy  - yank line
y$  - yank to end of line
```

## Best Practices

1. **Learn Normal Mode**: เรียนรู้ normal mode ก่อน
2. **Use Motions**: ใช้ motions ร่วมกับ operators
3. **Avoid Mouse**: ไม่ใช้ mouse
4. **Practice**: ฝึกบ่อยๆ
5. **Customize**: Customize key mappings ตามความต้องการ
