---
title: Extmarks
description: คำอธิบายเกี่ยวกับ Extmarks ใน Neovim
---

## Goal

เข้าใจ Extmarks ใน Neovim สำหรับ annotations ที่ track text changes

## Scope

ใช้สำหรับการสร้าง extmarks, decorations, และ tracking text changes

## Execute

### 1. What are Extmarks?

Extmarks (Extended Marks) เป็น buffer annotations ที่:

- **Track text changes**: ย้ายตำแหน่งอัตโนมัติเมื่อ text เปลี่ยน
- **Carry metadata**: เก็บข้อมูลเพิ่มเติม (highlight, text, icons)
- **Persistent**: อยู่ใน buffer จนกว่าจะถูกลบ
- **Namespace-based**: isolate extmarks จาก sources ต่างกัน

### 2. Basic Usage

สร้าง extmark:

```lua
local ns = vim.api.nvim_create_namespace('my_namespace')
local buf = vim.api.nvim_get_current_buf()

-- Create extmark at line 0, column 0
local id = vim.api.nvim_buf_set_extmark(buf, ns, 0, 0, {
  end_line = 0,
  end_col = 5,
  hl_group = 'Search',
})
```

### 3. Extmark Properties

ตาราง properties ที่ใช้ได้:

| Property | Type | Description |
|----------|------|-------------|
| `id` | number | Unique ID (auto-generated if nil) |
| `end_line` | number | End line (exclusive) |
| `end_col` | number | End column (exclusive) |
| `hl_group` | string | Highlight group |
| `virt_text` | table | Virtual text (array of `{text, hl}`) |
| `virt_text_pos` | string | Position: `eol`, `overlay`, `right_align` |
| `virt_text_win_col` | number | Window column for virtual text |
| `sign_text` | string | Sign text |
| `sign_hl_group` | string | Sign highlight |
| `line_hl_group` | string | Line highlight |
| `number_hl_group` | string | Number column highlight |
| `cursorline_hl_group` | string | Cursorline highlight |
| `conceal` | string | Concealed text |
| `spell` | boolean | Spell checking |

### 4. Virtual Text

ใช้ extmarks สำหรับ virtual text:

```lua
local ns = vim.api.nvim_create_namespace('virtual_text')

vim.api.nvim_buf_set_extmark(0, ns, 0, 0, {
  virt_text = { { 'TODO:', 'Todo' }, { ' Fix this', 'Error' } },
  virt_text_pos = 'eol',
})
```

**Positions:**
- `eol`: End of line
- `overlay`: Overlay text
- `right_align`: Right aligned
- `win_col`: Specific window column

### 5. Signs

ใช้ extmarks สำหรับ signs:

```lua
local ns = vim.api.nvim_create_namespace('signs')

vim.api.nvim_buf_set_extmark(0, ns, 0, 0, {
  sign_text = '→',
  sign_hl_group = 'SignColumn',
})
```

### 6. Line Highlighting

ใช้ extmarks สำหรับ line highlighting:

```lua
local ns = vim.api.nvim_create_namespace('line_hl')

vim.api.nvim_buf_set_extmark(0, ns, 0, 0, {
  line_hl_group = 'Visual',
})
```

### 7. Retrieving Extmarks

ดึง extmarks:

```lua
local ns = vim.api.nvim_create_namespace('my_namespace')
local buf = 0

-- Get extmark by ID
local extmark = vim.api.nvim_buf_get_extmark_by_id(buf, ns, id, { details = true })

-- Get extmarks in range
local extmarks = vim.api.nvim_buf_get_extmarks(buf, ns, 0, -1, { details = true })
```

### 8. Deleting Extmarks

ลบ extmarks:

```lua
local ns = vim.api.nvim_create_namespace('my_namespace')

-- Delete by ID
vim.api.nvim_buf_del_extmark(0, ns, id)

-- Delete all in namespace
vim.api.nvim_buf_clear_namespace(0, ns, 0, -1)
```

### 9. Namespace Management

จัดการ namespaces:

```lua
-- Create namespace
local ns = vim.api.nvim_create_namespace('my_namespace')

-- Get namespace ID
local ns_id = vim.api.nvim_create_namespace('my_namespace')

-- Clear namespace
vim.api.nvim_buf_clear_namespace(0, ns, 0, -1)
```

### 10. Decorations

ใช้ extmarks สำหรับ decorations:

```lua
local ns = vim.api.nvim_create_namespace('decorations')

-- Add decoration
vim.api.nvim_buf_set_extmark(0, ns, line, col, {
  end_line = end_line,
  end_col = end_col,
  hl_group = 'Search',
  virt_text = { { 'Match', 'Comment' } },
  virt_text_pos = 'overlay',
})
```

### 11. Use Cases

#### LSP Diagnostics

```lua
-- LSP ใช้ extmarks สำหรับ diagnostics
vim.api.nvim_buf_set_extmark(0, ns, line, col, {
  end_line = end_line,
  end_col = end_col,
  severity = severity,
  message = message,
})
```

#### Git Blame

```lua
-- Git blame ใช้ extmarks สำหรับ virtual text
vim.api.nvim_buf_set_extmark(0, ns, line, 0, {
  virt_text = { { 'Author: John', 'Comment' } },
  virt_text_pos = 'right_align',
})
```

#### Breakpoints

```lua
-- Debuggers ใช้ extmarks สำหรับ breakpoints
vim.api.nvim_buf_set_extmark(0, ns, line, 0, {
  sign_text = '●',
  sign_hl_group = 'Error',
})
```

### 12. Performance

เพื่อ performance:

- ใช้ namespaces สำหรับ isolate extmarks
- Clear namespaces เมื่อไม่ใช้แล้ว
- ใช้ `virt_text_pos = 'eol'` สำหรับ text ที่ไม่ต้องการ precise positioning
- จำกัดจำนวน extmarks ต่อ buffer

### 13. Troubleshooting

#### List Extmarks

```lua
local ns = vim.api.nvim_create_namespace('my_namespace')
local extmarks = vim.api.nvim_buf_get_extmarks(0, ns, 0, -1, { details = true })
print(vim.inspect(extmarks))
```

#### Clear All Extmarks

```lua
vim.api.nvim_buf_clear_namespace(0, -1, 0, -1)
```

## Rules

- ใช้ namespaces สำหรับ isolate extmarks จาก sources ต่างกัน
- ใช้ `virt_text` สำหรับ inline annotations
- ใช้ `sign_text` สำหรับ gutter icons
- Clear namespaces เมื่อไม่ใช้แล้ว

## Expected Outcome

- Extmarks track text changes อย่างถูกต้อง
- Virtual text แสดงผลตามตำแหน่งที่ต้องการ
- Signs แสดงใน gutter
- Performance ดีเมื่อมี extmarks จำนวนมาก
