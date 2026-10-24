# Service Cloudflare Containers Limits And Pricing

Re-verify these values before sizing a production workload; Containers limits and pricing change.

## Account Limits

| Resource | Limit |
|----------|-------|
| Total memory across instances | 6 TiB |
| Total vCPU across instances | 1,500 vCPU |
| Total disk across instances | 30 TB |
| Image storage per account | 50 GB |
| Maximum image size | 10 GiB |

`max_instances` must keep the workload inside these account ceilings. Multiply the instance type by the configured maximum before raising it.

## Runtime Limits

| Constraint | Value | Impact |
|------------|-------|--------|
| Ingress | HTTP only | Non-HTTP protocols need an HTTP wrapper |
| Disk persistence | Ephemeral | Wiped when the instance stops |
| Cold start | ~1-3 s | Tail latency after idle sleep or restart |
| Graceful shutdown | SIGTERM, 15 min, then SIGKILL | Long drains need process-level handling |
| Autoscaling | None | Caller chooses the instance |
| Scheduling | `default` or `durable_object` (beta) | `durable_object` pins the instance to its machine |

## Instance Type Sizing

| Type | vCPU | Memory | Disk | Typical use |
|------|------|--------|------|-------------|
| `lite` | 1/16 | 256 MiB | 2 GB | Small proxies, cron helpers |
| `basic` | 1/4 | 1 GiB | 4 GB | Light APIs, small workers |
| `standard-1` | 1/2 | 4 GiB | 8 GB | Default API or app server |
| `standard-2` | 1 | 6 GiB | 12 GB | Medium services |
| `standard-3` | 2 | 8 GiB | 16 GB | CPU-heavy services |
| `standard-4` | 4 | 12 GiB | 20 GB | Large runtimes, build or media jobs |

Start one type below the estimate, measure with `wrangler tail` and instance inspection, then move up only with evidence.

## Billing Model

| Dimension | Granularity | Included each month |
|-----------|-------------|---------------------|
| Memory | GiB-hours, billed per 10 ms | 25 GiB-hours |
| vCPU | vCPU-minutes, billed per 10 ms | 375 vCPU-minutes |
| Disk | GB-hours | 200 GB-hours |

- Billing follows the instance type while the instance runs, not the measured usage inside it.
- Idle instances that sleep stop consuming memory, vCPU, and disk allocation.
- Included allowances apply per account, not per container.
- Check the current pricing page before quoting cost; prices are per unit and change.

## Cost Control Checklist

1. Choose the smallest instance type that meets the measured need
2. Lower `sleepAfter` for bursty, low-traffic services
3. Keep `max_instances` no higher than the concurrency the app can actually reach
4. Use `getRandom` over a fixed small count instead of one instance per user
5. Remove unused images — image storage counts against 50 GB
6. Re-check quota after traffic changes, not only at launch
