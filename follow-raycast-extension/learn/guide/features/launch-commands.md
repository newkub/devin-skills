# Launch Commands

## Launch Another Command

```typescript
import { launchCommand } from "@raycast/api";

await launchCommand({ name: "my-other-command", type: "user" });
```

## Launch with Arguments

```typescript
await launchCommand({
  name: "my-command",
  type: "user",
  arguments: { query: "search term" }
});
```
