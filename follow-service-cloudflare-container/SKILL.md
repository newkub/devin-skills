---
name: follow-service-cloudflare-container
description: Build, run, and deploy Cloudflare Containers with Wrangler and Durable Objects
argument-hint: "[setup|config|local-dev|deploy|scale|secrets|verify] [scope]"
related:
  - follow-service-cloudflare
  - follow-service-cloudflare-ci
  - deploy-to-cloudflare
  - create-cloudflare-worker
  - follow-create-docker
  - follow-secret-manager
  - follow-tool-mise
  - check-deployment-fails
  - report
---

## Goal

Ship a containerized workload on Cloudflare Containers: a Worker routes traffic to a Durable Object that owns a container instance, built from a local Dockerfile and pushed to the Cloudflare managed registry by Wrangler

## Scope

Used for:
- Cloudflare Containers — instance types, `containers` config, Durable Object ownership
- The `@cloudflare/containers` `Container` class (`defaultPort`, `sleepAfter`, `envVars`, `entrypoint`, `enableInternet`)
- The lower-level `ctx.container` Durable Object Container API (`start`, `destroy`, `running`, `monitor`, `getTcpPort`)
- Local development with Docker plus `wrangler dev`, image rebuilds, `wrangler containers build`
- Deploy, gradual rollouts, image tags, and rollback of a container-backed Worker
- Manual scaling via `getContainer` (explicit instance IDs) and `getRandom` (spread across N instances)
- Idle sleep, cold start, lifecycle limits, and disk ephemerality
- Secrets and environment variables inside containers, plus outbound internet control
- Observability: `wrangler tail`, container logs, `wrangler containers` inspection, SSH (beta)
- Limits and pricing awareness before choosing an instance type
- References: [Containers API & Dependencies](references/apis.md), [Wrangler Commands](references/commands.md), [Limits And Pricing](references/limits-and-pricing.md), [Lifecycle, Scaling And Rollouts](references/lifecycle.md)

Not used for (route to the owning skill):
- Workers, Pages, D1, KV, R2, Queues, Workflows, bindings, and plain `wrangler deploy` → `/follow-service-cloudflare`
- Cloudflare-hosted CI workflows (`@cloudflare/ci`) → `/follow-service-cloudflare-ci`
- Deploy-only execution of an already-built project → `/deploy-to-cloudflare`
- Scaffolding a fresh Workers project without containers → `/create-cloudflare-worker`

## Execute

### 1. Verify Prerequisites

> Goal: Confirm the toolchain and account can build and run containers

1. Check `wrangler --version` — Containers local dev needs >= 4.136.0; latest verified 4.152.0
2. Check Docker is installed and running (`docker info`) — local image builds happen on the host
3. Confirm an authenticated account with `wrangler whoami`
4. Install dependencies with `bun add -D wrangler @cloudflare/containers` (or `/follow-tool-mise` for a global tool install)
5. Confirm the account has Containers access and enough quota for the chosen instance type

### 2. Define Container Config

> Goal: Declare the container, its Durable Object binding, and its instance type

1. Add a `containers` array to `wrangler.jsonc` with `class_name`, `image`, `instance_type`, `max_instances`, `name`
2. Point `image` at the Dockerfile path (for example `./Dockerfile`)
3. Bind the Durable Object class in `durable_objects.bindings` using the same `class_name`
4. Register the class in `migrations` with `new_sqlite_classes` (Containers require SQLite-backed Durable Objects)
5. Set `compatibility_date` to the current date and keep the config in one file
6. See field-by-field details in [references/apis.md](references/apis.md)

### 3. Write The Container Class

> Goal: Route requests from the Worker to a running container instance

1. Export a class extending `Container` from `@cloudflare/containers`
2. Set `defaultPort` to the port the image listens on (8080 unless changed)
3. Set `sleepAfter` to the idle window before the instance is stopped
4. Add `envVars` for values the process needs; add `entrypoint` only when the image needs an override
5. Keep `enableInternet` at its default unless outbound access must be blocked or allowed explicitly
6. In the Worker `fetch` handler, obtain an instance with `getContainer(env.MY_CONTAINER, id)` and forward the request, or with `getRandom` for spread
7. Use the lower-level `ctx.container.start()` / `getTcpPort()` API only when the `Container` class does not fit
8. See the API surface in [references/apis.md](references/apis.md)

