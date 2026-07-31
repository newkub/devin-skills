# Action Panel

## Basic Actions

```typescript
<List.Item
  title="Item"
  actions={
    <ActionPanel>
      <Action title="Do Something" onAction={() => console.log("clicked")} />
    </ActionPanel>
  }
/>
```

## Open URL

```typescript
<Action.OpenInBrowser url="https://example.com" />
```

## Copy to Clipboard

```typescript
<Action.CopyToClipboard content="Text to copy" />
```

## Push View

```typescript
<Action.Push title="View Details" target={<DetailView />} />
```

## Create Child Action Panel

```typescript
<List.Item
  title="Item"
  actions={
    <ActionPanel>
      <Action title="Primary" onAction={() => {}} />
      <ActionPanel.Submenu title="More Actions">
        <Action title="Action 1" onAction={() => {}} />
        <Action title="Action 2" onAction={() => {}} />
      </ActionPanel.Submenu>
    </ActionPanel>
  }
/>
```
