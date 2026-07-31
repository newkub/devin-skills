# Deployment

## vercel deploy

Deploy to preview.

```bash
vercel deploy
```

| Option | Description |
|--------|-------------|
| `--prod` | Deploy to production |
| `--prebuilt` | Skip build step |
| `--force` | Force redeployment |
| `--token` | Authentication token |

## Build Options

```bash
vercel --build-env KEY=value
vercel --env KEY=value
```

## Preview URL

```bash
vercel --token <token>
```
