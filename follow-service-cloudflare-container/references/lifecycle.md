# Service Cloudflare Containers Lifecycle, Scaling And Rollouts

## Ownership Chain

```
Client request
  -> Worker fetch handler
    -> Durable Object (container class)
      -> container instance (HTTP server in the image)
```

- The Worker never reaches a container directly; it goes through the Durable Object binding.
- One Durable Object instance owns at most one container instance.
- The container listens on `defaultPort` (8080 unless changed) and receives HTTP requests only.

## States

| State | Meaning | Billed |
|-------|---------|--------|
| Created | Instance exists, process not started | No compute |
| Starting | Image pulled, process booting | Yes (cold start) |
| Running | Process serving requests | Yes |
| Stopping | SIGTERM sent, draining | Yes until exit |
| Stopped | Process exited, disk discarded | No |
| Error | Process exited unexpectedly | No |

A stopped instance starts again on the next request. There is no in-between "paused" state.

## Sleep And Cold Start

- `sleepAfter` sets how long an idle instance stays running before it stops.
- Cold start is roughly 1-3 seconds, plus image pull time in rare cases.
- Lower `sleepAfter` saves cost and increases the chance of a cold start.
- Higher `sleepAfter` keeps the process warm at the cost of billed idle time.
- Health checks use `pingEndpoint`; a failing ping keeps the instance out of service.

## Startup Contract

1. Read configuration from environment variables only
2. Reconnect to D1, KV, R2, or Durable Object storage — never rely on local disk
3. Bind the HTTP port before the health check runs, or the instance never becomes ready
4. Make initialization idempotent — it may run many times across restarts
5. Log a single startup line with version and instance ID for correlation

## Shutdown Contract

1. On rollout or scale-down the process receives SIGTERM
2. It has 15 minutes to finish in-flight requests, then receives SIGKILL
3. Finish in-flight work, flush buffers to durable storage, then exit with code 0
4. Do not spawn detached work that assumes the instance outlives the request
5. Treat SIGKILL as a possibility — design all writes to be recoverable

## Scheduling Policies

| Policy | Behavior | Use when |
|--------|----------|----------|
| `default` | Cloudflare may schedule the instance on any machine; restart is fast | Most workloads |
| `durable_object` (beta) | Pins the instance to the machine holding its Durable Object storage | Latency-sensitive state locality |

`durable_object` removes the post-restart cold start for the pinned instance but is beta — re-check behavior before relying on it.

## Scaling

- No autoscaling: a request either pins to an ID or spreads over a fixed count.
- `getContainer(env.BINDING, "tenant-42")` — stable mapping for multi-tenant or room-based routing.
- `getRandom(env.BINDING, 8)` — pick one of 8 instances; raise the count with the load.
- `max_instances` in config is the hard ceiling; requests beyond it fail rather than queue.
- Instance count is not derived from CPU or memory — measure concurrency and choose deliberately.

## Rollout Sequence

1. `wrangler deploy` builds the new image, pushes it, and deploys a new Worker version
2. New requests go to instances running the new image
3. Old instances receive SIGTERM and drain for up to 15 minutes
4. Remaining processes receive SIGKILL
5. Roll back by deploying the previous Worker version and image tag

Watch `wrangler tail` for startup failures, repeated restarts, and drained-request errors during the window.

## Persistence Rules

| Data | Store in |
|------|----------|
| User or session state | Durable Object storage, D1 |
| Files and blobs | R2 |
| Cache | KV or the container process memory (lossy) |
| Secrets | Worker secrets passed through `envVars` |

Container disk and memory are never a source of truth.

## Debugging Checklist

1. Instance restarts in a loop — check for a crash before the port binds
2. Requests time out after a deploy — check the drain window and SIGTERM handler
3. 503 after idle — check `sleepAfter` and cold start tolerance in the caller
4. Missing data after restart — a write targeted the container disk instead of durable storage
5. Unexpected instance count — inspect `wrangler containers list` against `max_instances`
