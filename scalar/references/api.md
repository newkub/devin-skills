# Scalar API Reference

## Scalar CLI API

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `scalar init` | Initialize new project | `scalar init my-api` |
| `scalar dev` | Start development server | `scalar dev` |
| `scalar build` | Build project | `scalar build` |
| `scalar mock` | Start mock server | `scalar mock` |
| `scalar docs` | Generate documentation | `scalar docs` |
| `scalar validate` | Validate schema | `scalar validate` |
| `scalar format` | Format schema | `scalar format` |

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--config` | Config file path | `scalar.config.yaml` |
| `--port` | Server port | `4000` |
| `--watch` | Watch for changes | `false` |
| `--debug` | Enable debug mode | `false` |
| `--output` | Output directory | `./dist` |

## GraphQL API Reference

### Scalar Types

| Type | Description | Example |
|------|-------------|---------|
| `ID` | Unique identifier | `"abc123"` |
| `String` | Text string | `"Hello"` |
| `Int` | Integer | `42` |
| `Float` | Floating point | `3.14` |
| `Boolean` | Boolean | `true` |
| `DateTime` | ISO 8601 datetime | `"2024-01-01T00:00:00Z"` |
| `JSON` | JSON object | `{"key": "value"}` |

### Scalar Directives

| Directive | Description | Example |
|-----------|-------------|---------|
| `@deprecated` | Mark field as deprecated | `@deprecated(reason: "Use newField")` |
| `@specifiedBy` | Specify scalar URL | `@specifiedBy(url: "https://...")` |
| `@auth` | Authentication requirement | `@auth(role: "admin")` |

## Mock Server API

### Mock Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/graphql` | POST | GraphQL endpoint |
| `/schema` | GET | Get schema SDL |
| `/health` | GET | Health check |

### Mock Configuration

```yaml
mock:
  enabled: true
  port: 4000
  cors: true
  latency: 50
```

## Documentation API

### Documentation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/docs` | GET | Documentation HTML |
| `/docs.json` | GET | Documentation JSON |
| `/docs/schema` | GET | Schema documentation |

### Documentation Options

```yaml
documentation:
  theme: light
  branding:
    logo: "./logo.png"
    colors:
      primary: "#3b82f6"
```

## Validation API

### Validation Rules

| Rule | Description |
|------|-------------|
| `schema-validation` | Validate GraphQL schema |
| `naming-convention` | Check naming conventions |
| `field-coverage` | Check field documentation |
| `type-completeness` | Check type descriptions |

### Validation Commands

```bash
# Validate schema
scalar validate schema.graphql

# Validate with rules
scalar validate --rules naming,coverage

# Validate and fix
scalar validate --fix
```

## Configuration API

### Config Structure

```yaml
version: "1.0"
project:
  name: string
  description: string
  schema: string

features:
  mock: boolean
  docs: boolean
  validation: boolean

mock:
  enabled: boolean
  port: number
  rules: array

documentation:
  theme: string
  output: array
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SCALAR_API_KEY` | API key for cloud features | `"sk-..."` |
| `SCALAR_WORKSPACE` | Workspace ID | `"ws-..."` |
| `SCALAR_ENVIRONMENT` | Environment name | `"production"` |
| `SCALAR_PORT` | Server port | `"4000"` |

## Integration API

### Git Integration

```yaml
git:
  enabled: true
  remote: string
  branch: string
  hooks:
    pre-commit: string
    pre-push: string
```

### CI/CD Integration

```yaml
ci:
  provider: github | gitlab | bitbucket
  workflow: string
  auto-deploy: boolean
```

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| Scalar Documentation | https://docs.scalar.com | Official docs |
| GraphQL Specification | https://spec.graphql.org | GraphQL spec |
| GraphQL Learn | https://graphql.org/learn | GraphQL tutorial |
