# Quick Start

สร้าง Raycast extension แรกของคุณใน 5 นาที

## 1. Install Raycast CLI

```bash
bun install -g @raycast/api
```

## 2. Create Extension

```bash
raycast create my-first-extension
cd my-first-extension
```

## 3. Explore Structure

```
my-first-extension/
├── package.json
├── manifest.json
├── src/
│   └── index.tsx
├── assets/
│   └── icon.png
└── tsconfig.json
```

## 4. Edit Manifest

```json
// manifest.json
{
  "manifestVersion": 1,
  "name": "My First Extension",
  "version": "1.0.0",
  "description": "My first Raycast extension",
  "icon": "assets/icon.png",
  "commands": [
    {
      "name": "hello",
      "title": "Hello World",
      "mode": "view"
    }
  ]
}
```

## 5. Write Command

```typescript
// src/index.tsx
import { List, ActionPanel, Action } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Say Hello"
        actions={
          <ActionPanel>
            <Action
              title="Greet"
              onAction={() => console.log("Hello!")}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

## 6. Run Development

```bash
raycast dev
```

## 7. Test Extension

1. Open Raycast (⌘ + Space)
2. Type "hello"
3. Press Enter to run

## Example: List with Search

```typescript
// src/index.tsx
import { useState, useEffect } from "react";
import { List } from "@raycast/api";

interface Item {
  id: string;
  name: string;
}

export default function Command() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Simulated data
    setItems([
      { id: "1", name: "Apple" },
      { id: "2", name: "Banana" },
      { id: "3", name: "Orange" }
    ]);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <List
      searchText={search}
      onSearchTextChange={setSearch}
      navigationTitle="Fruits"
    >
      {filteredItems.map((item) => (
        <List.Item key={item.id} title={item.name} />
      ))}
    </List>
  );
}
```

## Example: Form

```typescript
// src/index.tsx
import { Form } from "@raycast/api";

export default function Command() {
  return (
    <Form>
      <Form.TextField title="Name" placeholder="Your name" />
      <Form.TextField title="Email" placeholder="email@example.com" />
      <Form.Checkbox title="Subscribe" label="Subscribe to newsletter" />
    </Form>
  );
}
```

## Example: Actions

```typescript
import { Action, ActionPanel, List, Clipboard, open } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Documentation"
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url="https://docs.example.com" />
            <Action.CopyToClipboard content="https://docs.example.com" />
            <Action title="Show Info" onAction={() => alert("Info!")} />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

## Example: Launch Another Command

```typescript
import { launchCommand } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Open Settings"
        actions={
          <ActionPanel>
            <Action
              title="Open"
              onAction={() =>
                launchCommand({ name: "settings", type: "user" })
              }
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ components และ state
- [Features](features.md) - เรียนรู้ features ต่างๆ
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี