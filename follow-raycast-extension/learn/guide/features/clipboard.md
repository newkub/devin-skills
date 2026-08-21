# Clipboard

## Read Clipboard

```typescript
import { getSelectedText } from "@raycast/api";

const text = await getSelectedText();
```

## Write to Clipboard

```typescript
import { Clipboard } from "@raycast/api";

await Clipboard.copy("Hello, World!");
```
