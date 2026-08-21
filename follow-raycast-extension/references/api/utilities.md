# Utilities

## Toast

```typescript
import { Toast, showToast } from "@raycast/api";

// Show toast
await Toast.show({
  title: "Success",
  message: "Operation completed",
  style: Toast.Style.Success
});

// Error
await Toast.show({
  title: "Error",
  message: "Something went wrong",
  style: Toast.Style.Failure
});

// Animated (loading)
const toast = await Toast.show({
  title: "Loading...",
  style: Toast.Style.Animated
});
toast.hide();
```

## Clipboard

```typescript
import { Clipboard } from "@raycast/api";

// Copy text
await Clipboard.copy("Hello");

// Copy with options
await Clipboard.copy({
  text: "Hello",
  rtf: richTextData
});
```

## getSelectedText

```typescript
import { getSelectedText } from "@raycast/api";

const text = await getSelectedText();
```

## open

```typescript
import { open } from "@raycast/api";

// Open URL
await open("https://example.com");

// Open with bundle ID
await open("https://example.com", {
  bundleIdentifier: "com.example.app"
});
```

## launchCommand

```typescript
import { launchCommand } from "@raycast/api";

// Launch command
await launchCommand({ name: "my-command", type: "user" });

// With arguments
await launchCommand({
  name: "search",
  type: "user",
  arguments: { query: "search term" }
});
```

## runShellCommand

```typescript
import { runShellCommand } from "@raycast/api";

const { stdout, stderr } = await runShellCommand({
  command: "echo 'Hello'",
  shell: "/bin/zsh",
  env: { KEY: "value" }
});
```

## environment

```typescript
import { environment } from "@raycast/api";

environment.extensionName   // Extension name
environment.commandName     // Current command name
environment.homeDir         // Home directory
environment.workspaceStorage // Workspace storage path
```

## Cache

```typescript
import { useCache } from "@raycast/api";

const { get, set, clear } = useCache();

await set("key", "value");
const value = await get("key");
await clear();
```
