---
title: Remote Development Principles
description: หลักการใช้งาน Neovim สำหรับ Remote Development
---

## Goal

ใช้งาน Neovim สำหรับ remote development ด้วย SSH, remote plugins, และ headless mode

## Scope

ใช้สำหรับการเชื่อมต่อ remote servers, remote file editing, และ remote workflows

## Execute

### 1. Remote Editing

#### Edit Remote Files

แก้ไขไฟล์ remote ด้วย SCP:

```vim
:e scp://user@host/path/to/file
```

#### Edit with SSH

ใช้ SSH สำหรับ remote editing:

```vim
:e sftp://user@host/path/to/file
```

### 2. Neovim Remote

#### Install nvim-remote

ติดตั้ง nvim-remote:

```bash
pip install neovim-remote
```

#### Use nvim-remote

ใช้ nvim-remote:

```bash
# Attach to running nvim instance
nvr --remote-expr 'getcwd()'

# Send command to running nvim
nvr --remote-send ':w<CR>'
```

### 3. Headless Mode

#### Run Neovim Headless

รัน Neovim ใน headless mode:

```bash
nvim --headless +PlugInstall +qa
```

#### Use for Scripts

ใช้สำหรับ scripts:

```bash
nvim --headless -s script.lua file.txt
```

### 4. Remote Plugins

#### RPC API

ใช้ RPC API สำหรับ remote plugins:

```python
# Python remote plugin
import pynvim

@pynvim.plugin
class MyPlugin:
    @pynvim.command('MyCommand')
    def my_command(self, nvim):
        nvim.command('echo "Hello from Python"')
```

#### Node.js Remote Plugin

ใช้ Node.js สำหรับ remote plugins:

```javascript
// Node.js remote plugin
const attach = require('neovim').attach;

attach({ socket: '/tmp/nvim.sock' }, (err, nvim) => {
  nvim.command('echo "Hello from Node.js"');
});
```

### 5. SSH Configuration

#### SSH Config

ตั้งค่า SSH:

```ssh
Host remote
  HostName example.com
  User user
  IdentityFile ~/.ssh/id_rsa
```

#### Use SSH Config

ใช้ SSH config:

```vim
:e scp://remote/path/to/file
```

### 6. Tmux Integration

#### Use with Tmux

ใช้ Neovim กับ tmux:

```bash
# Start tmux session
tmux new -s dev

# Attach to session
tmux attach -t dev
```

#### Tmux Keybindings

ตั้งค่า keybindings สำหรับ tmux:

```lua
-- Navigate tmux panes
vim.keymap.set('n', '<C-h>', '<Cmd>TmuxNavigateLeft<CR>')
vim.keymap.set('n', '<C-j>', '<Cmd>TmuxNavigateDown<CR>')
vim.keymap.set('n', '<C-k>', '<Cmd>TmuxNavigateUp<CR>')
vim.keymap.set('n', '<C-l>', '<Cmd>TmuxNavigateRight<CR>')
```

### 7. Docker Integration

#### Edit Docker Files

แก้ไขไฟล์ใน Docker:

```vim
:e docker://container/path/to/file
```

#### Docker Compose

ใช้กับ Docker Compose:

```bash
# Start container
docker-compose up

# Edit files
nvim docker-compose.yml
```

### 8. Remote LSP

#### LSP over SSH

ใช้ LSP บน remote:

```lua
lspconfig.tsserver.setup({
  cmd = { 'ssh', 'remote', 'tsserver' },
})
```

#### Remote Language Servers

ตั้งค่า remote language servers:

```lua
lspconfig.pyright.setup({
  cmd = { 'ssh', 'remote', 'pyright-langserver' },
})
```

### 9. Synchronization

#### Sync Configuration

Sync configuration ไปยัง remote:

```bash
# Copy init.lua
scp ~/.config/nvim/init.lua remote:~/.config/nvim/

# Copy plugins
scp -r ~/.local/share/nvim remote:~/.local/share/
```

#### Use Git

ใช้ Git สำหรับ dotfiles:

```bash
# Clone dotfiles
git clone git@github.com:user/dotfiles.git ~/.config/nvim
```

### 10. Performance

#### Optimize Remote Connection

ปรับปรุง performance:

```bash
# Use SSH multiplexing
ControlMaster auto
ControlPath ~/.ssh/master-%r@%h:%p
```

#### Reduce Latency

ลด latency:

```lua
-- Disable features over SSH
vim.opt.updatetime = 1000
vim.opt.timeoutlen = 1000
```

### 11. Troubleshooting

#### Check Connection

ตรวจสอบ connection:

```bash
# Test SSH
ssh remote

# Test nvim-remote
nvr --server $NVIM_LISTEN_ADDRESS
```

#### Debug Remote Plugins

Debug remote plugins:

```lua
-- Enable logging
vim.log.set_level(vim.log.levels.DEBUG)
```

## Rules

- ใช้ SSH multiplexing สำหรับ performance
- ใช้ nvim-remote สำหรับ automation
- ใช้ headless mode สำหรับ scripts
- Sync configuration ด้วย Git

## Expected Outcome

- Remote editing ทำงานได้อย่างราบรื่น
- Remote plugins ทำงานได้อย่างถูกต้อง
- Performance ดีบน remote connections
- Configuration sync อัตโนมัติ
