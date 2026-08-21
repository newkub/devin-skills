# Core Commands

## vercel

Deploy to preview environment.

```bash
vercel [path]
```

| Option | Description |
|--------|-------------|
| `--cwd` | Set working directory |
| `--token` | Set authentication token |
| `--scope` | Set team/workspace scope |

## vercel --prod

Deploy to production.

```bash
vercel --prod
```

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--token` | Set authentication token |

## vercel dev

Start local development server.

```bash
vercel dev
```

| Option | Description |
|--------|-------------|
| `--port` | Set port (default: 3000) |
| `--turbo` | Enable Turbopack |
| `--debug` | Enable debug mode |
