# Navigation

## Navigation Stack

```typescript
import { NavigationStack } from "@raycast/api";

export default function App() {
  return (
    <NavigationStack>
      <HomeView />
    </NavigationStack>
  );
}
```

## Pop to Root

```typescript
<Action
  title="Go Home"
  onAction={() => navigation.popToRoot()}
/>
```
