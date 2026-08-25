# lazy.nvim Reference

## Overview

`lazy.nvim` is a modern plugin manager for Neovim. It manages all your Neovim plugins with a powerful UI, provides fast startup times via automatic caching and bytecode compilation of Lua modules, and supports automatic lazy-loading on events, commands, filetypes, and key mappings.

## Install

Bootstrap `lazy.nvim` by cloning the stable branch into your Neovim data directory:

```lua
-- ~/.config/nvim/lua/config/lazy.lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)
```

The entry point `init.lua` simply requires the config module: `require("config.lazy")`. Run `:checkhealth lazy` after installation to verify everything is working.

## Version Info

- Latest stable: `v11.17.5` (2025-11-06)
- License: Apache-2.0
- Source: https://github.com/folke/lazy.nvim
- Docs: https://lazy.folke.io

## Peer Dependencies

- Neovim `>= 0.8.0` (built with LuaJIT)
- Git `>= 2.19.0` (for partial clones support)
- a Nerd Font (optional)
- `luarocks` to install rockspecs (optional; remove `rockspec` from `opts.pkg.sources` to disable)

## Plugin Spec Format

A plugin spec is a Lua table. A valid spec defines one of a short plugin url (string), `dir`, or `url`.
### Source properties
| Property | Type | Description |
|---|---|---|
| `[1]` | `string?` | Short plugin url, expanded using `config.git.url_format` |
| `dir` | `string?` | Directory pointing to a local plugin |
| `url` | `string?` | Custom git url where the plugin is hosted |
| `name` | `string?` | Custom name for the local plugin directory and display name |
| `dev` | `boolean?` | When `true`, use a local plugin directory instead |

### Loading properties
| Property | Type | Description |
|---|---|---|
| `dependencies` | `LazySpec[]` | Plugins loaded when this plugin loads; always lazy-loaded unless specified otherwise |
| `enabled` | `boolean?` or `fun():boolean` | When `false`, plugin is not included in the spec |
| `cond` | `boolean?` or `fun(LazyPlugin):boolean` | Same as `enabled` but does not uninstall the plugin |
| `priority` | `number?` | Only for start plugins (`lazy=false`); default `50`; set high for colorschemes |
| `lazy` | `boolean?` | When `true`, lazy-load the plugin; when `false`, load on startup |

### Setup properties
| Property | Type | Description |
|---|---|---|
| `init` | `fun(LazyPlugin)` | Always executed during startup; useful for `vim.g.*` settings |
| `opts` | `table` or `fun(LazyPlugin, opts:table)` | Table merged with parent specs; passed to `config()` |
| `config` | `fun(LazyPlugin, opts:table)` or `true` | Executed when plugin loads; defaults to `require(MAIN).setup(opts)` |
| `build` | `string` or `fun(LazyPlugin)` or `boolean` | Build step executed after install/update |
| `event` | `string?` or `string[]` | Lazy-load on Neovim autocommand events |
| `cmd` | `string?` or `string[]` | Lazy-load on Vim user commands |
| `ft` | `string?` or `string[]` | Lazy-load on filetypes |
| `keys` | `string?` or `string[]` or `LazyKeysSpec[]` | Lazy-load on key mappings |

### Example specs
```lua
return {
  -- colorscheme: load during startup, high priority
  {
    "folke/tokyonight.nvim",
    lazy = false,
    priority = 1000,
    config = function() vim.cmd([[colorscheme tokyonight]]) end,
  },
  -- lazy-load on filetype
  { "nvim-neorg/neorg", ft = "norg", opts = { load = { ["core.defaults"] = {} } } },
  -- lazy-load on command
  { "dstein64/vim-startuptime", cmd = "StartupTime" },
  -- lazy-load on event with dependencies
  {
    "hrsh7th/nvim-cmp",
    event = "InsertEnter",
    dependencies = { "hrsh7th/cmp-nvim-lsp", "hrsh7th/cmp-buffer" },
    config = function() end,
  },
  -- lazy-load on keys
  {
    "Wansmer/treesj",
    keys = { { "J", "<cmd>TSJToggle<cr>", desc = "Join Toggle" } },
    opts = { use_default_keymaps = false, max_join_length = 150 },
  },
  -- local plugin via dir / custom git url
  { dir = "~/projects/secret.nvim" },
  { url = "git@github.com:folke/noice.nvim.git" },
}
```

### Versioning
Use `version`, `commit`, `tag`, or `branch` to pin plugins. The `version` property supports Semver ranges:
- `""` or `"*"`: latest stable version (excludes pre-release)
- `1.2.x`: any version starting with `1.2`
- `^1.2.3`: compatible with `1.2.3` (e.g. `1.3.0`, not `2.0.0`)
- `~1.2.3`: compatible with `1.2.3` (e.g. `1.2.4`, not `1.3.0`)

Set `config.defaults.version = ""` to install the latest stable version of plugins that support Semver.

