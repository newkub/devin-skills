---
title: RPC API
description: RPC API สำหรับ communication ระหว่าง Neovim และ external processes
---

## Goal

ใช้ RPC API สำหรับ remote plugins, automation, และ integration กับ external tools

## Scope

ใช้สำหรับ msgpack-rpc, channels, และ remote plugin development

## Execute

### 1. What is RPC?

RPC (Remote Procedure Call) ใน Neovim ใช้ msgpack-rpc protocol:

- **msgpack-rpc**: Binary serialization format
- **Channels**: Communication channels ระหว่าง Neovim และ external processes
- **Remote Plugins**: Plugins ที่ run ใน external processes
- **Bidirectional**: Neovim สามารถ call external functions และ external processes สามารถ call Neovim API

### 2. Channel Types

ตาราง channel types:

| Type | Description | Use Case |
|------|-------------|----------|
| `rpc` | RPC channel | Remote plugins |
| `job` | Job channel | Running commands |
| `stdio` | Stdio channel | Process I/O |
| `socket` | Socket channel | Network communication |

### 3. Creating Channels

สร้าง channels:

```lua
-- RPC channel
local chan = vim.fn.jobstart({'python', 'plugin.py'}, {
  rpc = true,
})

-- Job channel
local chan = vim.fn.jobstart('ls -la', {
  on_stdout = function(_, data, _)
    print(table.concat(data, '\n'))
  end,
})
```

### 4. RPC Methods

เรียก RPC methods:

```lua
-- Call remote method
vim.rpcrequest(chan, 'method_name', arg1, arg2, function(err, result)
  if err then
    print('Error:', err)
  else
    print('Result:', result)
  end
end)

-- Notify (no response)
vim.rpcnotify(chan, 'method_name', arg1, arg2)
```

### 5. Remote Plugin Structure

โครงสร้าง remote plugin:

```python
# Python remote plugin
import pynvim

@pynvim.plugin
class MyPlugin:
    def __init__(self, nvim):
        self.nvim = nvim

    @pynvim.command('MyCommand', nargs='*')
    def my_command(self, nvim, args):
        nvim.command('echo "Hello from Python"')

    @pynvim.autocmd('BufEnter', pattern='*.py')
    def on_buf_enter(self, nvim):
        nvim.command('echo "Python file opened"')
```

### 6. Node.js Remote Plugin

Node.js remote plugin:

```javascript
const attach = require('neovim').attach;

attach({ socket: '/tmp/nvim.sock' }, (err, nvim) => {
  if (err) return console.error(err);

  nvim.subscribe('BufEnter', (err, res) => {
    if (err) return console.error(err);
    console.log('Buffer entered:', res);
  });
});
```

### 7. Built-in RPC Functions

Functions ที่ built-in:

```lua
-- Request
vim.rpcrequest(chan, 'method', ...args, callback)

-- Notify
vim.rpcnotify(chan, 'method', ...args)

-- Job control
vim.fn.jobstart(cmd, opts)
vim.fn.jobstop(job_id)
```

### 8. Channel Options

ตาราง channel options:

| Option | Type | Description |
|--------|------|-------------|
| `rpc` | boolean | Enable RPC |
| `on_stdout` | function | Stdout callback |
| `on_stderr` | function | Stderr callback |
| `on_exit` | function | Exit callback |
| `cwd` | string | Working directory |
| `env` | table | Environment variables |

### 9. Error Handling

จัดการ errors:

```lua
vim.rpcrequest(chan, 'method', args, function(err, result)
  if err then
    print('RPC Error:', err)
    -- Handle error
  else
    -- Handle result
  end
end)
```

### 10. Troubleshooting

#### Check Channel Status

```lua
local status = vim.fn.jobwait(job_id, 0)
print('Channel status:', status)
```

#### Debug RPC

```lua
-- Enable RPC logging
vim.rpcrequest(chan, 'nvim_command', 'echo "Debug"')
```

## Rules

- ใช้ `vim.rpcrequest` สำหรับ methods ที่ต้องการ response
- ใช้ `vim.rpcnotify` สำหรับ methods ที่ไม่ต้องการ response
- ใช้ callbacks สำหรับ async operations
- จัดการ errors อย่างเหมาะสม

## Expected Outcome

- RPC communication ทำงานได้อย่างถูกต้อง
- Remote plugins ทำงานได้อย่างราบรื่น
- Integration กับ external tools
- Error handling ที่ robust
