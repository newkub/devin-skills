# Ecosystem - SolidStart

## Official Libraries

### Solid Router

Official router สำหรับ SolidJS:

```bash
bun add @solidjs/router
```

**Features:**
- File-based routing
- Nested routes
- Dynamic routes
- Route params
- Query params

### Solid Meta

Metadata management:

```bash
bun add @solidjs/meta
```

**Usage:**
```typescript
import { Meta } from "@solidjs/meta";

export default function Page() {
  return (
    <>
      <Meta title="My Page" />
      <div>Content</div>
    </>
  );
}
```

## UI Libraries

### Kobalte

Headless UI components:

```bash
bun add @kobalte/core
```

**Features:**
- Accessible components
- Unstyled
- Customizable

### Shadcn Solid

Shadcn components สำหรับ Solid:

```bash
bun add @shadcn-solid/ui
```

**Features:**
- Beautiful components
- Tailwind CSS
- TypeScript support

### Solid UI

Official UI library:

```bash
bun add solid-ui
```

## Data Fetching

### Solid Query

TanStack Query สำหรับ Solid:

```bash
bun add @tanstack/solid-query
```

**Usage:**
```typescript
import { createQuery } from "@tanstack/solid-query";

const query = createQuery(() => ({
  queryKey: ["users"],
  queryFn: fetchUsers,
}));
```

## Forms

### Modular Forms

Form library สำหรับ Solid:

```bash
bun add @modular-forms/solid
```

**Features:**
- Type-safe forms
- Validation
- Nested forms

## State Management

### Solid Store

Built-in state management:

```typescript
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  user: { name: "" },
});
```

## Testing

### Solid Testing Library

Component testing:

```bash
bun add -D solid-testing-library
```

**Usage:**
```typescript
import { render, screen } from "solid-testing-library";
import Counter from "./Counter";

test("increments count", () => {
  render(() => <Counter />);
  const button = screen.getByText("Increment");
  button.click();
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

## Deployment

### Vercel

Deploy ได้ทันที:

```bash
bunx vercel
```

### Netlify

Deploy ได้ทันที:

```bash
bunx netlify-cli deploy
```

### Cloudflare Pages

Deploy ได้ทันที:

```bash
bunx wrangler pages deploy
```

## Development Tools

### TypeScript Plugin

```bash
bun add -D typescript-plugin-solid-js
```

ตั้งค่าใน `tsconfig.json`:
```json
{
  "compilerOptions": {
    "plugins": [{ "name": "typescript-plugin-solid-js" }]
  }
}
```

### ESLint Plugin

```bash
bun add -D eslint-plugin-solid
```

### Prettier Plugin

```bash
bun add -D prettier-plugin-solid
```

## Community Resources

### Discord

https://discord.com/invite/solidjs

### GitHub

https://github.com/solidjs/solid-start

### Documentation

https://docs.solidjs.com/solid-start

## Examples

### Official Examples

https://github.com/solidjs/solid-start/tree/main/examples

### Community Projects

https://github.com/solidjs/solid-start/discussions/categories/show-and-tell
