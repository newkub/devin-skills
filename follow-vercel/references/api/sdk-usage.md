# SDK Usage

## Node.js SDK

```typescript
import { createClient } from '@vercel/sdk';

const client = createClient({ token: 'xxx' });

// List projects
const projects = await client.projects.list();

// Deploy
const deployment = await client.deployments.create({
  name: 'my-project',
  gitSource: {
    type: 'github',
    repo: 'user/repo',
    ref: 'main'
  }
});
```

## Browser SDK

```typescript
import { createClient } from '@vercel/sdk/browser';

const client = createClient();
```
