# Template Example

## Full Template

````markdown
> ![Status](https://img.shields.io/badge/status-in_development-red)

# gen-password

Short description — Longer description.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-1976d2)
![SolidJS](https://img.shields.io/badge/SolidJS-1.9-1c6fbb)

```text
┌──────────────────────────────────────────────────────────┐
│  options ──▶ charset ──▶ random ──▶ password             │
│                                                          │
│  length 16/32 ──┐                                        │
│  symbols  on ───┤─▶ pool: a-z A-Z 0-9 $#&                │
│  exclude   ─────┘      │                                 │
│                        ▼                                 │
│              crypto.getRandomValues                      │
│                        │                                 │
│                        ▼                                 │
│              "Xk9$mP2#vQr7&nL4w" ──▶ copy/display        │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Install Tools — `mise install` + `bun install`
   ```bash
   mise install
   bun install
   ```
2. Run Dev Server — `bun run dev`
   ```bash
   bun run dev
   ```
3. Build — `bun run build`
   ```bash
   bun run build
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:rocket.svg?color=%23303f9f&width=16) | Password Generation | Generate strong random passwords | Saves time and removes weak passwords | `generate()` or `bunx gen-password generate` |

## Usage

### Usage via Web

<details>
<summary>Web app click flow & layout</summary>

Open the app at `http://localhost:3001`. Click the password display to randomize and copy.

```text
┌──────────────────────────────────────────────────────────┐
│  gen-password — Password Generator                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Click to randomize & copy             Length 16/32│  │
│  │                                                    │  │
│  │             Xk9$mP2#vQr7&nL4w                       │  │
│  │                                                    │  │
│  │  [========================o======================]  │  │
│  │                     0 / 32                         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

</details>

### Usage via CLI

```bash
bunx gen-password --help
```

```text
┌──────────────────────────────────────────────────────────┐
│  $ bunx gen-password --help                              │
│                                                          │
│  USAGE                                                   │
│    gen-password <command> [options]                      │
│                                                          │
│  COMMANDS                                                │
│    generate    Generate a random password                │
│    copy        Copy the last password to clipboard       │
│                                                          │
│  OPTIONS                                                 │
│    --length    Length of the password      [default: 16] │
│    --help      Show this help message                    │
└──────────────────────────────────────────────────────────┘
```

### Usage via TUI

<details>
<summary>TUI keyboard shortcuts & layout</summary>

1. Open a terminal and run `bunx gen-password tui`
2. Use `↑`/`↓` to select an action, `Enter` to confirm, `q` to quit

```text
┌──────────────────────────────────────────────────────────┐
│  gen-password — Main Menu                                │
│                                                          │
│  > Generate password        [Enter]                      │
│    Copy to clipboard        [↑/↓]                        │
│    Settings                 [q]  quit                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

</details>

| api | description | options | default |
|-----|-------------|---------|---------|
| `generate()` | Generate a password | `length`, `uppercase`, `lowercase`, `numbers`, `symbols` | `length=16`, all enabled |

## Contributing

See CONTRIBUTING.md for development setup, conventions, and validation workflows.

## License

MIT License — see LICENSE.md
````

## Notes

- Status badge: `red` for `in development`, `brightgreen` for `active`
- No ANSI below the logo/badges in the Hero section — ANSI appears only in the Flow Diagram + Usage section
- Flow Diagram: a text codeblock drawing the working flow (input → process → output) above Get Started — never draw the file structure
- Get Started: a plain numbered list, no `###`
- Features: 5 columns (Icon, Feature, Description, Benefit, Usage)
- Usage: each method has `### Usage via ...` + text/code + ANSI drawing + a references table (if there's an API)
- Web/TUI: wrap the content in a `<details>` + `<summary>` accordion
- CLI: show the `command --help` ANSI output
- ANSI drawing: every line must be the same length — use space padding to align the right border
- Contributing: only if `CONTRIBUTING.md` exists
- License: only if `LICENSE.md` exists
- No separate `## API References`
- No ANSI at the very bottom

