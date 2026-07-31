---
title: Expression Evaluation
description: Expression Evaluation Engine ใน Neovim สำหรับ Vimscript และ Lua
---

## Goal

เข้าใจ Expression Evaluation Engine ใน Neovim สำหรับ scripting และ configuration

## Scope

ใช้สำหรับ expression evaluation, operators, precedence, และ type conversion

## Execute

### 1. What is Expression Evaluation?

Expression Evaluation Engine ใน Neovim:

- **Recursive descent parser**: Parse expressions ตาม precedence
- **Multiple types**: Numbers, strings, lists, dicts, funcrefs
- **Type coercion**: Automatic type conversion
- **Vimscript expressions**: ใช้ใน commands, functions, และ autocommands

### 2. Expression Syntax

Basic expressions:

```vim
" Numbers
let x = 42
let y = 3.14

" Strings
let s = "hello"
let s = 'world'

" Lists
let l = [1, 2, 3]

" Dictionaries
let d = {'key': 'value'}

" Funcrefs
let f = function('MyFunc')
```

### 3. Operators

ตาราง operators:

| Operator | Description | Precedence |
|----------|-------------|------------|
| `+` | Addition | 6 |
| `-` | Subtraction | 6 |
| `*` | Multiplication | 7 |
| `/` | Division | 7 |
| `%` | Modulo | 7 |
| `.` | String concatenation | 9 |
| `..` | String concatenation | 9 |
| `==` | Equal | 4 |
| `!=` | Not equal | 4 |
| `>` | Greater than | 4 |
| `<` | Less than | 4 |
| `>=` | Greater or equal | 4 |
| `<=` | Less or equal | 4 |
| `=~` | Regex match | 5 |
| `!~` | Regex not match | 5 |
| `&&` | Logical AND | 2 |
| `||` | Logical OR | 1 |
| `!` | Logical NOT | 8 |
| `?` | Ternary | 3 |
| `:` | Ternary separator | 3 |

### 4. Operator Precedence

ตาราง precedence (highest to lowest):

```
1.  (parentheses)
2.  ! (not)
3.  * / %
4.  + - .
5.  == != > < >= <= =~ !~
6.  &&
7.  ||
8.  ?:
```

### 5. Type Conversion

Automatic type conversion:

```vim
" Number to string
let s = 42 . " is the answer"  " "42 is the answer"

" String to number
let n = "42" + 8  " 50

" Boolean to number
let n = v:true + 0  " 1
let n = v:false + 0  " 0
```

### 6. Expression Contexts

ใช้ expressions ใน contexts ต่างๆ:

```vim
" In commands
:let x = 42
:echo x

" In functions
function! MyFunc()
  let x = 42
  return x
endfunction

" In autocommands
autocmd BufEnter * let g:buf_count += 1

" In mappings
nnoremap <leader>p :echo "Current line: " . line('.')<CR>
```

### 7. Special Variables

ตาราง special variables:

| Variable | Description |
|----------|-------------|
| `v:true` | True |
| `v:false` | False |
| `v:null` | Null |
| `v:none` | None |
| `v:version` | Neovim version |
| `v:progname` | Program name |
| `v:progpath` | Program path |
| `v:errmsg` | Last error message |
| `v:exception` | Last exception |
| `v:throwpoint` | Last throw point |

### 8. Expression Functions

Functions สำหรับ expressions:

```vim
" Evaluate expression
:echo eval('1 + 2')  " 3

" Execute expression
:execute 'echo "Hello"'

" Evaluate in context
:echo getline(line('.'))  " Current line
```

### 9. Lua Expressions

ใช้ Lua expressions:

```lua
-- Lua expressions in Vimscript
:lua print(1 + 2)  " 3

-- Vimscript in Lua
vim.cmd('echo "Hello"')

-- Evaluate Vimscript in Lua
local result = vim.fn.eval('1 + 2')
print(result)  " 3
```

### 10. Expression Evaluation in Lua

Lua API สำหรับ evaluation:

```lua
-- Evaluate Vimscript expression
local result = vim.fn.eval('1 + 2')

-- Execute Vimscript command
vim.fn.execute('echo "Hello"')

-- Evaluate in context
local line = vim.fn.line('.')
local text = vim.fn.getline(line)
```

### 11. Complex Expressions

Complex expressions:

```vim
" Nested expressions
let x = (a + b) * (c - d)

" Ternary operator
let x = condition ? true_value : false_value

" Logical expressions
let x = (a > 0) && (b < 10)

" String expressions
let s = "Hello " . name . "!"
```

### 12. Expression Evaluation Order

Evaluation order:

```vim
" Left to right for same precedence
let x = 1 + 2 + 3  " (1 + 2) + 3

" Short-circuit evaluation
let x = false && error()  " error() not called
let x = true || error()   " error() not called
```

### 13. Troubleshooting

#### Debug Expressions

```vim
" Print expression value
:echo expression

" Check type
:echo type(expression)

" Print error
:echo v:errmsg
```

#### Type Errors

จัดการ type errors:

```vim
" Check type before operation
if type(x) == type(0)
  let x = x + 1
endif
```

## Rules

- ใช้ parentheses สำหรับ clarity
- ตรวจสอบ types ก่อน operations
- ใช้ short-circuit evaluation สำหรับ performance
- ใช้ Lua expressions เมื่อทำได้

## Expected Outcome

- Expressions ประเมินผลได้อย่างถูกต้อง
- Type conversions ทำงานได้อย่าง expected
- Complex expressions ทำงานได้อย่างถูกต้อง
- Debugging ที่ง่าย
