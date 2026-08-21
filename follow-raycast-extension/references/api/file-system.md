# File System

## readTextFile

```typescript
import { readTextFile } from "@raycast/api";

const content = await readTextFile("~/.config/myapp/config.json");
```

## writeTextFile

```typescript
import { writeTextFile } from "@raycast/api";

await writeTextFile("~/.config/myapp/data.json", jsonContent);
```

## mkdir

```typescript
import { mkdir } from "@raycast/api";

await mkdir("~/.config/myapp", { intermediates: true });
```

## expandPath

```typescript
import { expandPath } from "@raycast/api";

const path = await expandPath("~/documents");
```
