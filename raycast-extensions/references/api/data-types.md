# Data Types

## LaunchProps

```typescript
interface LaunchProps {
  arguments: Record<string, string>;
  executionId: string;
  option?: string;
}
```

## ListItemProps

```typescript
interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  accessoryTitle?: string;
  accessoryIcon?: string;
  actions?: ReactNode;
}
```

## ActionProps

```typescript
interface ActionProps {
  title: string;
  onAction: () => void;
  shortcut?: KeyboardShortcut;
  icon?: string;
}
```

## KeyboardShortcut

```typescript
interface KeyboardShortcut {
  modifiers: ("cmd" | "alt" | "ctrl" | "shift")[];
  key: string;
}

// Example
{ modifiers: ["cmd", "shift"], key: "f" }
```