### 4. Build And Test Locally

> Goal: Run the real image locally before deploying

1. Start `wrangler dev` — Wrangler builds the Dockerfile locally first
2. Press `r` to rebuild the image after Dockerfile or app changes
3. Exercise the HTTP routes the Worker exposes, not only the container port
4. Verify the container starts and stops as the code expects (check instance logs in the dev output)
5. Confirm the app writes durable state to D1, KV, R2, or Durable Object storage — never to container disk
6. Re-run after each change; do not deploy an untested image

### 5. Deploy Image And Worker

> Goal: Publish the image and the Worker that owns it

1. Run a dry run first: `wrangler deploy --dry-run`
2. Deploy: `wrangler deploy` — this builds and pushes the image to the Cloudflare registry, then deploys the Worker
3. Use `wrangler containers build` and `wrangler containers push` when the image must be built separately
4. Inspect with `wrangler containers list` and `wrangler containers images`
5. Keep the image under the size limit (see [references/limits-and-pricing.md](references/limits-and-pricing.md))
6. Never deploy with a stale `compatibility_date` or a missing migration tag

### 6. Route Requests And Scale Manually

> Goal: Control which instance serves a request

1. Containers accept HTTP only — expose an HTTP server in the image and forward via `fetch`
2. WebSocket works through HTTP upgrade; there is no raw TCP ingress
3. Pin a caller to one instance with `getContainer(env.MY_CONTAINER, "id")` where the ID comes from a user, tenant, or room
4. Spread traffic with `getRandom(env.MY_CONTAINER, count)` over a fixed number of instances
5. There is no autoscaling — size the instance type and count from expected concurrency
6. Keep `max_instances` aligned with the account quota and the traffic shape
7. See [references/lifecycle.md](references/lifecycle.md)

### 7. Manage Lifecycle And Cold Start

> Goal: Make restarts and idle stops predictable

1. Expect a cold start of roughly 1-3 seconds when a stopped instance receives a request
2. Tune `sleepAfter` so frequently used instances stay warm without wasting billed time
3. Treat container disk as ephemeral — it is wiped after the instance stops
4. Choose the `default` scheduling policy for fast restarts, or `durable_object` (beta) when the instance must stay on its machine
5. Handle rollouts: a new deployment sends SIGTERM with a 15-minute grace window, then SIGKILL
6. Make the process exit cleanly on SIGTERM and reconnect external resources on start
7. See [references/lifecycle.md](references/lifecycle.md)

### 8. Pass Secrets And Environment Variables

> Goal: Inject configuration without baking it into the image

1. Store secrets with `wrangler secret put NAME` on the Worker
2. Read them in the `Container` class and pass through `envVars`
3. Use plain vars for non-secret configuration
4. Use `/follow-secret-manager` to manage and rotate `CLOUDFLARE_API_TOKEN` and application secrets
5. Never bake secrets into the Dockerfile, image layers, or `wrangler.jsonc`
6. Restart the instance after changing `envVars` — running containers keep their original environment

### 9. Observe, Debug, And Access

> Goal: Diagnose failures with runtime evidence

1. Stream logs with `wrangler tail` and enable `observability` in the config
2. Inspect resources with `wrangler containers list`, `wrangler containers info`, and `wrangler containers images`
3. Use `wrangler containers ssh` (beta) to reach a running instance when logs are not enough
4. Correlate Worker errors with container exit codes before changing code
5. Use `/check-deployment-fails` when the failure is in CI or the deploy pipeline rather than the container
6. See [references/commands.md](references/commands.md)

### 10. Roll Out And Verify

> Goal: Ship safely and prove the rollout is healthy

