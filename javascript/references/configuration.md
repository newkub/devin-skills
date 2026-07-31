# JavaScript Configuration Reference

## package.json

### Essential Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Package name |
| `version` | string | Semantic version |
| `description` | string | Package description |
| `main` | string | Entry point |
| `type` | string | Module type (commonjs/module) |
| `exports` | object | Package exports configuration |
| `scripts` | object | bun scripts |
| `dependencies` | object | Production dependencies |
| `devDependencies` | object | Development dependencies |
| `peerDependencies` | object | Peer dependencies |
| `optionalDependencies` | object | Optional dependencies |
| `engines` | object | Required Node.js version |
| `license` | string | License type |

### Scripts

| Script | Description |
|--------|-------------|
| `start` | Start application |
| `dev` | Development mode |
| `build` | Build for production |
| `test` | Run tests |
| `lint` | Run linter |
| `format` | Format code |

### Module Types

| Type | Description |
|------|-------------|
| `commonjs` | CommonJS modules (require/module.exports) |
| `module` | ES modules (import/export) |

## Browser Configuration

### HTML Scripts

| Attribute | Description |
|-----------|-------------|
| `type="module"` | Enable ES modules |
| `defer` | Defer script execution |
| `async` | Async script loading |
| `crossorigin` | CORS handling |

### Polyfills

| Library | Description |
|---------|-------------|
| core-js | Standard library polyfills |
| regenerator-runtime | Async/await polyfill |
| whatwg-fetch | Fetch API polyfill |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| package.json docs | https://docs.bunjs.com/cli/v9/configuring-bun/package-json | Official package.json documentation |
| Node.js ESM | https://nodejs.org/api/esm.html | ECMAScript Modules in Node.js |
