---
description: Build and deploy Storybook
---

## Goal

Build the static Storybook and deploy it to a hosting platform

## Execute

### 1. Build Storybook

```bash
bun run build-storybook
```

The output is in the `storybook-static/` directory

### 2. Deploy to GitHub Pages

```bash
bun add -D gh-pages
```

Add script:

```json
{
  "scripts": {
    "deploy-storybook": "gh-pages -d storybook-static"
  }
}
```

Deploy:

```bash
bun run deploy-storybook
```

### 3. Deploy to Vercel

Push the code to GitHub and import the project in Vercel

### 4. Deploy to Netlify

```bash
bun add -D netlify-cli
```

Deploy:

```bash
netlify deploy --prod --dir=storybook-static
```

### 5. Deploy to Chromatic

```bash
bunx chromatic --project-token=<token>
```

## Rules

- Always build before deploying
- Test the build locally before deploying
- Configure the base path when deploying in a subdirectory
- Set environment variables for CI/CD
- Monitor the build logs for errors