1. Deploy to a staging environment or a preview URL first
2. A production deploy requires explicit user confirmation and a passing `/run-verify`
3. Watch `wrangler tail` during rollout for startup errors and drained connections
4. Confirm instance counts and types match the config after deploy
5. Verify one request path end to end through the Worker, Durable Object, and container
6. Report the result with `/report`

### References

| Topic | Reference |
|-------|-----------|
| Config fields, `Container` class, `ctx.container`, `getContainer`/`getRandom` | `references/apis.md` |
| Wrangler `containers` subcommands and deploy flags | `references/commands.md` |
| Instance types, account limits, image limits, pricing | `references/limits-and-pricing.md` |
| States, sleep, cold start, SIGTERM drain, rollouts, scaling | `references/lifecycle.md` |

## Rules

### 1. Architecture

- A container is always owned by a Durable Object class bound to a Worker — never address it directly from outside Cloudflare
- Ingress is HTTP only; wrap any non-HTTP protocol behind an HTTP server
- Use the `@cloudflare/containers` class first; drop to `ctx.container` only for control the class does not expose
- Do not run a second orchestration layer inside the container

### 2. State And Persistence

- Container disk and memory are ephemeral — persist to D1, KV, R2, or Durable Object storage
- Assume any instance can stop at any moment; make startup idempotent
- Do not use container-local SQLite or files as the source of truth

### 3. Images

- Build from a Dockerfile in the repo and let Wrangler push the image; do not hand-push to an unmanaged registry
- Keep the image small — the image size limit caps large language runtimes and model assets
- Pin base image versions; do not rely on `latest`
- Use `/follow-create-docker` for Dockerfile quality and `.dockerignore` hygiene

### 4. Scaling And Cost

- Scale manually with explicit IDs or `getRandom`; there is no autoscaler
- Pick the smallest instance type that meets CPU and memory needs, using [references/limits-and-pricing.md](references/limits-and-pricing.md)
- Estimate cost from vCPU-seconds, GiB-hours of memory, and disk-hours before choosing `standard-3`/`standard-4`
- Validate against account quota (memory, vCPU, disk, image storage) before raising `max_instances`

### 5. Deployment Safety

- Dry run before every real deploy; production needs user confirmation
- Keep migrations additive and tagged; changing a Durable Object class requires a new migration tag
- On rollout, the old instance receives SIGTERM and has 15 minutes before SIGKILL — handle draining
- Keep a previous image reference so a bad rollout can be reverted

### 6. Secrets And Network

- Secrets come from Worker secrets and are passed through `envVars`; never in the Dockerfile
- Keep outbound internet explicit when the workload should be isolated
- Do not expose container ports publicly; all access goes through the Worker binding

### 7. Scope Boundaries

- Workers, Pages, D1, KV, R2, bindings, and non-container deploys → `/follow-service-cloudflare`
- Cloudflare-hosted CI → `/follow-service-cloudflare-ci`
- Fresh project scaffolding → `/create-cloudflare-worker`
- Deploy execution → `/deploy-to-cloudflare`
- CI/CD failures → `/check-deployment-fails`

##### Source

- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Get Started](https://developers.cloudflare.com/containers/get-started/)
- [Wrangler Configuration](https://developers.cloudflare.com/containers/wrangler-configuration/)
- [Container Class](https://developers.cloudflare.com/containers/container-class/)
- [Durable Object Container API](https://developers.cloudflare.com/containers/durable-object-container-api/)
- [Scaling And Routing](https://developers.cloudflare.com/containers/scaling-and-routing/)
- [Limits](https://developers.cloudflare.com/containers/platform-details/limits/)
- [Pricing](https://developers.cloudflare.com/containers/platform-details/pricing/)
- [Local Development](https://developers.cloudflare.com/containers/local-development/)

## Expected Outcome

- Container config, Durable Object binding, and migration tag present and consistent
- Image builds locally and deploys through Wrangler to the managed registry
- Requests routed to a predictable instance with explicit manual scaling
- Idle sleep, cold start, and SIGTERM draining handled without data loss
- Secrets injected through Worker secrets and `envVars`, never baked into the image
- Runtime verified through `wrangler tail` and container inspection before reporting
