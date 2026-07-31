# Tips

## Speed Up Deployment

```bash
# Use prebuilt
vercel deploy --prebuilt

# Skip verification
vercel deploy --no-verify
```

## CI/CD

```bash
# Set token via environment
export VERCEL_TOKEN=xxx
vercel --prod
```
