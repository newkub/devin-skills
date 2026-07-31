# Integration

## External APIs

### Fetch Data

```typescript
import { environment } from "@raycast/api";

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${environment.commandName}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// Usage
const data = await fetchFromAPI<Item[]>("https://api.example.com/items");
```

### Handle API Errors

```typescript
async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    await showToast({
      title: "Error",
      message: error instanceof Error ? error.message : "Failed to fetch",
      style: Toast.Style.Failure
    });
    return null;
  }
}
```

## File System

### Read File

```typescript
import { readTextFile } from "@raycast/api";

async function readConfig() {
  try {
    const content = await readTextFile("~/.config/myapp/config.json");
    return JSON.parse(content);
  } catch (error) {
    console.error("Read error:", error);
    return null;
  }
}
```

### Write File

```typescript
import { writeTextFile, mkdir } from "@raycast/api";

async function saveData(data: object) {
  const configDir = expandPath("~/.config/myapp");
  await mkdir(configDir, { intermediates: true });

  const filePath = join(configDir, "data.json");
  await writeTextFile(filePath, JSON.stringify(data, null, 2));
}
```

## Clipboard

### Get Selected Text

```typescript
import { getSelectedText } from "@raycast/api";

export default async function Command() {
  const selectedText = await getSelectedText();
  console.log("Selected:", selectedText);
}
```

### Copy with Formatting

```typescript
import { Clipboard } from "@raycast/api";

await Clipboard.copy({
  text: "Hello",
  rtf: createRichText("Hello")
});
```

## Notifications

### Show Toast

```typescript
import { Toast } from "@raycast/api";

await Toast.show({
  title: "Success",
  message: "Item saved",
  style: Toast.Style.Success
});
```

### Show with Actions

```typescript
const toast = await Toast.show({
  title: "Processing",
  style: Toast.Style.Animated
});

// Later update
toast.hide();

// Or with buttons
await Toast.show({
  title: "Choose Action",
  message: "What would you like to do?",
  primaryAction: {
    title: "Continue",
    onAction: () => handleContinue()
  },
  secondaryAction: {
    title: "Cancel",
    onAction: () => handleCancel()
  }
});
```

## Shell Commands

### Execute Shell

```typescript
import { runShellCommand } from "@raycast/api";

const { stdout, stderr } = await runShellCommand({
  command: "echo 'Hello from shell'",
  shell: "/bin/zsh"
});

console.log(stdout);
```

### Run with Environment

```typescript
await runShellCommand({
  command: "bun run build",
  env: {
    NODE_ENV: "production",
    PATH: process.env.PATH
  }
});
```

## Open URLs

```typescript
import { open } from "@raycast/api";

// Open URL
await open("https://example.com");

// Open with options
await open("https://example.com", {
  bundleIdentifier: "com.example.app"
});
```

## Environment Variables

### Access Environment

```typescript
import { environment } from "@raycast/api";

console.log(environment.extensionName);
console.log(environment.commandName);
console.log(environment.homeDir);
console.log(environment.workspaceStorage);
```

## Preferences Integration

### Read Preferences

```typescript
import { usePreferences } from "@raycast/api";

interface Preferences {
  apiKey: string;
  theme: "light" | "dark";
}

export default function Command() {
  const { preferences } = usePreferences<Preferences>();

  return (
    <List>
      <List.Item title={`API: ${preferences.apiKey}`} />
      <List.Item title={`Theme: ${preferences.theme}`} />
    </List>
  );
}
```

### Validate on Startup

```typescript
export default function Command() {
  const { preferences, hasPreferences } = usePreferences<Preferences>();

  if (!hasPreferences) {
    return (
      <List.EmptyView
        title="Setup Required"
        description="Please configure your API key in preferences."
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url="raycast://preferences" />
          </ActionPanel>
        }
      />
    );
  }

  return <List>{/* items */}</List>;
}
```

## Local Storage

### Persist Data

```typescript
import { useLocalStorage } from "@raycast/api";

export default function Command() {
  const [count, setCount] = useLocalStorage("clickCount", 0);

  return (
    <List>
      <List.Item
        title={`Clicked ${count} times`}
        actions={
          <ActionPanel>
            <Action
              title="Increment"
              onAction={() => setCount(count + 1)}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

## Navigation

### Push New View

```typescript
import { ActionPanel, Action, NavigationStack } from "@raycast/api";

export function ParentView({ navigation }: { navigation: any }) {
  return (
    <List>
      <List.Item
        title="View Details"
        actions={
          <ActionPanel>
            <Action.Push
              title="Show Details"
              target={<DetailView navigation={navigation} />}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}

export function DetailView({ navigation }: { navigation: any }) {
  return (
    <List>
      <List.Item title="Detail content" />
    </List>
  );
}
```

## Multiple Commands

### Launch Another Command

```typescript
import { launchCommand } from "@raycast/api";

async function openSettings() {
  await launchCommand({ name: "settings", type: "user" });
}

async function searchWithQuery(query: string) {
  await launchCommand({
    name: "search",
    type: "user",
    arguments: { query }
  });
}
```

## Keyboard Shortcuts

### Register Shortcuts

```typescript
import { useKeyEquivalents } from "@raycast/api";

export default function Command() {
  useKeyEquivalents({
    onDelete: () => handleDelete(),
    onReturn: () => handleSelect(),
  });

  return <List>{/* items */}</List>;
}
```