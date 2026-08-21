# Components

## List

```typescript
import { List } from "@raycast/api";

// Basic usage
<List>
  <List.Item title="Item 1" />
  <List.Item title="Item 2" />
</List>

// With search
<List
  searchText={search}
  onSearchTextChange={setSearch}
  navigationTitle="My List"
>
  {items.map(item => (
    <List.Item key={item.id} title={item.name} />
  ))}
</List>

// With sections
<List>
  <List.Section title="Section 1">
    <List.Item title="Item 1" />
  </List.Section>
  <List.Section title="Section 2">
    <List.Item title="Item 2" />
  </List.Section>
</List>

// Empty view
<List>
  <List.EmptyView
    title="No Results"
    description="Try a different search"
  />
</List>
```

## List.Item

| Prop | Type | Description |
|------|------|-------------|
| title | string | Main text |
| subtitle | string | Secondary text |
| icon | string | Icon name/path |
| accessories | Accessory[] | Right-side items |
| actions | ReactNode | Action panel |

## List.Item Accessories

| Type | Prop | Description |
|------|------|-------------|
| text | accessoryTitle | Text value |
| icon | accessoryIcon | SF Symbol name |
| fileIcon | accessoryFileIcon | File icon for path |

## Form

```typescript
import { Form } from "@raycast/api";

<Form>
  <Form.TextField
    title="Name"
    placeholder="Enter name"
    defaultValue=""
    onChange={handleChange}
  />

  <Form.Dropdown
    title="Category"
    defaultValue="a"
    onChange={handleChange}
  >
    <Form.Dropdown.Item value="a" title="Option A" />
    <Form.Dropdown.Item value="b" title="Option B" />
  </Form.Dropdown>

  <Form.Checkbox
    title="Enable"
    label="Enable feature"
    defaultValue={true}
  />

  <Form.PasswordField
    title="API Key"
    placeholder="Enter key"
  />

  <Form.Slider
    title="Volume"
    minValue={0}
    maxValue={100}
    defaultValue={50}
  />
</Form>
```

## ActionPanel

```typescript
import { ActionPanel, Action } from "@raycast/api";

<ActionPanel>
  <Action
    title="Do Something"
    onAction={() => console.log("clicked")}
    shortcut={{ modifiers: ["cmd"], key: "enter" }}
  />

  <Action.OpenInBrowser url="https://example.com" />

  <Action.CopyToClipboard content="text to copy" />

  <Action.Push title="View" target={<DetailView />} />

  <ActionPanel.Section title="Section">
    <Action title="Action 1" onAction={() => {}} />
    <Action title="Action 2" onAction={() => {}} />
  </ActionPanel.Section>

  <ActionPanel.Submenu title="More">
    <Action title="Sub 1" onAction={() => {}} />
  </ActionPanel.Submenu>
</ActionPanel>
```

## NavigationStack

```typescript
import { NavigationStack } from "@raycast/api";

<NavigationStack>
  <ParentView />
</NavigationStack>
```
