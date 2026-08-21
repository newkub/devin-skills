# Architecture

## Extension Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Raycast Extension                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    manifest.json                                 │  │
│  │  - Extension metadata                                           │  │
│  │  - Command definitions                                         │  │
│  │  - Preferences schema                                          │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                       src/                                     │  │
│  │                                                                  │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │  │
│  │  │   index.tsx │    │   index.tsx │    │   index.tsx │         │  │
│  │  │  (Command 1)│    │  (Command 2)│    │  (Command N)│         │  │
│  │  │             │    │             │    │             │         │  │
│  │  │  <List>    │    │   <Form>   │    │  <List>    │         │  │
│  │  └─────────────┘    └─────────────┘    └─────────────┘         │  │
│  │         │                 │                 │                   │  │
│  │         └────────┬────────┴────────┬────────┘                   │  │
│  │                  ▼                 ▼                            │  │
│  │  ┌────────────────────────────────────────────────────────────┐│  │
│  │  │                    @raycast/api                            ││  │
│  │  │                                                            ││  │
│  │  │  Components:  List, Form, NavigationStack, ActionPanel   ││  │
│  │  │  Hooks:      useState, useEffect, usePreferences          ││  │
│  │  │  Actions:    launchCommand, open, Clipboard              ││  │
│  │  │  Utils:      Toast, LocalStorage, runShellCommand        ││  │
│  │  └────────────────────────────────────────────────────────────┘│  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
my-raycast-extension/
├── manifest.json          # Extension manifest
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── src/
│   ├── index.tsx          # Default command entry
│   ├── command-1.tsx      # Additional commands
│   ├── command-2.tsx
│   ├── lib/
│   │   ├── api.ts         # API client functions
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── utils.ts       # Utility functions
│   │   └── constants.ts   # Constants & config
│   ├── hooks/
│   │   ├── useData.ts     # Data fetching hook
│   │   └── usePreferences.ts # Preferences hook
│   └── components/
│       ├── ListView.tsx   # Reusable list
│       ├── DetailView.tsx # Detail view
│       └── EmptyState.tsx # Empty view component
└── assets/
    └── icon.png           # Extension icon (128x128)
```

## Component Architecture

### Command Component Pattern

```typescript
// src/commands/my-command.tsx
import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";

interface Props {
  arguments: {
    query: string;
  };
}

export default function MyCommand({ arguments: args }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState(args.query || "");

  // Data fetching
  useEffect(() => {
    fetchItems(search).then(setItems).catch(handleError);
  }, [search]);

  return (
    <List
      searchText={search}
      onSearchTextChange={setSearch}
      isLoading={isLoading}
    >
      {items.map((item) => (
        <List.Item
          key={item.id}
          title={item.name}
          actions={
            <ActionPanel>
              <Action
                title="Open"
                onAction={() => handleOpen(item)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

### Hook Pattern

```typescript
// src/hooks/useItems.ts
import { useState, useEffect, useCallback } from "react";

export function useItems(searchQuery: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        setIsLoading(true);
        const data = await fetchItems(searchQuery);
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetch();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  return { items, isLoading, error };
}
```

### API Layer

```typescript
// src/lib/api.ts
const BASE_URL = "https://api.example.com";

interface FetchOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    })
};
```

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      State Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Input ──► useState ──► Render ──► Action              │
│                      │                                      │
│                      ▼                                      │
│              useEffect ──► Fetch API ──► Update State       │
│                                              │               │
│                                              ▼               │
│                                      Re-render              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Stack

```typescript
// Navigation hierarchy
NavigationStack
├── ParentView
│   └── List<Item> with Action.Push
│       └── ChildView
│           └── List<Item> with Action.Push
│               └── GrandchildView
```

### Push/Pop Pattern

```typescript
function ParentView({ navigation }: Props) {
  return (
    <List>
      <List.Item
        title="Go to Details"
        actions={
          <ActionPanel>
            <Action.Push
              title="View Details"
              target={<DetailView navigation={navigation} />}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}

function DetailView({ navigation }: Props) {
  return (
    <List>
      <List.Item
        title="Go Back"
        actions={
          <ActionPanel>
            <Action.PopToRoot />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

## Multi-Command Architecture

### manifest.json (Multi-Command)

```json
{
  "commands": [
    {
      "name": "main",
      "title": "My Extension",
      "mode": "view"
    },
    {
      "name": "search",
      "title": "Search",
      "mode": "prompt",
      "arguments": [...]
    },
    {
      "name": "settings",
      "title": "Settings",
      "mode": "view"
    }
  ]
}
```

### Entry Points

```
src/
├── index.tsx       # Default command (main)
├── search.tsx      # Search command
└── settings.tsx    # Settings command
```

### Launch Between Commands

```typescript
// From any command
import { launchCommand } from "@raycast/api";

await launchCommand({ name: "settings", type: "user" });
```

## Preferences Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Preferences Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  manifest.json ──► Schema Definition                        │
│                      │                                       │
│                      ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Extension Preferences Panel               │   │
│  │                                                      │   │
│  │  API Key: [********]                                │   │
│  │  Theme: [Dark ▼]                                    │   │
│  │  Notifications: [x]                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              usePreferences<T>()                     │   │
│  │                                                      │   │
│  │  const { preferences } = usePreferences<Prefs>();   │   │
│  │  preferences.apiKey                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Component Access                        │   │
│  │                                                      │   │
│  │  if (!preferences.apiKey) {                         │   │
│  │    return <EmptyView title="Setup Required" />      │   │
│  │  }                                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Error Boundaries

```typescript
// src/lib/error-handler.ts
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    await showToast({
      title: "Error",
      message: errorMessage,
      style: Toast.Style.Failure
    });
    return null;
  }
}

// Usage
const items = await withErrorHandling(
  () => fetchItems(searchQuery),
  "Failed to fetch items"
);
```

## Build Configuration

```json
// package.json
{
  "scripts": {
    "build": "raycast build",
    "dev": "raycast dev",
    "clean": "raycast clean"
  },
  "dependencies": {
    "@raycast/api": "^1.60.0"
  },
  "devDependencies": {
    "@raycast/build": "^1.60.0",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```
