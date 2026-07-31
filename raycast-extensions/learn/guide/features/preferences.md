# Preferences

## Define Preferences

```typescript
// manifest.json
{
  "preferences": [
    {
      "name": "apiKey",
      "type": "password",
      "required": true,
      "title": "API Key",
      "description": "Your API key"
    }
  ]
}
```

## Use Preferences

```typescript
import { usePreferences } from "@raycast/api";

interface Preferences {
  apiKey: string;
  theme: "light" | "dark";
}

export default function Command() {
  const { preferences } = usePreferences<Preferences>();

  return <List>API: {preferences.apiKey}</List>;
}
```
