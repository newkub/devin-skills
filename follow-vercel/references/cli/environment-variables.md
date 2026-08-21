# Environment Variables

## vercel env add

Add environment variable.

```bash
vercel env add KEY [value]
```

| Option | Description |
|--------|-------------|
| `--production` | Production only |
| `--preview` | Preview only |
| `--development` | Development only |
| `--git` | Git branch specific |

## vercel env pull

Pull environment variables locally.

```bash
vercel env pull
```

| Option | Description |
|--------|-------------|
| `--environment` | Environment (production/preview/development) |
| `--git` | Current git branch |

## vercel env rm

Remove environment variable.

```bash
vercel env rm KEY
```

## vercel env ls

List environment variables.

```bash
vercel env ls
```
