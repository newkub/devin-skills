# Create SvelteKit App

Workflow สำหรับสร้าง SvelteKit application

## Steps

1. Create new project
   ```bash
   bun create svelte@latest my-app
   ```

2. Choose options
   - Skeleton project
   - TypeScript
   - ESLint
   - Prettier
   - Playwright
   - Vitest

3. Configure project
   - Set up dependencies
   - Configure svelte.config.js
   - Set up environment variables

4. Implement routes
   - Create routes directory
   - Add page components
   - Add load functions

5. Run development
   ```bash
   cd my-app
   bun run dev
   ```

6. Build for production
   ```bash
   bun run build
   bun run preview
   ```

## Example: Simple Route

```svelte
<!-- routes/+page.svelte -->
<script>
  let count = 0;
</script>

<main>
  <h1>Hello SvelteKit!</h1>
  <button on:click={() => count += 1}>
    Count: {count}
  </button>
</main>
```

## Best Practices

- ใช้ load functions สำหรับ data
- Follow Svelte patterns
- Optimize สำหรับ SSR
- ใช้ proper routing
- ใช้ `bun add` หรือ `bun add -D` สำหรับ dependencies
