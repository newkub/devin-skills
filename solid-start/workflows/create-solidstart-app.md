# Create SolidStart App

Workflow for creating a SolidStart application.

## Steps

1. **Create new project**
   ```bash
   bun create solid-start@latest my-app
   ```

2. **Choose options**
   - TypeScript
   - SSR
   - Styling (Tailwind, UnoCSS, etc.)

3. **Configure project**
   - Set up dependencies
   - Configure app.config.ts
   - Set up environment variables

4. **Implement routes**
   - Create routes directory
   - Add page components
   - Add data loaders

5. **Run development**
   ```bash
   cd my-app
   bun run dev
   ```

6. **Build for production**
   ```bash
   bun run build
   bun start
   ```

## Example: Simple Route

```tsx
// routes/index.tsx
import { createSignal } from 'solid-js';

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <main>
      <h1>Hello SolidStart!</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count()}
      </button>
    </main>
  );
}
```

## Best Practices

- Use server functions for data
- Follow SolidJS reactivity patterns
- Optimize for SSR
- Use proper routing
