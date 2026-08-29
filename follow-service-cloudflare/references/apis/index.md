# Service Cloudflare API & Dependencies

## Install

```sh
bun add -D wrangler
# or
npm install --save-dev wrangler
```

## Version

- Latest: 4.127.1
- [Package Registry](https://www.npmjs.com/package/wrangler)
- [Repository](https://github.com/cloudflare/workers-sdk)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install wrangler in project | latest version | --save-dev, --save, --global |
| `wrangler` | Run the wrangler CLI | current workspace | --help, --version, --config |
| `wrangler2` | Run the wrangler2 CLI | current workspace | --help, --version, --config |
| `cf-wrangler` | Run the cf-wrangler CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'wrangler/experimental-config'` | Subpath export for experimental-config | entry as documented | (none) |

## Source

- Official docs: https://developers.cloudflare.com/workers/wrangler
- Description: Command-line interface for all things Cloudflare Workers
