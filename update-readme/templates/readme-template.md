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

| Icon | Feature | Description |
|:---:|---------|-------------|
| ![icon](https://api.iconify.design/mdi:rocket.svg?color=%23303f9f&width=16) | Password Generation | Generate strong random passwords |

## Usage

### Usage via Web

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

### Usage via CLI

```bash
bunx gen-password generate --length 16
```

```text
┌──────────────────────────────────────────────────────────┐
│  $ bunx gen-password generate --length 16                │
│  Xk9$mP2#vQr7&nL4w                                       │
│  ✓ Copied to clipboard                                   │
└──────────────────────────────────────────────────────────┘
```

| api | description | options | default |
|-----|-------------|---------|---------|
| `generate()` | Generate a password | `length`, `uppercase`, `lowercase`, `numbers`, `symbols` | `length=16`, all enabled |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, conventions, and validation workflows.

## License

MIT License — see [LICENSE.md](LICENSE.md)
````

## Notes

- Status badge: `red` for `in development`, `brightgreen` for `active`
- ไม่มี ANSI ใต้ logo/badges ใน Hero section — ANSI อยู่ที่ Usage section เท่านั้น
- UI Sketch: text codeblock วาด layout ด้านบน Get Started
- Get Started: numbered list ตรงๆ ไม่มี `###`
- Features: 3 columns (Icon, Feature, Description)
- Usage: แต่ละ method มี `### Usage via ...` + text/code + ANSI drawing + references table (ถ้ามี API)
- ANSI drawing: ทุกบรรทัดต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- Contributing: มีเฉพาะถ้ามี `CONTRIBUTING.md`
- License: มีเฉพาะถ้ามี `LICENSE.md`
- ไม่มี `## API References` แยก
- ไม่มี ANSI ด้านล่างสุด
