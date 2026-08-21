# Best Practices

## Performance

- **Use lazy loading** - Load plugins on demand
- **Disable unused features** - Set `vim.opt` to reduce overhead
- **Use Lua** - Lua configs load faster than Vimscript
- **Limit history** - Set `undolevels` appropriately

```lua
-- Lazy load plugins
return {
  { 'nvim-telescope/telescope.nvim', lazy = true }
}
```

## Keyboard Shortcuts

- **Learn modal editing** - Master Normal mode
- **Use leader key** - Set `<leader>` early
- **Create custom mappings** - Speed up workflow
- **Use operators** - `c`, `d`, `y` with motions

```lua
-- Set leader
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

-- Quick save/quit
vim.keymap.set('n', '<leader>w', '<cmd>w<cr>')
vim.keymap.set('n', '<leader>q', '<cmd>q<cr>')
```

## Plugin Management

- **Use plugin manager** - lazy.nvim or packer.nvim
- **Separate configs** - Split into modules
- **Update regularly** - Keep plugins updated
- **Remove unused** - Clean up plugins

```lua
-- ~/.config/nvim/lua/plugins/
-- init.lua
return {
  { 'nvim-telescope/telescope.nvim', dependencies = { 'nvim-lua/plenary.nvim' } }
}
```

## File Operations

- **Use registers** - Store frequently used text
- **Use macros** - Automate repetitive tasks
- **Use buffers** - Switch between files quickly

```vim
" Yank to register a
"ayy

" Paste from register a
"ap

" Record macro
qa ... q
```

## Security

- **No eval** - Avoid `eval()` for security
- **Validate inputs** - Sanitize user input
- **Use secure plugins** - Review plugin permissions

## Common Pitfalls

### Wrong Mode

```vim
" Use Normal mode for commands
:wq

" Use Insert mode for typing
i
```

### Accidental Actions

```vim
" dd = delete line (not cut!)
" Use x to delete single character

" u = undo
" Ctrl+r = redo
```

### Buffer Management

```vim
" Always save before switching
:wa

" Force close without saving
:bd!

" Close all buffers
:bufdo bd
```

## Recommended Workflow

1. **Start in Normal mode**
2. **Use motions** - `w`, `b`, `0`, `$`
3. **Use operators** - `d`, `c`, `y`
4. **Use registers** - `"ay`, `"ap`
5. **Record macros** - `qa`, `@a`
6. **Use Telescope** - Find files/content

## See Also

- [Installation](./installation.md) - Setup guide
- [Configuration](./configuration.md) - Config options
