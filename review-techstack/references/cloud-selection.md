# Cloud And Infrastructure Selection

## Goal

เลือก cloud providers, deployment targets และ infrastructure services ที่เหมาะสมกับ workload, requirements และ constraints

## Scope

ครอบคลุม compute, database, storage, edge, serverless, container, real-time, static hosting, auth, payment และ AI inference สำหรับ TypeScript/Rust projects

## Execute

1. ระบุ workload pattern: long-running, burst, scale-to-zero, CPU-heavy, edge, stateful, database, static
2. ระบุ requirements: latency, throughput, scale, persistence, budget, team familiarity, lock-in tolerance
3. ทำ `/follow-my-tech-stack` เพื่อดู cloud, deployment, storage, auth, database options ที่ใช้งาน
4. ดู `references/cloud-selection.md` สำหรับ cloud selection matrix หลายคอลัมน์
5. ระบุ trade-offs, avoid conditions, และ alternatives ของแต่ละ scenario
6. บันทึก recommended cloud providers พร้อมเหตุผล

## Selection Criteria

1. Workload pattern: long-running, burst/event, scale-to-zero, CPU-heavy, edge, stateful, database, static, real-time
2. Latency requirement: ultra-low (edge), low (regional), moderate (global with cache)
3. Scale / traffic: steady, spiky, per-user ephemeral, global
4. State / persistence: stateless, session state, strong consistency, object storage
5. Budget and cost model: pay-per-request, per container, per vCPU, data egress
6. Team expertise and lock-in tolerance: managed vs self-hosted, multi-cloud needs
7. Trade-offs and alternatives: ทุก choice มีข้อเสีย ต้องระบุ avoid conditions

## Cloud Selection Matrix

| No. | Scenario | Workload Pattern | Latency | Scale / Traffic | State / Persistence | Best Cloud | Compute / Runtime | Why | Trade-offs | Avoid If | Alternatives |
|-----|----------|------------------|---------|-----------------|---------------------|------------|-------------------|-----|------------|----------|--------------|
| 1 | API / Backend 24/7 | Long-running HTTP/TCP | Moderate | Steady | DB required | Railway | Container / Node | Managed persistent containers, built-in DB, easy deploy | Cost at scale, vendor lock-in | Need edge latency or scale-to-zero | Cloudflare Workers, Vercel, Fly.io |
| 2 | Worker / API ที burst | Event / burst compute | Low on demand | Spiky | Stateless | Cloudflare Workers | V8 isolate | Zero cold start, edge, pay-per-request | CPU/RAM limits, 50ms-CPU cap | Long-running CPU tasks, stateful sessions | Railway, AWS Lambda, Vercel Edge |
| 3 | Database | Persistent relational | Low | Depends | Strong consistency, backups | Supabase / Railway | Postgres | Managed, backups, real-time, familiar | Cost, connection limits, lock-in | Need edge SQL or serverless scale | Cloudflare D1, Neon, PlanetScale |
| 4 | Remote Desktop signaling | WebSocket / signaling | Very low | Many concurrent | Session state | Cloudflare Workers + Durable Objects | Durable Objects | Edge presence, low latency, coordination | Complex state model, vendor-specific | Simple stateless HTTP, need SQL | Railway + Redis, Fly.io |
| 5 | WebRTC / TURN / edge networking | Edge relay / UDP | Ultra-low | Many peers | Ephemeral | Cloudflare | Workers / TURN service | Global anycast, edge network | Bandwidth cost, TURN egress | Need dedicated bare metal, heavy CPU | Twilio, AWS, Jitsi Videobridge |
| 6 | CPU-heavy 24/7 | CPU-bound batch / compute | Moderate | Steady | None | Railway / AWS EC2 | Container / VM | More CPU/RAM options, stable | Not edge, cost at idle | Need auto scale-to-zero, low latency | GCP, Azure, Fly.io |
| 7 | Long-running container | Daemon / background worker | Moderate | Steady | Yes | Railway / Fly.io | Container | Persistent logs, easy deploy, regional | Cost, not global edge | Need edge distribution | Cloudflare (limited), AWS ECS |
| 8 | Container per user / session ephemeral | Sandbox execution | Low | Per user | Isolated, ephemeral | Cloudflare | Workers / isolate | Fast spawn, edge, strong isolation | CPU/RAM limits, no shell, 50ms limit | Long sessions, heavy compute | Railway, Fly.io, Firecracker |
| 9 | Object storage | Blob / file | Low | Global | Durable, cheap | Cloudflare R2 | S3-compatible | Cheap, no egress, global | Eventually consistent, no transactions | Need strong consistency, file system | AWS S3, Supabase Storage, Backblaze |
| 10 | Edge static / CDN | Static assets / JAMstack | Very low | Global | None | Cloudflare Pages | Static | Global edge, free tier, fast | Limited dynamic, build limits | Heavy SSR, API-heavy site | Vercel, Netlify, NuxtHub |
| 11 | SSR / full-stack framework | Server-rendered web | Low | Variable | Edge cache or DB | Vercel / NuxtHub / Cloudflare Pages | Serverless / Edge | Optimized for framework, preview deploys | Cost at scale, cold start possible | Need bare metal, long compute | Railway, Fly.io |
| 12 | Real-time sync / presence | WebSocket / CRDT | Very low | Many concurrent | Strong coordination | Cloudflare Durable Objects | Durable Objects | Edge state, real-time | Vendor-specific API | Need relational consistency | Supabase Realtime, Fly.io + Redis |
| 13 | Auth | Identity / tokens | Low | Variable | User data | Supabase / Better Auth / WorkOS | Managed service | Pre-built auth, security, compliance | Lock-in, cost at scale | Need custom SSO, on-prem | Auth.js, Clerk |
| 14 | AI inference | LLM / model serving | Low | Variable | Stateless / cache | Cloudflare Workers AI / Together / Replicate | Edge / GPU | Low latency, pay per request | Model limits, cost at scale | Need fine-tune, self-host | OpenRouter, AWS Bedrock, GCP Vertex |
| 15 | Payment | Transactions | Low | Variable | Financial records | Stripe | Managed service | Compliance, SDKs, webhooks | Fees, lock-in | Need regional gateway | Paddle, Lemon Squeezy |
| 16 | Email | Transactional / marketing | Low | Variable | Logs | Resend | Managed service | Simple API, deliverability | Cost at volume, no free tier forever | Need on-prem SMTP | SendGrid, Mailgun |
| 17 | Feature flags / analytics | Event tracking | Low | Variable | Event data | PostHog | Managed service | Product analytics + flags | Cost, privacy compliance | Need self-host, EU only | Amplitude, LaunchDarkly |

