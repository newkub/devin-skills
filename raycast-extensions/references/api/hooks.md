# Hooks

## useState

```typescript
const [value, setValue] = useState(initialValue);
```

## useEffect

```typescript
useEffect(() => {
  // Effect logic
  return () => { /* cleanup */ };
}, [dependencies]);
```

## usePreferences

```typescript
import { usePreferences } from "@raycast/api";

interface Preferences {
  apiKey: string;
  theme: "light" | "dark";
}

const { preferences, hasPreferences } = usePreferences<Preferences>();
```

## useLocalStorage

```typescript
import { useLocalStorage } from "@raycast/api";

const [value, setValue] = useLocalStorage("key", defaultValue);
```

## useKeyEquivalents

```typescript
import { useKeyEquivalents } from "@raycast/api";

useKeyEquivalents({
  onEnter: () => handleEnter(),
  onEscape: () => handleEscape(),
  onBackspace: () => handleBackspace(),
  onTab: () => handleTab(),
});
```
