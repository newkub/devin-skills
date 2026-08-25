> ![Status](https://img.shields.io/badge/status-in_development-red)

# jsDelivr

Open Source CDN free for npm packages and GitHub repositories — delivers JavaScript libraries, CSS frameworks, and static assets optimized for web usage.

![CDN](https://img.shields.io/badge/CDN-Cloudflare_Fastly_BunnyCDN-1976d2)
![License](https://img.shields.io/badge/license-CC--BY--4.0-green)

```text
┌──────────────────────────────────────────────────────────┐
│  jsDelivr CDN                                            │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Browser                                           │  │
│  │     │                                              │  │
│  │     v                                              │  │
│  │  jsDelivr (Smart Load Balancer)                    │  │
│  │     │                                              │  │
│  │     ├──> Cloudflare  ──┐                           │  │
│  │     ├──> Fastly      ──┼──> Best CDN ──> Asset     │  │
│  │     └──> BunnyCDN    ──┘                           │  │
│  │                                                    │  │
│  │  Automatic Failover + China Support                │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Use Via CDN — `https://cdn.jsdelivr.net/npm/<package>@<version>`
   ```html
   <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
   ```
2. Use ES Modules — `https://esm.run/<package>@<version>`
   ```html
   <script type="module">
     import { createApp } from 'https://esm.run/vue@3';
   </script>
   ```
3. Use From GitHub — `https://cdn.jsdelivr.net/gh/<user>/<repo>@<version>`
   ```html
   <script src="https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js"></script>
   ```
4. Load CSS — `https://cdn.jsdelivr.net/npm/<package>@<version>/...`
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
   ```

## Features

| Icon | Feature | Description |
|:---:|---------|-------------|
| ![icon](https://api.iconify.design/mdi:cloud-check.svg?color=%231976d2&width=16) | Multi-CDN Infrastructure | Cloudflare, Fastly, BunnyCDN combined |
| ![icon](https://api.iconify.design/mdi:scale-balance.svg?color=%23388e3c&width=16) | Smart Load Balancing | Auto-selects best CDN per request |
| ![icon](https://api.iconify.design/mdi:swap-horizontal.svg?color=%23d32f2f&width=16) | Automatic Failover | Switches CDN on failure |
| ![icon](https://api.iconify.design/mdi:earth-asia.svg?color=%23f57c00&width=16) | China Support | Accessible from China |
| ![icon](https://api.iconify.design/mdi:language-javascript.svg?color=%237b1fa2&width=16) | ES Modules | Native ESM via esm.run |
| ![icon](https://api.iconify.design/mdi:merge.svg?color=%23c2185b&width=16) | File Combining | Merge multiple files into one request |
| ![icon](https://api.iconify.design/mdi:tag-multiple.svg?color=%23303f9f&width=16) | Version Resolution | Semver, tags, ranges supported |
| ![icon](https://api.iconify.design/mdi:account-check.svg?color=%230097a7&width=16) | No Registration | Use immediately, no signup needed |

## Usage

### Usage via Web

Add `<script>` or `<link>` tags directly in HTML — no install required.

```text
┌──────────────────────────────────────────────────────────┐
│  Browser                                                 │
│     │                                                    │
│     v                                                    │
│  jsDelivr (Smart Load Balancer)                          │
│     │                                                    │
│     ├──> Cloudflare  ──┐                                 │
│     ├──> Fastly      ──┼──> Best CDN ──> Asset           │
│     └──> BunnyCDN    ──┘                                 │
│                                                          │
│  Automatic Failover + China Support                      │
└──────────────────────────────────────────────────────────┘
```

### Usage via ES Modules

```html
<script type="module">
  import { createApp } from 'https://esm.run/vue@3';
</script>
```

### Usage via Import Map

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://esm.run/vue@3",
    "lodash": "https://esm.run/lodash-es"
  }
}
</script>

<script type="module">
  import { createApp } from 'vue';
  import { debounce } from 'lodash';
</script>
```

### Usage via File Combining

```html
<script src="https://cdn.jsdelivr.net/combine/npm/jquery@3/dist/jquery.min.js,npm/bootstrap@5/dist/js/bootstrap.min.js"></script>
```

| api | description | options | default |
|-----|-------------|---------|---------|
| `cdn.jsdelivr.net/npm/<pkg>@<ver>` | Serve npm package | `pkg`, `ver` (semver range) | latest |
| `esm.run/<pkg>@<ver>` | Serve as ES Module | `pkg`, `ver` (semver range) | latest |
| `cdn.jsdelivr.net/gh/<user>/<repo>@<ver>` | Serve from GitHub | `user`, `repo`, `ver` | latest |
| `cdn.jsdelivr.net/combine/...` | Combine multiple files | comma-separated URLs | - |
| `data.jsdelivr.com/v1/packages/npm/<pkg>` | Data API | `pkg` | - |

## Documentation

- [Overview](intro/intro-overview.md) — Introduction to jsDelivr
- [Key Concepts](intro/intro-key-concepts.md) — Core concepts
- [When to Use](intro/intro-when-to-use.md) — Usage guidelines
- [Installation](setup/setup-installation.md) — Getting started
- [Configuration](setup/setup-configuration.md) — Configuration
- [Usage Guide](guide/guide-usage.md) — Usage guide
- [Best Practices](guide/guide-best-practices.md) — Best practices
- [API Reference](apis/api-reference.md) — API documentation
- [API Examples](apis/api-examples.md) — API examples

## License

CC-BY-4.0 — see [LICENSE.md](LICENSE.md)
