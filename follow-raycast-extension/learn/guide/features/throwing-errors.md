# Throwing Errors

```typescript
import { showToast, Toast } from "@raycast/api";

throw new Error("Something went wrong");

// With toast
await showToast({
  title: "Error",
  message: "Failed to fetch data",
  style: Toast.Style.Failure
});
```
