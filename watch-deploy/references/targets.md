# Deployment Targets

Common deploy targets and how to obtain a preview/production URL.

## Cloudflare Pages

- Production: `https://<project-name>.pages.dev`
- Preview: printed by `wrangler pages deploy` e.g. `https://<hash>.<project-name>.pages.dev`
- Branch preview: `https://<branch-name>.<project-name>.pages.dev`

## Vercel

- Production: `https://<project-name>.vercel.app`
- Preview: `https://<git-commit-hash>-<project-name>.vercel.app`
- `vercel --yes` prints the deployment URL

## Netlify

- Production: `https://<site-name>.netlify.app`
- Deploy preview: printed by `netlify deploy` or in GitHub PR checks

## Railway / Render / Fly.io

- Service URL is shown in the dashboard or by the CLI after deploy
- Some platforms require a health endpoint such as `/health` or `/api/health`

## Custom domain

- Use the custom domain only after DNS propagation
- Prefer checking the platform-provided URL first to avoid false negatives
