# How It Works

## Raycast Extension Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Raycast Application                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Extension Loader                             │  │
│  │                                                                 │  │
│  │  ┌────────────────────────────────────────────────────────────┐│  │
│  │  │                 Extension Runtime                          ││  │
│  │  │                                                              ││  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐          ││  │
│  │  │  │   Command  │  │   Command  │  │   Command  │          ││  │
│  │  │  │     1      │  │     2      │  │     N      │          ││  │
│  │  │  │            │  │            │  │            │          ││  │
│  │  │  │  index.tsx │  │  index.tsx │  │  index.tsx │          ││  │
│  │  │  └────────────┘  └────────────┘  └────────────┘          ││  │
│  │  └────────────────────────────────────────────────────────────┘│  │
│  │                                                                 │  │
│  │  ┌────────────────────────────────────────────────────────────┐│  │
│  │  │                    Raycast API                             ││  │
│  │  │                                                              ││  │
│  │  │  ├── List, Form, NavigationStack components                  ││  │
│  │  │  ├── ActionPanel, Action components                         ││  │
│  │  │  ├── useState, useEffect hooks                              ││  │
│  │  │  ├── LocalStorage, Clipboard, getSelectedText               ││  │
│  │  │  └── launchCommand, open, Toast                              ││  │
│  │  └────────────────────────────────────────────────────────────┘│  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Extension Loading Flow

```
Raycast App Start
        │
        ▼
┌───────────────────┐
│  Load manifest.json│
│  Scan extensions  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Register commands │
│  in command palette│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  User invokes      │
│  command           │
│  (⌘+K → type name) │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Execute          │
│  index.tsx        │
│  Return UI        │
└───────────────────┘
```

## Command Modes

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Command Types                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │     View        │  │    Prompt       │  │    Launcher     │     │
│  │                 │  │                 │  │                 │     │
│  │ Default mode    │  │ User input      │  │ Quick actions   │     │
│  │ React component │  │ arguments       │  │ alternative     │     │
│  │                 │  │                 │  │                 │     │
│  │ List, Form      │  │ TextField       │  │ Open URL        │     │
│  │ Navigation      │  │ Dropdown       │  │ Copy text       │     │
│  │                 │  │ Checkbox        │  │ Run script      │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │    Import       │  │     Capture     │  │    User Input    │     │
│  │                 │  │                 │  │                 │     │
│  │ Clipboard       │  │ Text selection  │  │ Form input      │     │
│  │ file import     │  │ from browser   │  │                 │     │
│  │                 │  │                 │  │                 │     │
│  │ FilePicker      │  │ getSelectedText │  │ Form.TextField  │     │
│  │ open             │  │                │  │ Form.Dropdown   │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
<List>
│
├── <List.Item>
│   ├── title
│   ├── subtitle
│   ├── accessories
│   │   ├── text
│   │   ├── icon
│   │   └── fileIcon
│   └── actions
│       └── <ActionPanel>
│           ├── <Action>
│           ├── <Action.Open>
│           ├── <Action.Copy>
│           └── <Action.Push>
│
├── <List.EmptyView>
│
└── <List.Section>
    ├── title
    └── children
```

## State Management

```typescript
// Local state with useState
import { useState } from "react";
import { List } from "@raycast/api";

export default function Command() {
  const [search, setSearch] = useState("");

  return (
    <List
      searchText={search}
      onSearchTextChange={setSearch}
    >
      {/* filtered items */}
    </List>
  );
}
```

```typescript
// Async state with useEffect
import { useState, useEffect } from "react";
import { List } from "@raycast/api";

export default function Command() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <List isLoading={loading}>
      {items.map((item) => (
        <List.Item key={item.id} title={item.name} />
      ))}
    </List>
  );
}
```

## Action Flow

```
User clicks item
        │
        ▼
<ActionPanel> renders
        │
        ▼
<Action onAction={handler}>
        │
        ▼
Handler executes
        │
├──► Toast.show({ title: "Success" })
│    │
│    └──> Dismiss
│
├──► Clipboard.copy("text")
│    │
│    └──> Copy to clipboard
│
├──► open("https://url")
│    │
│    └──> Open in browser
│
└──► launchCommand({ name: "other" })
     │
     └──> Switch to other command
```

## Navigation Stack

```typescript
// Push new view onto stack
import { NavigationStack } from "@raycast/api";

function ParentView() {
  return (
    <List>
      <List.Item
        title="Open Details"
        actions={
          <ActionPanel>
            <Action.Push title="View Details" target={<DetailView />} />
          </ActionPanel>
        }
      />
    </List>
  );
}

// DetailView is rendered on top
function DetailView() {
  return <List><List.Item title="Details" /></List>;
}
```

## Preferences Flow

```
┌─────────────────────────────────────────────┐
│  User configures in Extension Preferences   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Extension Preferences              │   │
│  │                                     │   │
│  │  API Key: [********]                │   │
│  │  Theme: [Dark ▼]                    │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│  usePreferences<T>() hook reads values      │
│                                             │
│  const prefs = usePreferences<Prefs>();     │
│  console.log(prefs.apiKey);                 │
└─────────────────────────────────────────────┘
```

## Build Pipeline

```
Development (raycast dev)
        │
        ▼
┌───────────────────┐
│  TypeScript       │
│  compilation       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Hot reload       │
│  in Raycast        │
└───────────────────┘

Production (raycast build)
        │
        ▼
┌───────────────────┐
│  TypeScript       │
│  compilation       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Bundle assets     │
│  (icons, etc.)     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Generate .rsext   │
│  package          │
└───────────────────┘
```