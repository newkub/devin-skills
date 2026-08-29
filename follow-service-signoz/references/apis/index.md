# Service Signoz API & Dependencies

## Install

```sh
bun add -D @opentelemetry/api
# or
npm install --save-dev @opentelemetry/api
```

## Version

- Latest: 1.9.1
- [Package Registry](https://www.npmjs.com/package/@opentelemetry/api)
- [Repository](https://github.com/open-telemetry/opentelemetry-js)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @opentelemetry/api SDK | latest version | --save |
| `createClient` | Create service client | env-based | --url, --key |
| `query` | Query data | all rows | filters, order |
| `insert` | Insert data | new record | --returning |
| `configure` | Configure connection | project defaults | --config |
| `import '@opentelemetry/api/experimental'` | Subpath export for experimental | entry as documented | (none) |

## Source

- Official docs: https://github.com/open-telemetry/opentelemetry-js/tree/main/api
- Description: Public API for OpenTelemetry