## Provider Notes

### Cloudflare

- เหมาะกับ: edge, serverless, scale-to-zero, static, object storage, real-time coordination, DDoS protection
- Compute: Workers (V8 isolate), Durable Objects (stateful edge), Pages (static/SSR)
- Storage: KV (key-value), R2 (object), D1 (SQLite edge)
- Trade-offs: จำกัด CPU/RAM per request, vendor lock-in, some services beta

### Railway

- เหมาะกับ: long-running containers, managed DB, easy deploy, steady workloads
- Compute: containers โดยไม่ต้องเขียน serverless
- Storage: Postgres, MySQL, Redis
- Trade-offs: cost อาจสูงกว่า serverless ถ้า traffic ต่ำ, ไม่มี edge

### Supabase

- เหมาะกับ: managed Postgres, auth, real-time, storage
- Storage: Postgres, S3-compatible storage
- Trade-offs: connection limits, cost at scale, lock-in

### Vercel / NuxtHub

- เหมาะกับ: frontend frameworks, SSR, edge functions, preview environments
- Compute: Edge Functions / Serverless
- Trade-offs: cost at scale, function duration limits

### Fly.io

- เหมาะกับ: stateful apps, long-running containers, regional deployment
- Compute: Firecracker micro-VMs
- Trade-offs: ต้อง manage มากกว่า PaaS

### AWS / GCP / Azure

- เหมาะกับ: enterprise, multi-cloud, custom infrastructure, heavy compute
- Trade-offs: complexity, cost, learning curve

## Severity Mapping For Wrong Cloud Choice

- Critical: stateful workload บน stateless edge, payment ไม่ compliance, AI บน shared CPU ทีไม่มี GPU
- High: database บน service ทีไม่รองรับ persistence, long CPU บน Workers
- Medium: egress cost สูงกว่าที่คาด, over-provision container
- Low: naming convention, provider preference mismatch

## Expected Outcome

- ทุก workload มี cloud provider / runtime ที่เหมาะสมพร้อมเหตุผล
- ระบุ trade-offs, avoid conditions, และ alternatives ชัดเจน
- ไม่มี critical wrong cloud choice
