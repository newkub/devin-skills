# CLI Explorer Prototype Spec

Canonical spec for the prototype built by `/design-cli-prototype` — everything derives from one typed schema

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
  name: string          // long flag, e.g. --port
  alias?: string        // e.g. -p
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
    ├── Markdown    — generated docs from the schema
    ├── Raw         — JSON schema dump
    └── Copy        — clipboard actions
```

Markdown must be generated programmatically from the schema — never hand-write it

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
- `?preset=production&port=8080` — shareable command-builder state (serialize builder state into the query)

## Responsive

| Breakpoint | Layout |
|------------|--------|
| Desktop | `Sidebar | Documentation | Inspector` |
| Tablet | `Sidebar | Documentation` |
| Mobile | `Header` + `Command` + `Documentation` + `Bottom Navigation` |

Every hover interaction must have a click/tap equivalent — never rely on hover alone

## Accessibility

- semantic HTML (`nav`, `main`, `aside`, `article`, ordered headings)
- full keyboard navigation (Tab order, Enter/Space activate, Esc closes dialogs, arrow keys in sidebar/search)
- clear focus states via the `focus-ring` shortcut
- ARIA labels on interactive elements, `aria-current` on the active nav
- accessible tooltips (`aria-describedby`, openable by focus, not only hover)
- accessible dialogs (`role="dialog"`, `aria-modal`, focus trap, return focus on close)
- `prefers-reduced-motion` — disable/reduce animations
- screen-reader-friendly command structure (`<code>`, `<kbd>`, token labels)
- sufficient contrast (WCAG AA)

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

SolidJS: `createSignal`, `createMemo`, `createEffect`, `createStore`; use Context only where genuinely justified — avoid unnecessary global state

## UnoCSS Styling

Reusable shortcuts for recurring patterns:

```text
surface          surface-hover    code-surface
command-token    option-token     muted-text
interactive      focus-ring
```

Variants: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`, `dark:` + responsive `sm:` `md:` `lg:` `xl:`

Arbitrary values only where they genuinely add precision — never scatter styles

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

Animations: fast, subtle, purposeful — never sacrifice performance for effects

## Error States

Realistic states that must actually render:

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

When the user does not specify a CLI — use the commands `run`, `build`, `dev`, `deploy` with realistic options (`--port`, `--host`, `--preset`, `--watch`, `--plugin`), plugins (`cloudflare`), presets (`production`), config sections

## Core UX Principle

```text
Humans explore the CLI visually.
Agents consume the CLI structurally.
```

| Mode | Optimize for |
|------|--------------|
| Human | Discovery, Understanding, Interaction, Experimentation |
| Agent | Structure, Precision, Determinism, Copyability, Machine consumption |

Both experiences must originate from the same typed CLI schema
