# Configuration

## manifest.json

```json
{
  "manifestVersion": 1,
  "name": "Extension Name",
  "version": "1.0.0",
  "description": "Extension description",
  "icon": "assets/icon.png",
  "commands": [
    {
      "name": "command-name",
      "title": "Command Title",
      "description": "What this command does",
      "mode": "view"
    }
  ]
}
```

## Command Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| view | React component UI | List, Form, custom UI |
| prompt | User input arguments | Search with query |
| launcher | Quick actions | Open URL, copy, run |

### View Mode

```json
{
  "name": "my-list",
  "title": "My List",
  "mode": "view"
}
```

### Prompt Mode

```json
{
  "name": "search",
  "title": "Search",
  "mode": "prompt",
  "arguments": [
    {
      "name": "query",
      "type": "text",
      "placeholder": "Search...",
      "required": true
    }
  ]
}
```

### Launcher Mode

```json
{
  "name": "quick-action",
  "title": "Quick Action",
  "mode": "launcher"
}
```

## Arguments

### Text Argument

```json
{
  "arguments": [
    {
      "name": "query",
      "type": "text",
      "placeholder": "Enter search term",
      "required": false
    }
  ]
}
```

### Dropdown Argument

```json
{
  "arguments": [
    {
      "name": "category",
      "type": "dropdown",
      "required": true,
      "defaultValue": "all",
      "data": [
        { "value": "all", "label": "All" },
        { "value": "recent", "label": "Recent" }
      ]
    }
  ]
}
```

## Preferences

### Password Preference

```json
{
  "preferences": [
    {
      "name": "apiKey",
      "type": "password",
      "title": "API Key",
      "required": true
    }
  ]
}
```

### Text Preference

```json
{
  "preferences": [
    {
      "name": "username",
      "type": "text",
      "title": "Username"
    }
  ]
}
```

### Dropdown Preference

```json
{
  "preferences": [
    {
      "name": "theme",
      "type": "dropdown",
      "title": "Theme",
      "defaultValue": "dark",
      "data": [
        { "value": "light", "label": "Light" },
        { "value": "dark", "label": "Dark" }
      ]
    }
  ]
}
```

### Toggle Preference

```json
{
  "preferences": [
    {
      "name": "notifications",
      "type": "checkbox",
      "title": "Enable Notifications",
      "defaultValue": true
    }
  ]
}
```

## Icon Configuration

| Size | Use Case |
|------|----------|
| 128x128 | Extension icon (required) |
| 64x64 | Command icon |

```json
{
  "icon": "assets/icon.png"
}
```

## Import Types

### Clipboard Import

```json
{
  "commands": [
    {
      "name": "import",
      "mode": "import",
      "supportedTypes": ["text", "image"]
    }
  ]
}
```

### File Import

```json
{
  "commands": [
    {
      "name": "process-file",
      "mode": "import",
      "supportedTypes": ["file"]
    }
  ]
}
```

## Schema Reference

### Command Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique identifier (kebab-case) |
| title | string | Yes | Display name |
| description | string | No | Help text |
| mode | string | Yes | view, prompt, launcher, import |
| icon | string | No | Icon path |
| arguments | array | No | User input arguments |
| preferences | array | No | Extension preferences |

### Argument Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Identifier |
| type | string | Yes | text, dropdown |
| placeholder | string | No | Input placeholder |
| required | boolean | No | Required field |
| defaultValue | string | No | Default value |

## Environment Variables

| Variable | Description |
|----------|-------------|
| RAYCAST_EXTENSION_PATH | Extension directory path |
| RAYCAST_COMMAND_NAME | Current command name |

## Package.json Scripts

```json
{
  "scripts": {
    "build": "raycast build",
    "dev": "raycast dev",
    "clean": "raycast clean"
  }
}
```