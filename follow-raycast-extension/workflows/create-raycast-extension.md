# Create Raycast Extension

Workflow for creating a Raycast extension.

## Steps

1. **Install Raycast CLI**
   ```bash
   bun install -g @raycast/api
   ```

2. **Create new extension**
   ```bash
   npx @raycast/api@latest create
   ```

3. **Choose template**
   - Blank
   - List
   - Form
   - Command

4. **Configure package.json**
   - Set extension name
   - Add commands
   - Configure permissions

5. **Implement commands**
   - Create command functions
   - Build UI components
   - Add actions

6. **Test locally**
   ```bash
   bun run dev
   ```

7. **Build for production**
   ```bash
   bun run build
   ```

8. **Publish to store**
   ```bash
   npx @raycast/api@latest publish
   ```

## Example: Simple Command

```typescript
import { LaunchProps, showToast, Toast } from "@raycast/api";

export default async function Command(props: LaunchProps) {
  await showToast({
    style: Toast.Style.Success,
    title: "Hello Raycast!",
  });
}
```

## Best Practices

- Use TypeScript
- Follow Raycast design guidelines
- Test on different screen sizes
- Handle errors gracefully
- Use proper permissions
