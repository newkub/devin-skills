# List Component

## Basic List

```typescript
import { List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Item 1" />
      <List.Item title="Item 2" />
      <List.Item title="Item 3" />
    </List>
  );
}
```

## Searchable List

```typescript
export default function Command() {
  const [search, setSearch] = useState("");

  return (
    <List
      searchText={search}
      onSearchTextChange={setSearch}
      navigationTitle="Search Items"
    >
      {items
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((item) => (
          <List.Item key={item.id} title={item.name} />
        ))}
    </List>
  );
}
```

## Section Headers

```typescript
<List>
  <List.Section title="Favorites">
    <List.Item title="Important Item" />
  </List.Section>
  <List.Section title="Recent">
    <List.Item title="Recent Item" />
  </List.Section>
</List>
```

## List Item Accessories

```typescript
<List.Item
  title="Document"
  subtitle="Last edited yesterday"
  accessoryTitle="5 MB"
  accessoryIcon="document.pdf"
  icon="📄"
/>
```
