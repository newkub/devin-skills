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
│  [shield-lock]  Password Generator                       │
│  Create strong, secure, and random passwords             │
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
- ไม่มี ANSI ใต้ logo/badges ใน Hero section — ANSI อยู่ที่ Usage section เท่านั้น
- UI Sketch: text codeblock วาด layout ด้านบน Get Started
- Get Started: numbered list ตรงๆ ไม่มี `###`
- Features: 5 columns (Icon, Feature, Description, Benefit, Usage)
- Usage: แต่ละ method มี `### Usage via ...` + text/code + ANSI drawing + references table (ถ้ามี API)
- Web/TUI: ห่มเนื้อหาด้วย `<details>` + `<summary>` accordion
- CLI: แสดง `command --help` ANSI output
- ANSI drawing: ทุกบรรทัดต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- Contributing: มีเฉพาะถ้ามี `CONTRIBUTING.md`
- License: มีเฉพาะถ้ามี `LICENSE.md`
- ไม่มี `## API References` แยก
- ไม่มี ANSI ด้านล่างสุด
