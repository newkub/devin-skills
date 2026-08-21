# Configuration Reference

Configuration options สำหรับ Next.js

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL
  }
};

module.exports = nextConfig;
```

## Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| reactStrictMode | boolean | true | Enable React strict mode |
| swcMinify | boolean | true | Use SWC minifier |
| output | string | 'standalone' | Output mode |
