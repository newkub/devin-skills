# CLI Reference - Scalar

## Installation

```bash
# Global install
bun add -g @scalar/api-designer

# Development install
bun add @scalar/api-designer
```

## Commands

```bash
# Start server
bunx @scalar/api-designer

# With config
bunx @scalar/api-designer --config scalar.config.json

# Specify port
bunx @scalar/api-designer --port 3000

# Production mode
bunx @scalar/api-designer --mode production

# Help
bunx @scalar/api-designer --help
```

## Options

| Option | Description |
|--------|-------------|
| `--port` | Server port |
| `--host` | Server host |
| `--config` | Config file path |
| `--proxy` | Proxy to API URL |
| `--mode` | production/development |

## Docker Commands

```bash
# Pull latest
docker pull scalarorg/scalar:latest

# Run
docker run -p 3000:3000 scalarorg/scalar:latest

# With environment
docker run -p 3000:3000 \
  -e SCALAR_API_URL=https://api.example.com \
  scalarorg/scalar:latest
```
