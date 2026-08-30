# Deploy to Vercel

Workflow for deploying projects to Vercel.

## Steps

1. Install Vercel CLI
   ```bash
   bun i -g vercel
   ```

2. Login to Vercel
   ```bash
   vercel login
   ```

3. Initialize project
   ```bash
   vercel
   ```

4. Configure project settings
   - Set framework preset
   - Configure build settings
   - Set environment variables

5. Deploy
   ```bash
   vercel --prod
   ```

## Example: Deploy Next.js

```bash
npx create-next-app@latest my-app
cd my-app
vercel
```

## Example: Deploy Static Site

```bash
vercel --prod
```

## Best Practices

- Use environment variables for secrets
- Enable preview deployments
- Configure custom domains
- Monitor analytics
- Set up automated deployments
