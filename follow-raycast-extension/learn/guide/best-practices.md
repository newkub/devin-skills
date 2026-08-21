# Best Practices

## Project Structure

```
my-extension/
├── src/
│   ├── index.tsx           # Main command
│   ├── lib/
│   │   ├── api.ts         # API functions
│   │   ├── types.ts       # TypeScript types
│   │   └── utils.ts       # Utilities
│   ├── components/
│   │   ├── ListView.tsx   # Reusable components
│   │   └── DetailView.tsx
│   └── hooks/
│       └── useData.ts     # Custom hooks
├── assets/
├── package.json
├── manifest.json
└── tsconfig.json
```

## Component Patterns

### Extract Reusable Components

```typescript
// components/ListItem.tsx
import { List, ActionPanel, Action } from "@raycast/api";

interface Props {
  item: Item;
  onSelect: (item: Item) => void;
}

export function ListItem({ item, onSelect }: Props) {
  return (
    <List.Item
      title={item.name}
      subtitle={item.description}
      actions={
        <ActionPanel>
          <Action title="Select" onAction={() => onSelect(item)} />
        </ActionPanel>
      }
    />
  );
}
```

### Use TypeScript Interfaces

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CommandProps {
  arguments: {
    query: string;
  };
}

export default function Command({ arguments }: CommandProps) {
  // Fully typed
}
```

## State Management

### Local State with useState

```typescript
export default function Command() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <List
      searchText={search}
      onSearchTextChange={setSearch}
      selectedItemId={selectedId}
      onSelectionChange={(id) => setSelectedId(id ?? null)}
    >
      {/* items */}
    </List>
  );
}
```

### Async Data Fetching

```typescript
export default function Command() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <List.EmptyView title="Error" description={error.message} />;
  }

  return <List isLoading={isLoading}>{/* items */}</List>;
}
```

## Error Handling

### Show Toast on Error

```typescript
import { showToast, Toast } from "@raycast/api";

async function handleAction() {
  try {
    await doSomething();
    await showToast({
      title: "Success",
      style: Toast.Style.Success
    });
  } catch (error) {
    await showToast({
      title: "Error",
      message: error instanceof Error ? error.message : "Unknown error",
      style: Toast.Style.Failure
    });
  }
}
```

### Use try-catch in Async Functions

```typescript
async function fetchData(): Promise<Data[]> {
  try {
    const response = await fetch("https://api.example.com");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
```

## Performance

### Debounce Search Input

```typescript
import { useCallback } from "react";

export default function Command() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setResults(searchAPI(query));
    }, 300),
    []
  );

  return (
    <List
      searchText={search}
      onSearchTextChange={(text) => {
        setSearch(text);
        debouncedSearch(text);
      }}
    >
      {/* results */}
    </List>
  );
}
```

### Memoize Expensive Computations

```typescript
import { useMemo } from "react";

export default function Command() {
  const items = useItems();

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return <List>{/* sortedItems */}</List>;
}
```

## Action Design

### Provide Primary Action

```typescript
<List.Item
  title="Open"
  actions={
    <ActionPanel>
      <Action
        title="Open in Browser"
        onAction={() => open(url)}
        shortcut={{ modifiers: ["cmd"], key: "enter" }}
      />
      <Action title="Copy URL" onAction={() => Clipboard.copy(url)} />
    </ActionPanel>
  }
/>
```

### Group Related Actions

```typescript
<ActionPanel>
  <Action title="Open" onAction={() => {}} />
  <ActionPanel.Section title="Clipboard">
    <Action.CopyToClipboard content="..." />
    <Action title="Copy Link" onAction={() => {}} />
  </ActionPanel.Section>
  <ActionPanel.Section title="Other">
    <Action title="Settings" onAction={() => {}} />
  </ActionPanel.Section>
</ActionPanel>
```

## Preferences

### Validate Required Preferences

```typescript
interface Preferences {
  apiKey: string;
  endpoint: string;
}

export default function Command() {
  const { preferences, hasPreferences } = usePreferences<Preferences>();

  if (!hasPreferences || !preferences.apiKey) {
    return (
      <List.EmptyView
        title="Configuration Required"
        description="Please set your API key in extension preferences."
      />
    );
  }

  return <List>{/* items */}</List>;
}
```

## Testing

### Test Component Logic

```typescript
import { render } from "@testing-library/react";

test("filters items correctly", () => {
  const items = [
    { id: "1", name: "Apple" },
    { id: "2", name: "Banana" }
  ];

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes("apple")
  );

  expect(filtered).toHaveLength(1);
  expect(filtered[0].name).toBe("Apple");
});
```

## Build Optimization

### Clean Build

```bash
# Before building
raycast clean
raycast build
```

### Check for Type Errors

```bash
npx tsc --noEmit
```

## Documentation

### Comment Complex Logic

```typescript
// Parse ISO date string to formatted display
// Input: "2024-01-15T10:30:00Z"
// Output: "Jan 15, 10:30 AM"
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
```

### Document Function Signatures

```typescript
/**
 * Fetches items from API with caching
 * @param query - Search query string
 * @param options - Fetch options
 * @returns Promise resolving to array of items
 */
async function fetchItems(
  query: string,
  options?: FetchOptions
): Promise<Item[]> {
  // implementation
}
```

## Accessibility

### Use Proper Titles

```typescript
// Good
<List navigationTitle="Search Results">

// Good
<Form.TextField title="Email Address" placeholder="email@example.com">
```

### Add Descriptions to Empty Views

```typescript
<List.EmptyView
  title="No Results"
  description="Try a different search term or adjust your filters."
/>
```