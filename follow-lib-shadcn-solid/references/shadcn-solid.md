# shadcn-solid (shadcn/ui port for SolidJS)

## Source

- GitHub: https://github.com/hngngn/shadcn-solid
- Documentation: https://shadcn-solid.netlify.app
- CLI Docs: https://shadcn-solid.com/docs/cli

## Overview

`shadcn-solid` is an unofficial community-led SolidJS port of `shadcn/ui`. It provides accessible, customizable components using a copy-to-own pattern — component source code is copied directly into your project, not installed as a dependency.

Built on Kobalte primitives for accessibility. Styled with Tailwind CSS or UnoCSS.

## Version

- CLI: `shadcn-solid@0.7.7` (latest stable on npm)

## Installation

### Using CLI (Recommended)

```bash
# Initialize configuration in an existing SolidStart/Vite project
npx shadcn-solid@latest init
```

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.cjs`, and sets up CSS variables. You will be asked to configure `components.json`:

- CSS framework: `TailwindCSS` or `UnoCSS`
- Base color (e.g. `Slate`)
- Global CSS file location (e.g. `src/app.css`)
- CSS variables for colors: `Yes`
- Tailwind prefix (leave blank if none)
- `tailwind.config.cjs` location
- Import alias for components: `@/components`
- Import alias for utils: `@/lib/utils`

### Adding Components

```bash
# Add a single component
npx shadcn-solid@latest add button

# Add multiple components
npx shadcn-solid@latest add button card dialog

# Add all components
npx shadcn-solid@latest add --all

# Overwrite existing component
npx shadcn-solid@latest add button --overwrite
```

### CLI Commands

| Command | Description |
|---------|-------------|
| `npx shadcn-solid@latest init` | Initialize configuration and dependencies |
| `npx shadcn-solid@latest add [component]` | Add components to project |
| `npx shadcn-solid@latest add --all` | Install all components |
| `npx shadcn-solid@latest add --overwrite` | Overwrite existing files |

### Manual Installation

Install required dependencies for Tailwind CSS:

```bash
bun add class-variance-authority clsx tailwind-merge
```

Create `src/lib/cva.ts`:

```ts
import { defineConfig } from "cva"
import { twMerge } from "tailwind-merge"

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
})
```

## Usage

After adding a component, import it from `@/components/ui/`:

```tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

## SolidStart Integration

### Create Project

```bash
pnpm create solid@latest
# Select tailwind or uno template
```

### Configure Alias

```ts
// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },
});
```

### `tsconfig.json` Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## `components.json`

The `components.json` file is optional — only required if using the CLI. The CLI uses these values and `paths` from `tsconfig.json` to place generated components correctly.

Created automatically by `npx shadcn-solid@latest init`.

## Available Components

Accordion, Alert, Alert Dialog, Badge, Breadcrumbs, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, File Field, Hover Card, Kbd, Menubar, Navigation Menu, Number Field, OTP Field, Pagination, Popover, Progress, Radio Group, Resizable, Search, Segmented Control, Select, Separator, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Text Field, Toggle Group, Toggle Button, Tooltip.

## Key Concepts

- Copy-to-own: Component source is copied into `src/components/ui/` — you own and customize the code
- Accessible primitives: Built on Kobalte for WAI-ARIA compliance
- Tailwind CSS / UnoCSS: Styled with utility classes, customizable via CSS variables
- No dependency lock-in: No `@shadcn/core` package to install — components are plain source files

## License

MIT
