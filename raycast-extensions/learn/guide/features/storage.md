# Storage

## Local Storage

```typescript
import { useLocalStorage } from "@raycast/api";

export default function Command() {
  const [value, setValue] = useLocalStorage("myKey", "default");

  return <List>{value}</List>;
}
```

## Clear Storage

```typescript
const { clear: clearCache } = useCache();
await clearCache();
```
