# Installation - Scalar

## การเริ่มต้นอย่างรวดเร็ว

### Online (Recommended)

URL: https://scalar.com/

1. Create free account
2. Start new project
3. Begin designing

### Self-hosted

```bash
# Download Scalar
bun install @scalar/api-designer

# Run locally
bunx @scalar/api-designer
```

## Docker

```bash
# Pull image
docker pull scalarorg/scalar:latest

# Run container
docker run -p 3000:3000 scalarorg/scalar:latest
```

## VS Code Extension

```bash
code --install-extension scalar.scalar-for-vscode
```

### Features

- Schema syntax highlighting
- Auto-completion
- Inline documentation
- Playground integration

## Configuration

### Config File

```json
// scalar.config.json
{
  "title": "My API",
  "theme": "dark",
  "proxyUrl": "https://api.example.com/graphql"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| SCALAR_API_URL | API endpoint URL |
| SCALAR_THEME | UI theme |
| SCALAR_PORT | Server port |