## Configuration
### Structured setup (recommended)
```
~/.config/nvim
├── lua
│   ├── config
│   │   └── lazy.lua
│   └── plugins
│       ├── spec1.lua
│       ├── **
│       └── spec2.lua
└── init.lua
```

`init.lua` calls `require("config.lazy")`. The `lazy.lua` module bootstraps and sets up `lazy.nvim`:

```lua
require("lazy").setup({
  spec = {
    { import = "plugins" },
  },
  install = { colorscheme = { "habamax" } },
  checker = { enabled = true },
})
```

### lua/config/ directory
Place non-plugin configuration here:
- `lazy.lua`: bootstrap and `require("lazy").setup()`
- `options.lua`: foundational Neovim settings via `vim.opt`
- `keymaps.lua`: global key mappings via `vim.keymap.set`
- `autocmds.lua`: global autocommands via `vim.api.nvim_create_autocmd`

### lua/plugins/ directory
Each file in `lua/plugins/*.lua` returns a table of plugin specs and is automatically merged. Use `import` to load sub-modules:

```lua
require("lazy").setup("plugins")
-- Same as:
require("lazy").setup({ { import = "plugins" } })
```

When importing specs, override by adding a spec for the same plugin. `opts`, `dependencies`, `cmd`, `event`, `ft`, and `keys` are always merged with the parent spec; any other property overrides the parent. To lazy-load all plugins by default, set `defaults = { lazy = true }`.

`lazy-lock.json` is generated after running `:Lazy update`. Default path is `vim.fn.stdpath("config") .. "/lazy-lock.json"`.

## stylua Formatter

`stylua` is a deterministic code formatter for Lua 5.1, 5.2, 5.3, 5.4, LuaJIT, Luau, and CfxLua/FiveM Lua. It parses Lua code and reprints it from scratch, enforcing a consistent style.

### Install
```sh
cargo install stylua              # from crates.io (defaults to Lua 5.1)
cargo install stylua --features luajit
brew install stylua               # from Homebrew (macOS)
npx @johnnymorganz/stylua-bin --help  # from npm
```

Pre-built binaries with all syntax variants are available on the GitHub Releases page.

### Version Info

- Latest stable: `2.5.2`
- License: MPL-2.0
- Source: https://github.com/JohnnyMorganz/StyLua

### Usage
```sh
stylua src/ foo.lua bar.lua      # format files and directories
stylua --check .                 # check formatting (exit 1 if changes needed)
stylua -                         # format from stdin
stylua --glob '**/*.lua' -- src  # glob filtering
stylua -g '*.lua' -g '!*.spec.lua' -- .
```

### Configuration
`stylua` looks for `stylua.toml` or `.stylua.toml` starting from the directory of the file being formatted, searching upwards to the current working directory. If not found, it falls back to `.editorconfig`, then defaults.

Default `stylua.toml`:
```toml
syntax = "All"
column_width = 120
line_endings = "Unix"
indent_type = "Tabs"
indent_width = 4
quote_style = "AutoPreferDouble"
call_parentheses = "Always"
collapse_simple_statement = "Never"
space_after_function_names = "Never"
block_newline_gaps = "Never"

[sort_requires]
enabled = false
```

Options:
| Option | Default | Description |
|---|---|---|
| `syntax` | `All` | `All`, `Lua51`, `Lua52`, `Lua53`, `Lua54`, `LuaJIT`, `Luau`, `CfxLua` |
| `column_width` | `120` | Approximate line length for wrapping |
| `line_endings` | `Unix` | `Unix` (LF) or `Windows` (CRLF) |
| `indent_type` | `Tabs` | `Tabs` or `Spaces` |
| `indent_width` | `4` | Character size of single indentation |
| `quote_style` | `AutoPreferDouble` | `AutoPreferDouble`, `AutoPreferSingle`, `ForceDouble`, `ForceSingle` |
| `call_parentheses` | `Always` | `Always`, `NoSingleString`, `NoSingleTable`, `None`, `Input` |
| `space_after_function_names` | `Never` | `Never`, `Definitions`, `Calls`, `Always` |
| `block_newline_gaps` | `Never` | `Never`, `Preserve` |
| `collapse_simple_statement` | `Never` | `Never`, `FunctionOnly`, `ConditionalOnly`, `Always` |

### GitHub Actions CI
```yaml
- name: Install Stylua (Formatter)
  uses: JohnnyMorganz/stylua-action@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    args: --check .
```

## Source

- https://lazy.folke.io/installation
- https://lazy.folke.io/spec
- https://lazy.folke.io/spec/examples
- https://lazy.folke.io/spec/lazy_loading
- https://lazy.folke.io/usage/structuring
- https://github.com/folke/lazy.nvim
- https://github.com/folke/lazy.nvim/releases
- https://github.com/JohnnyMorganz/StyLua
- https://github.com/JohnnyMorganz/StyLua/releases
