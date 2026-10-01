# CLI Explorer Prototype Spec

Canonical spec สำหรับ prototype ที่ `/design-cli-prototype` สร้าง — ทุกอย่าง derive จาก typed schema เดียว

## Command Schema

```ts
type Command = {
  name: string
  description: string
  usage: string
  arguments: Argument[]
  options: Option[]
  examples: Example[]
  exitCodes?: ExitCode[]
  relatedCommands?: string[]
}

type Argument = {
  name: string
  description: string
  required: boolean
  type: 'string' | 'number' | 'enum'
  choices?: string[]
}

type Option = {
  name: string          // long flag เช่น --port
  alias?: string        // เช่น -p
  description: string
  type: 'boolean' | 'string' | 'number' | 'enum'
  default?: string | number | boolean
  choices?: string[]
}

type Example = { command: string; description: string }
type ExitCode = { code: number; meaning: string }
```

## Modes

```text
CLI Schema
│
├── Human Mode
│   ├── Syntax      — tokenized command signature
│   ├── Builder     — toggle args/options → live command string
│   ├── Inspector   — selected token detail panel
│   ├── Terminal    — example runs + simulated output
│   └── Examples    — copyable command recipes
│
└── Agent Mode
    ├── Markdown    — generated docs จาก schema
    ├── Raw         — JSON schema dump
    └── Copy        — clipboard actions
```

Markdown ต้อง generate programmatically จาก schema — ห้าม hand-write

## Routing

```text
/commands/run
/commands/build
/commands/dev
/commands/deploy
/plugins
/plugins/cloudflare
/presets
/presets/production
/config
```

Query params:

- `?mode=human` / `?mode=agent` — display mode
- `?preset=production&port=8080` — shareable command-builder state (serialize builder state เข้า query)

## Responsive

| Breakpoint | Layout |
|------------|--------|
| Desktop | `Sidebar | Documentation | Inspector` |
| Tablet | `Sidebar | Documentation` |
| Mobile | `Header` + `Command` + `Documentation` + `Bottom Navigation` |

Hover interactions ทุกตัวต้องมี click/tap equivalent — ห้าม rely on hover เพียงอย่างเดียว

## Accessibility

- semantic HTML (`nav`, `main`, `aside`, `article`, headings ถูกลำดับ)
- keyboard navigation ครบ (Tab order, Enter/Space activate, Esc ปิด dialog, arrow keys ใน sidebar/search)
- focus states ชัดเจนผ่าน `focus-ring` shortcut
- ARIA labels บน interactive elements, `aria-current` บน active nav
- accessible tooltips (`aria-describedby`, เปิดด้วย focus ได้ไม่ใช่แค่ hover)
- accessible dialogs (`role="dialog"`, `aria-modal`, focus trap, return focus on close)
- `prefers-reduced-motion` — ปิด/ลด animations
- screen-reader-friendly command structure (`<code>`, `<kbd>`, token labels)
- contrast เพียงพอ (WCAG AA)

## Component Architecture

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── CommandSyntax.tsx
│   ├── CommandToken.tsx
│   ├── CommandInspector.tsx
│   ├── CommandBuilder.tsx
│   ├── OptionExplorer.tsx
│   ├── ArgumentExplorer.tsx
│   ├── ExampleTerminal.tsx
│   ├── Terminal.tsx
│   ├── PluginExplorer.tsx
│   ├── PresetExplorer.tsx
│   ├── ConfigExplorer.tsx
│   ├── SearchDialog.tsx
│   ├── ModeSwitcher.tsx
│   ├── AgentMarkdown.tsx
│   ├── MarkdownToolbar.tsx
│   └── StickyCommandBar.tsx
├── data/
│   ├── commands.ts
│   ├── plugins.ts
│   ├── presets.ts
│   └── config.ts
├── lib/
│   ├── command-builder.ts
│   ├── markdown-generator.ts
│   ├── command-parser.ts
│   └── search.ts
├── routes/
│   ├── index.tsx
│   ├── commands/
│   ├── plugins/
│   ├── presets/
│   └── config/
└── app.tsx
```

SolidJS: `createSignal`, `createMemo`, `createEffect`, `createStore`; Context เฉพาะที่ justify จริง — หลีกเลี่ยง global state ที่ไม่จำเป็น

## UnoCSS Styling

Reusable shortcuts สำหรับ recurring patterns:

```text
surface          surface-hover    code-surface
command-token    option-token     muted-text
interactive      focus-ring
```

Variants: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`, `dark:` + responsive `sm:` `md:` `lg:` `xl:`

Arbitrary values เฉพาะที่เพิ่ม precision จริง — ห้าม scatter styles

## Microinteractions

- token hover + token selection
- tooltip transitions
- copy feedback (icon swap + "copied" state)
- command execution feedback
- terminal output animation
- active sidebar indicator (slide/highlight)
- search dialog transitions
- preset selection
- option toggling
- Human ↔ Agent mode transition

Animations: fast, subtle, purposeful — ห้ามเสีย performance เพื่อ effects

## Error States

Realistic states ที่ต้อง render ได้จริง:

```text
Invalid command:
  Command not found
  Try: run build dev deploy

Invalid option:
  Unknown option --foo
  Did you mean: --port --host --plugin

Invalid configuration:
  Invalid configuration
  --port must be between 1 and 65535

Execution error:
  ✕ Command failed
  Plugin "cloudflare" could not be initialized.
```

## Default Dataset

เมื่อ user ไม่ระบุ CLI — ใช้ commands `run`, `build`, `dev`, `deploy` พร้อม options สมจริง (`--port`, `--host`, `--preset`, `--watch`, `--plugin`), plugins (`cloudflare`), presets (`production`), config sections

## Core UX Principle

```text
Humans explore the CLI visually.
Agents consume the CLI structurally.
```

| Mode | Optimize for |
|------|--------------|
| Human | Discovery, Understanding, Interaction, Experimentation |
| Agent | Structure, Precision, Determinism, Copyability, Machine consumption |

ทั้งสอง experiences ต้อง originate จาก typed CLI schema เดียวกัน
