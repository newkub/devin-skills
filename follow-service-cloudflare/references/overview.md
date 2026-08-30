# Wrangler CLI Overview

## Overview

Wrangler is the Cloudflare Developer Platform command-line interface (CLI) for managing Worker projects. It supports creating, developing, deploying, and managing Cloudflare Workers and Developer Platform products (D1, KV, R2, Queues, Workflows, Pages, Hyperdrive, Vectorize).

## Version Info

- Package: `wrangler`
- Latest stable: `4.125.0`
- Node.js requirement: `>=22.0.0`
- Peer dependency: `@cloudflare/workers-types` (optional)
- License: MIT OR Apache-2.0
- npm: https://www.npmjs.com/package/wrangler

## Migration From v3 To v4

```sh
bun add -D wrangler@4
```

Wrangler v4 is a smaller set of changes compared to previous major versions. Existing workflows are unlikely to change.

## Source

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Install/Update Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Migrate v3 to v4](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/)
