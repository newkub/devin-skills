---
title: Built-in Functions
description: Built-in functions ใน Neovim สำหรับ scripting และ configuration
---

## Goal

ใช้ built-in functions ใน Neovim สำหรับ scripting และ automation

## Scope

ใช้สำหรับ string functions, list functions, math functions, และ system functions

## Execute

### 1. String Functions

ตาราง string functions:

| Function | Description | Example |
|----------|-------------|---------|
| `len()` | String length | `len('hello')` → 5 |
| `strcharpart()` | Substring | `strcharpart('hello', 1, 3)` → 'ell' |
| `stridx()` | Find substring | `stridx('hello', 'el')` → 1 |
| `toupper()` | Uppercase | `toupper('hello')` → 'HELLO' |
| `tolower()` | Lowercase | `tolower('HELLO')` → 'hello' |
| `substitute()` | Replace | `substitute('hello', 'l', 'L', 'g')` → 'heLLo' |
| `split()` | Split string | `split('a,b,c', ',')` → ['a', 'b', 'c'] |
| `join()` | Join list | `join(['a', 'b'], ',')` → 'a,b' |
| `trim()` | Trim whitespace | `trim('  hello  ')` → 'hello' |

### 2. List Functions

ตาราง list functions:

| Function | Description | Example |
|----------|-------------|---------|
| `len()` | List length | `len([1, 2, 3])` → 3 |
| `add()` | Add item | `add([1, 2], 3)` → [1, 2, 3] |
| `remove()` | Remove item | `remove([1, 2, 3], 1)` → 2 |
| `insert()` | Insert item | `insert([1, 3], 2, 1)` → [1, 2, 3] |
| `copy()` | Copy list | `copy([1, 2, 3])` → [1, 2, 3] |
| `sort()` | Sort list | `sort([3, 1, 2])` → [1, 2, 3] |
| `reverse()` | Reverse list | `reverse([1, 2, 3])` → [3, 2, 1] |
| `map()` | Map function | `map([1, 2, 3], 'v:val * 2')` → [2, 4, 6] |
| `filter()` | Filter list | `filter([1, 2, 3], 'v:val > 1')` → [2, 3] |

### 3. Math Functions

ตาราง math functions:

| Function | Description | Example |
|----------|-------------|---------|
| `abs()` | Absolute value | `abs(-5)` → 5 |
| `round()` | Round | `round(3.7)` → 4 |
| `floor()` | Floor | `floor(3.7)` → 3 |
| `ceil()` | Ceiling | `ceil(3.2)` → 4 |
| `sqrt()` | Square root | `sqrt(16)` → 4 |
| `pow()` | Power | `pow(2, 3)` → 8 |
| `log()` | Natural log | `log(10)` → 2.302 |
| `log10()` | Base-10 log | `log10(100)` → 2 |
| `sin()` | Sine | `sin(0)` → 0 |
| `cos()` | Cosine | `cos(0)` → 1 |
| `rand()` | Random | `rand()` → random number |
| `srand()` | Seed random | `srand(42)` |

### 4. Dictionary Functions

ตาราง dictionary functions:

| Function | Description | Example |
|----------|-------------|---------|
| `len()` | Dict length | `len({'a': 1})` → 1 |
| `keys()` | Get keys | `keys({'a': 1, 'b': 2})` → ['a', 'b'] |
| `values()` | Get values | `values({'a': 1, 'b': 2})` → [1, 2] |
| `items()` | Get items | `items({'a': 1})` → [['a', 1]] |
| `has_key()` | Check key | `has_key({'a': 1}, 'a')` → 1 |
| `get()` | Get value | `get({'a': 1}, 'a', 0)` → 1 |
| `remove()` | Remove key | `remove({'a': 1}, 'a')` → 1 |

### 5. System Functions

ตาราง system functions:

