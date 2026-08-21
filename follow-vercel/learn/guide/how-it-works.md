# Vercel - How It Works

ภาพรวมการทำงานของ Vercel

## Complete Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel Deployment Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Code Push                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  git push origin main                                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                      │                                          │
│                      ▼                                          │
│  2. Build Trigger                                                │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │     │
│  │  │   Builder   │→│   Builder   │→│   Builder   │    │     │
│  │  │  (Node)    │  │  (Node)    │  │  (Node)    │    │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │     │
│  └────────────────────────────────────────────────────────┘     │
│                      │                                          │
│                      ▼                                          │
│  3. Output Generation                                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Static Files → Serverless Functions → Edge Config    │     │
│  └────────────────────────────────────────────────────────┘     │
│                      │                                          │
│                      ▼                                          │
│  4. Distribution                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐     │     │
│  │  │ PoP │   │ PoP │   │ PoP │   │ PoP │   │ PoP │     │     │
│  │  │ US  │   │ EU  │   │ AS  │   │ SA  │   │ AU  │     │     │
│  │  └─────┘   └─────┘   └─────┘   └─────┘   └─────┘     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Build Pipeline

### Step 1: Framework Detection

```text
Vercel examines your project:
     │
     ├──▶ Check for known config files
     │         │
     │         ├── next.config.js → Next.js
     │         ├── gatsby-config.js → Gatsby
     │         ├── nuxt.config.js → Nuxt
     │         └── package.json → React/Vue/etc.
     │
     └──▶ If not detected, use custom build command
```

### Step 2: Dependency Installation

```text
┌─────────────────────────────────────────────────┐
│              bun/yarn/bun install               │
│                                                  │
│  1. Read package.json                           │
│  2. Install dependencies                       │
│  3. Cache node_modules                          │
│  4. Use cache on next build                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Step 3: Build Execution

```text
Framework-specific build:
     │
     ├──▶ Next.js → next build
     ├──▶ Gatsby → gatsby build
     ├──▶ Nuxt → nuxt generate
     └──▶ Custom → user-defined command
```

### Step 4: Output Upload

```text
Build Output:
┌─────────────────────────────────────────────────┐
│  _next/              → Static assets            │
│  api/                → Serverless functions      │
│  public/             → Static files              │
│  .next/              → Next.js build artifacts  │
└─────────────────────────────────────────────────┘
     │
     └──▶ Upload to Vercel storage
              │
              └──▶ Distribute to edge locations
```

## Request Handling

### Static Assets

```text
User Request
     │
     ├──▶ DNS → Vercel Edge
     │
     ├──▶ Check Edge Cache
     │         │
     │         ├── HIT → Return cached response
     │         │
     │         └── MISS → Fetch from origin
     │                   │
     │                   └──▶ Cache and return
     │
     └──▶ Response to user
```

### Serverless Functions

```text
User Request
     │
     ├──▶ Edge Network
     │
     ├──▶ Route to nearest function region
     │
     ├──▶ Cold start or wake function
     │
     ├──▶ Execute function
     │
     ├──▶ Return response
     │
     └──▶ Cache at edge if appropriate
```

### ISR (Incremental Static Regeneration)

```text
┌─────────────────────────────────────────────────┐
│           ISR Request Flow                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Request for page                            │
│  2. Check if cached                              │
│  3. If fresh → return cached                    │
│  4. If stale → return cached + regenerate       │
│  5. On regeneration complete → update cache      │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Edge Network Architecture

### Global PoP Distribution

```text
                    World Map

        ┌───────────────────────────────┐
        │        North America          │
        │  ┌───┐ ┌───┐ ┌───┐ ┌───┐     │
        │  │iad│ │sfo│ │den│ │lax│     │
        │  └───┘ └───┘ └───┘ └───┘     │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        │   Europe      │    Asia       │
        │  ┌───┐ ┌───┐ │  ┌───┐ ┌───┐ │
        │  │fra│ │lhr│ │  │hnd│ │sin│ │
        │  └───┘ └───┘ │  └───┘ └───┘ │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        │   South       │    Oceania    │
        │   America     │               │
        │  ┌───┐        │  ┌───┐        │
        │  │gru│        │  │syd│        │
        │  └───┘        │  └───┘        │
        └───────────────┴───────────────┘

Total: 70+ regions worldwide
```

### Smart Routing

```text
Request from: Singapore
     │
     ├──▶ Latency check to nearest regions
     │         │
     │         ├──▶ iad1: 250ms
     │         ├──▶ sfo1: 180ms
     │         ├──▶ hnd1: 50ms  ← Best
     │         └──▶ sin1: 30ms  ← Even better
     │
     └──▶ Route to sin1 (Singapore)
```

## Preview Deployment System

### PR Workflow

```text
┌─────────────────────────────────────────────────┐
│            Pull Request Flow                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Create PR                                    │
│  2. Vercel creates preview deployment           │
│  3. Preview URL generated                        │
│  4. Comment posted on PR                         │
│  5. Team reviews preview                        │
│  6. PR merged or closed                          │
│  7. Preview deleted (on close)                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### URL Format

```text
Production: https://my-project.vercel.app
Preview: https://my-project-git-feature-myusername.vercel.app
```

## Caching Layers

### Layer 1: Browser

```text
Cache-Control: public, max-age=0, must-revalidate
```

### Layer 2: Edge CDN

```text
Static files: Cache indefinitely
ISR pages: Cache until revalidation
```

### Layer 3: Build Cache

```text
node_modules: Cached between builds
Build artifacts: Reused
```

## Integration Architecture

### Git Integration

```text
GitHub/GitLab/Bitbucket
     │
     ├──▶ Webhook on push/PR
     │
     ├──▶ Vercel receives event
     │
     ├──▶ Start build
     │
     ├──▶ Update deployment status
     │
     └──▶ Post comment on PR
```

### Database Integration

```text
Vercel Serverless
     │
     ├──▶ Connects via connection string
     │
     ├──▶ Uses connection pooling
     │
     └──▶ Returns response
```

## Monitoring & Analytics

### Built-in Analytics

```text
┌─────────────────────────────────────────────────┐
│              Vercel Analytics                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  Web Vitals:                                     │
│  ├── LCP (Largest Contentful Paint)            │
│  ├── FID (First Input Delay)                   │
│  ├── CLS (Cumulative Layout Shift)             │
│  └── TTFB (Time to First Byte)                 │
│                                                  │
│  Metrics:                                        │
│  ├── Page views                                 │
│  ├── Unique visitors                           │
│  ├── Top pages                                  │
│  └── Performance over time                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Function Logs

```text
vercel logs my-project
     │
     ├──▶ Real-time log streaming
     │
     ├──▶ Filter by function
     │
     ├──▶ Search by keyword
     │
     └──▶ Export logs
```

## สรุป

1. Vercel ใช้ git-based deployment model
2. Framework auto-detection ลดการตั้งค่า
3. Build output ถูก distribute ไปทั่ว edge network
4. Preview deployments ทำงานอัตโนมัติกับ PRs
5. Caching ที่หลาย layers เพื่อ performance สูงสุด
