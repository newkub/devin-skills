---
description: Build และ deploy Storybook
---

## Goal

Build static Storybook และ deploy ไปยัง hosting platform

## Execute

### 1. Build Storybook

```bash
bun run build-storybook
```

Output จะอยู่ใน `storybook-static/` directory

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

Push code ไปยัง GitHub และ import project ใน Vercel

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
npx chromatic --project-token=<token>
```

## Rules

- Build ก่อน deploy เสมอ
- Test build locally ก่อน deploy
- Configure base path ถ้า deploy ใน subdirectory
- Set environment variables สำหรับ CI/CD
- Monitor build logs สำหรับ errors
