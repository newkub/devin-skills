# Integrations

## Database Connectors

| Database | Package |
|----------|---------|
| PostgreSQL | `@vercel/postgres` |
| MySQL | `@vercel/mysql` |
| Redis | `@upstash/redis` |
| MongoDB | `mongodb` |
| PlanetScale | `@planetscale/database` |

## Monitoring

| Service | Purpose |
|---------|---------|
| Sentry | Error tracking |
| Datadog | APM |
| New Relic | Performance |
| Vercel | Built-in analytics |

## CMS Integration

```typescript
// Contentful
import { createClient } from 'contentful-management';

// Sanity
import { createClient } from '@sanity/client';

// Strapi
const response = await fetch('https://api.strapi.io/...');
```
