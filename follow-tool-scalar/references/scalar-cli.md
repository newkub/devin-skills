# CLI Reference - Scalar

## Installation

```bash
# Development install (binary name: scalar, requires Node >=24)
bun add -D @scalar/cli

# Global install via npm
npm install -g @scalar/cli

# Or run without install
bunx @scalar/cli --version
npx @scalar/cli --version
```

Note: Git bundles a different `scalar` CLI. If the names conflict, use `npm install -g --force @scalar/cli` or invoke via `bunx @scalar/cli`.

## Bootstrap

```bash
# Create a starter scalar.config.json
scalar init
```

## Document Commands

All document operations live under `scalar document`:

```bash
# Validate an OpenAPI file (Swagger 2.0 / OpenAPI 3.0 / 3.1)
scalar document validate openapi.yaml
scalar document validate https://example.com/openapi.json

# Mock an API from an OpenAPI file (watches for changes, custom port)
scalar document mock openapi.yaml --watch --port 8080

# Preview an API Reference locally
scalar document serve openapi.yaml

# Lint with Spectral rules
scalar document lint openapi.yaml

# Bundle an OpenAPI document (resolve all $refs and external deps)
scalar document bundle openapi.yaml

# Split / join documents
scalar document split openapi.yaml
scalar document join a.yaml b.yaml

# Format an OpenAPI file
scalar document format openapi.yaml

# Convert a Postman collection to OpenAPI
scalar document convert collection.json

# Generate Markdown docs from an OpenAPI file
scalar document markdown openapi.yaml

# Share an OpenAPI file / upgrade to OpenAPI 3.1
scalar document share openapi.yaml
scalar document upgrade openapi.yaml

# Boot a server that mirrors HTTP requests (debugging webhooks)
scalar document void
```

## Mock Server Behavior

- The mock server validates every request against the OpenAPI contract by default; violations return `422` with an `application/problem+json` body.
- Opt out programmatically via `@scalar/mock-server` (`createMockServer({ document, validateRequest: false })`).

## Top-Level Commands

```bash
scalar readme      # Open documentation for the CLI
scalar upgrade     # Upgrade current version of the CLI
scalar auth        # Manage authorization on the Scalar platform
scalar document    # Manage local OpenAPI files (see above)
scalar project     # Manage Scalar docs project
scalar registry    # Manage your Scalar registry
scalar team        # Manage user teams
scalar sdk         # Manage Scalar SDKs (Enterprise only)
scalar schema      # Manage Scalar schemas
scalar help        # Display help
```

## CI Example (GitHub Actions)

```yml
name: Validate OpenAPI File
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
      - run: npx @scalar/cli document validate docs/openapi.yaml
```

## API Reference Embedding

For rendered HTML docs, use `@scalar/api-reference` directly:

```html
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
```

or via framework integrations (React, Vue, Express, Fastify, Hono, Next.js, etc.).
