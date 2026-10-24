# Service Cloudflare Containers API & Dependencies

## Install

```bash
bun add -D wrangler
bun add @cloudflare/containers
```

## Version

| Component | Version | Verified | Notes |
|-----------|---------|----------|-------|
| `wrangler` | 4.152.0 | 2026-10-24 | Local container dev needs >= 4.136.0 |
| `@cloudflare/containers` | 0.3.7 | 2026-10-24 | Pre-1.0 — pin and review changes on upgrade |

Re-verify before pinning in a project; Containers is a fast-moving product.

## Dependencies

| Dependency | Required | Notes |
|------------|----------|-------|
| Docker | Yes | Local image builds happen on the host |
| Cloudflare account | Yes | Containers must be enabled for the account |
| Durable Objects (SQLite) | Yes | Every container class is a DO class |
| `compatibility_date` | Yes | Set to the current date |

## Configuration Fields

`wrangler.jsonc` `containers[]` entry:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `class_name` | string | Yes | Durable Object class that owns the container |
| `image` | string | Yes | Path to the Dockerfile (for example `./Dockerfile`) |
| `instance_type` | string | Yes | `lite`, `basic`, `standard-1` … `standard-4` |
| `max_instances` | number | No | Upper bound on concurrent instances |
| `name` | string | No | Container name used in CLI output |

Related Worker config:

| Section | Purpose |
|---------|---------|
| `durable_objects.bindings[]` | `{ "name": "MY_CONTAINER", "class_name": "MyContainer" }` |
| `migrations[]` | `{ "tag": "v1", "new_sqlite_classes": ["MyContainer"] }` |
| `observability.enabled` | Worker and container log visibility |

## Container Class (`@cloudflare/containers`)

| Member | Type | Purpose |
|--------|------|---------|
| `defaultPort` | number | Port the image listens on; default `8080` |
| `sleepAfter` | string | Idle duration before the instance stops |
| `envVars` | object | Environment passed to the process |
| `entrypoint` | string[] | Override the image entrypoint |
| `enableInternet` | boolean | Allow outbound internet from the container |
| `pingEndpoint` | string | Path used for container health checks |
| `requiredPorts` | number[] | Ports that must be listening before ready |
| `onStart()` | method | Hook run when the instance starts |
| `onStop()` | method | Cleanup hook run before the instance stops |
| `onError()` | method | Hook run when the instance exits with an error |

## Routing Helpers

| Helper | Signature | Behavior |
|--------|-----------|----------|
| `getContainer` | `(binding, name) => Container` | Returns the instance for an explicit ID; the same ID always maps to the same instance |
| `getRandom` | `(binding, count) => Container` | Picks one of `count` instances for spread |

There is no autoscaler: the caller chooses the instance.

## Durable Object Container API (`ctx.container`)

| Member | Purpose |
|--------|---------|
| `ctx.container.start(options)` | Start the instance |
| `ctx.container.destroy()` | Stop the instance |
| `ctx.container.running` | Whether the instance is running |
| `ctx.container.monitor()` | Await exit and inspect the exit code |
| `ctx.container.getTcpPort(port)` | `fetch` handle to a port inside the instance |

Use this API only for control the `Container` class does not expose. Ingress remains HTTP.

## Instance Types

| Type | vCPU | Memory | Disk |
|------|------|--------|------|
| `lite` | 1/16 | 256 MiB | 2 GB |
| `basic` | 1/4 | 1 GiB | 4 GB |
| `standard-1` | 1/2 | 4 GiB | 8 GB |
| `standard-2` | 1 | 6 GiB | 12 GB |
| `standard-3` | 2 | 8 GiB | 16 GB |
| `standard-4` | 4 | 12 GiB | 20 GB |

## Minimal Example

```ts
import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "5m";
}

export default {
  async fetch(request: Request, env: Env) {
    return getContainer(env.MY_CONTAINER, "instance-1").fetch(request);
  },
};
```

```jsonc
{
  "containers": [{
    "class_name": "MyContainer",
    "image": "./Dockerfile",
    "instance_type": "standard-1",
    "max_instances": 5,
    "name": "my-container"
  }],
  "durable_objects": {
    "bindings": [{ "name": "MY_CONTAINER", "class_name": "MyContainer" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyContainer"] }]
}
```
