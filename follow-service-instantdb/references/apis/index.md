# Service Instantdb API & Dependencies

## Install

```sh
bun add -D @instantdb/react
# or
npm install --save-dev @instantdb/react
```

## Version

- Latest: 1.0.66
- [Package Registry](https://www.npmjs.com/package/@instantdb/react)
- [Repository](https://github.com/instantdb/instant)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @instantdb/react SDK | latest version | --save |
| `createClient` | Create service client | env-based | --url, --key |
| `query` | Query data | all rows | filters, order |
| `insert` | Insert data | new record | --returning |
| `configure` | Configure connection | project defaults | --config |
| `import '@instantdb/react/nextjs'` | Subpath export for nextjs | entry as documented | (none) |

## Source

- Official docs: https://github.com/instantdb/instant/tree/main/client/packages/react
- Description: Instant DB for React
