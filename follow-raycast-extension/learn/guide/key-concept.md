# Key Concept

## What is Raycast Extension?

Raycast extensions คือโปรแกรมเสริมที่ช่วยเพิ่ม productivity โดยทำงานใน Raycast launcher สร้างด้วย React, TypeScript และ Node.js

## Core Concepts

### Extension Structure

```
my-extension/
├── package.json           # Extension metadata
├── manifest.json          # Raycast manifest
├── src/
│   ├── index.tsx         # Extension entry point
│   ├── commands/          # Command implementations
│   └── components/       # UI components
└── tsconfig.json
```

### Package.json

```json
{
  "name": "my-raycast-extension",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@raycast/api": "^1.60.0"
  },
  "devDependencies": {
    "@raycast/build": "^1.60.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "build": "raycast build",
    "dev": "raycast dev"
  }
}
```

### Manifest

```json
{
  "manifestVersion": 1,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "My Raycast extension",
  "icon": "icon.png",
  "commands": [
    {
      "name": "my-command",
      "title": "My Command",
      "description": "Does something",
      "mode": "view"
    }
  ]
}
```

## Types of Extensions

### Script Command

```typescript
import { launchCommand, LaunchProps } from "@raycast/api";

export default async function Command(props: LaunchProps) {
  await launchCommand({ name: "my-command", type: "user" });
}
```

### View Command

```typescript
import { List, ActionPanel, Action } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Item 1"
        actions={
          <ActionPanel>
            <Action title="Do Something" onAction={() => {}} />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

### User Input Command

```typescript
import { getInputValue } from "@raycast/api";

export default async function Command(props: { arguments: { query: string } }) {
  const { query } = props.arguments;
  console.log("Search:", query);
}
```

## Raycast Components

### List View

```typescript
import { List } from "@raycast/api";

function MyList() {
  return (
    <List>
      <List.Section title="Section 1">
        <List.Item title="Item 1" subtitle="Subtitle" />
        <List.Item title="Item 2" accessoryIcon="icon.png" />
      </List.Section>
      <List.Section title="Section 2">
        <List.Item title="Item 3" />
      </List.Section>
    </List>
  );
}
```

### Form

```typescript
import { Form } from "@raycast/api";

export default function MyForm() {
  return (
    <Form>
      <Form.TextField title="Name" placeholder="Enter name" />
      <Form.Dropdown title="Category">
        <Form.Dropdown.Item value="a" title="Category A" />
        <Form.Dropdown.Item value="b" title="Category B" />
      </Form.Dropdown>
      <Form.Checkbox title="Enable feature" />
      <Form.PasswordField title="API Key" />
    </Form>
  );
}
```

### Navigation Stack

```typescript
import { NavigationStack } from "@raycast/api";

function App() {
  return (
    <NavigationStack>
      <List>
        <List.Item
          title="View Details"
          target="details"
        />
      </List>
    </NavigationStack>
  );
}
```

## Preferences

```typescript
import { useFishState } from "@raycast/api";

export default function Command() {
  const preferences = usePreferences<MyPreferences>();

  return <List>Items</List>;
}
```

## When to Use

- ต้องการสร้าง custom commands สำหรับ workflow
- ต้องการ integrate กับ APIs ภายนอก
- ต้องการ automate งานซ้ำๆ
- ต้องการเพิ่ม UI ที่มี rich interactions