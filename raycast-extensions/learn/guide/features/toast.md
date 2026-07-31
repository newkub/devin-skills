# Toast

## Show Toast

```typescript
import { Toast } from "@raycast/api";

// Success
await Toast.show({
  title: "Success",
  message: "Operation completed",
  style: Toast.Style.Success
});

// Error
await Toast.show({
  title: "Error",
  message: "Something went wrong",
  style: Toast.Style.Failure
});

// Loading
const toast = await Toast.show({
  title: "Loading...",
  style: Toast.Style.Animated
});

// Update
toast.hide();
```
