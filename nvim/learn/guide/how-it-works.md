# How It Works

## Architecture

Neovim มี architecture ที่แบ่งเป็น layers:

```
┌─────────────────────────────────────┐
│            Neovim Architecture        │
├─────────────────────────────────────┤
│  UI Layer (TUI, GUI, Remote)          │
├─────────────────────────────────────┤
│  Core Editor (Buffer, Window, Tab)    │
├─────────────────────────────────────┤
│  Vimscript/Lua Plugin Host           │
├─────────────────────────────────────┤
│  Event Loop & Async Runtime           │
├─────────────────────────────────────┤
│  Platform Abstraction (OS APIs)       │
└─────────────────────────────────────┘
```

## Workflow

1. **Start** - `nvim` launches and loads init.lua
2. **Configure** - Load plugins and settings
3. **Edit** - Open files in buffers
4. **Navigate** - Use modes and commands
5. **Terminal** - Access built-in terminal
6. **Plugins** - Extend functionality

## Key Concepts

### Event Loop

Neovim มี built-in event loop สำหรับ async operations:

```lua
vim.loop.new_timer():start(1000, 1000, function()
  print("Timer fired")
end)
```

### RPC Framework

Neovim มี built-in RPC สำหรับ remote plugins:

```
┌─────────────────────────────────────┐
│         Neovim RPC Architecture       │
├─────────────────────────────────────┤
│  Nvim ←→ msgpack-rpc ←→ Plugins      │
│  Nvim ←→ msgpack-rpc ←→ LSP          │
│  Nvim ←→ msgpack-rpc ←→ UI           │
└─────────────────────────────────────┘
```

### Plugin Host

| Type | Language | Host |
|------|----------|------|
| Lua | Lua | Built-in |
| Vimscript | VimL | Built-in |
| Remote | Any | msgpack-rpc |
| External | Any | stdio |

## Key Technologies

- **msgpack** - Efficient binary serialization
- **libuv** - Async I/O for plugins
- **Treesitter** - Incremental parsing
- **LSP** - Language Server Protocol
- **RPC** - Remote Procedure Call

## See Also

- [Modal Editing](../key-concepts/modal-editing.md) - Core concepts
- [Features](./features.md) - Feature details
- [Configuration](./configuration.md) - Configuration