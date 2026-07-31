# Create Next.js App

Workflow for creating a Next.js application.

## Steps

1. **Create new project**
   ```bash
   npx create-next-app@latest my-app
   ```

2. **Choose options**
   - TypeScript
   - ESLint
   - Tailwind CSS
   - App Router
   - Import alias

3. **Configure project**
   - Set up dependencies
   - Configure next.config.js
   - Set up environment variables

4. **Implement pages**
   - Create app directory structure
   - Add server components
   - Add client components

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

## Example: Simple Page

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Hello Next.js!</h1>
    </main>
  );
}
```

## Best Practices

- Use App Router
- Use Server Components by default
- Optimize images
- Use proper caching
- Follow Next.js conventions