| Function | Description | Example |
|----------|-------------|---------|
| `system()` | Run command | `system('ls')` → output |
| `systemlist()` | Run command (list) | `systemlist('ls')` → lines |
| `executable()` | Check executable | `executable('python')` → 1 |
| `delete()` | Delete file | `delete('file.txt')` |
| `mkdir()` | Create directory | `mkdir('dir')` |
| `readfile()` | Read file | `readfile('file.txt')` |
| `writefile()` | Write file | `writefile(['line'], 'file.txt')` |
| `getcwd()` | Get working dir | `getcwd()` → '/path' |
| `chdir()` | Change dir | `chdir('/path')` |
| `expand()` | Expand path | `expand('~')` → '/home/user' |
| `fnamemodify()` | Modify filename | `fnamemodify('file.txt', ':e')` → 'txt' |

### 6. Buffer Functions

ตาราง buffer functions:

| Function | Description | Example |
|----------|-------------|---------|
| `bufnr()` | Buffer number | `bufnr('%')` → 1 |
| `bufname()` | Buffer name | `bufname('%')` → 'file.txt' |
| `bufloaded()` | Check loaded | `bufloaded(1)` → 1 |
| `getbufline()` | Get lines | `getbufline(1, 1, 5)` |
| `setbufline()` | Set lines | `setbufline(1, 1, ['line'])` |
| `appendbufline()` | Append lines | `appendbufline(1, 5, ['line'])` |
| `deletebufline()` | Delete lines | `deletebufline(1, 1, 5)` |

### 7. Window Functions

ตาราง window functions:

| Function | Description | Example |
|----------|-------------|---------|
| `winnr()` | Window number | `winnr()` → 1 |
| `winbufnr()` | Window buffer | `winbufnr(1)` → 1 |
| `wincol()` | Window column | `wincol()` → 5 |
| `winline()` | Window line | `winline()` → 10 |
| `winheight()` | Window height | `winheight(1)` → 20 |
| `winwidth()` | Window width | `winwidth(1)` → 80 |

### 8. Path Functions

ตาราง path functions:

| Function | Description | Example |
|----------|-------------|---------|
| `fnamemodify()` | Modify path | `fnamemodify('file.txt', ':p')` |
| `expand()` | Expand path | `expand('%:p')` |
| `resolve()` | Resolve path | `resolve('link')` |
| `isdirectory()` | Check dir | `isdirectory('/path')` |
| `isfile()` | Check file | `isfile('file.txt')` |
| `filereadable()` | Check readable | `filereadable('file.txt')` |
| `filewritable()` | Check writable | `filewritable('file.txt')` |
| `getftime()` | Get file time | `getftime('file.txt')` |
| `getfsize()` | Get file size | `getfsize('file.txt')` |

### 9. Time Functions

ตาราง time functions:

| Function | Description | Example |
|----------|-------------|---------|
| `localtime()` | Local time | `localtime()` → timestamp |
| `strftime()` | Format time | `strftime('%Y-%m-%d')` |
| `reltime()` | Relative time | `reltime()` → time list |
| `reltimestr()` | Format relative | `reltimestr(time)` |

### 10. Type Functions

ตาราง type functions:

| Function | Description | Example |
|----------|-------------|---------|
| `type()` | Get type | `type('hello')` → 'string' |
| `typename()` | Get type name | `typename('hello')` → 'String' |
| `string()` | Convert to string | `string(42)` → '42' |
| `float2nr()` | Float to number | `float2nr(3.7)` → 3 |
| `nr2float()` | Number to float | `nr2float(3)` → 3.0 |

### 11. Lua API

ใช้ Lua API สำหรับ functions:

```lua
-- String functions
vim.fn.len('hello')
vim.fn.toupper('hello')

-- List functions
vim.fn.len({1, 2, 3})
vim.fn.add({1, 2}, 3)

-- System functions
vim.fn.system('ls')
vim.fn.getcwd()
```

## Rules

- ใช้ Lua API เมื่อทำได้ (modern approach)
- ใช้ Vimscript functions เมื่อจำเป็น
- ตรวจสอบ return types ก่อนใช้
- จัดการ errors อย่างเหมาะสม

## Expected Outcome

- Built-in functions ใช้งานได้อย่างถูกต้อง
- Scripting ที่ efficient
- Automation ทำงานได้อย่างราบรื่น
- Type safety ที่ดี
