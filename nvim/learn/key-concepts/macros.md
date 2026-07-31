# Macros

## Definition

Macros คือการบันทึก sequence ของ commands และ replay:
- บันทึก commands ที่ซ้ำๆ
- Replay ได้หลายครั้ง
- ประหยัดเวลา
- ใช้สำหรับ repetitive tasks

## Recording Macros

### Start Recording
```
qa  - start recording to register a
qb  - start recording to register b
```

### Stop Recording
```
q  - stop recording
```

### Replay Macro
```
@a  - replay macro from register a
@@  - replay last macro
10@a - replay macro 10 times
```

## Macro Example

### Task: Rename Variables
```
1. qa  - start recording
2. /old  - search for "old"
3. cwnew  - change word to "new"
4. n  - next match
5. q  - stop recording
6. @a  - replay macro
```

## Editing Macros

### View Macro
```
:reg a  - view macro in register a
```

### Edit Macro
```
"ap  - paste macro to buffer
# edit macro
"ay  - yank back to register a
```

## Best Practices

1. **Test First**: Test macro ก่อน replay หลายครั้ง
2. **Keep Simple**: ทำให้ macros simple และ focused
3. **Use Registers**: ใช้ registers ที่ไม่ซ้ำกัน
4. **Document**: Document ว่า macro ทำอะไร
5. **Edit Carefully**: Edit macros อย่างระมัดระวัง
