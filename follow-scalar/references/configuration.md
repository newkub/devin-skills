# Configuration Reference - Scalar

## Config File

### scalar.config.json

```json
{
  "title": "My API",
  "description": "API documentation",
  "theme": "default",
  "darkMode": false,
  "sidebar": true,
  "search": true,
  "proxyUrl": "https://api.example.com/graphql",
  "layout": "modern"
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string | Scalar | API title |
| description | string | | API description |
| theme | string | default | UI theme |
| darkMode | boolean | false | Dark mode |
| sidebar | boolean | true | Show sidebar |
| search | boolean | true | Enable search |
| proxyUrl | string | | GraphQL endpoint |
| layout | string | modern | Layout style |

## Environment Variables

```bash
# Server config
SCALAR_PORT=3000
SCALAR_HOST=localhost
SCALAR_BASE_URL=/

# API config
SCALAR_API_URL=https://api.example.com
SCALAR_PROXY=true

# Theme
SCALAR_THEME=dark
SCALAR_DARK_MODE=true

# Features
SCALAR_SEARCH=true
SCALAR_SHOW_DEBUG=true
```

## YAML Config

```yaml
# scalar.yml
title: My API
proxyUrl: https://api.example.com

theme:
  color: '#3498db'
  darkMode: false

features:
  search: true
  playground: true
  mockServer: true
```


