# Environment

## Get Environment Info

```typescript
import { environment } from "@raycast/api";

console.log(environment.commandName);     // Current command name
console.log(environment.extensionName);    // Extension name
console.log(environment.homeDir);          // Home directory
console.log(environment.commandMode);     // "view" | "prompt" | "launcher"
```
