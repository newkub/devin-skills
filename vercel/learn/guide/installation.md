# Vercel - Installation

การติดตั้งและเริ่มต้นใช้งาน Vercel

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18.x |
| bun | >= 9.x |
| Git | any recent version |

## Installation Steps

### 1. Install Vercel CLI

```bash
bun install -g vercel
```

### 2. Verify Installation

```bash
vercel --version
# Vercel CLI 34.x.x
```

### 3. Login to Vercel

```bash
vercel login
# Opens browser for authentication
```

### 4. Initialize Project

```bash
# Navigate to project
cd my-project

# Initialize
vercel

# Or link existing project
vercel link
```

## Project Structure

```
my-project/
├── vercel.json           # Configuration (optional)
├── package.json
├── src/
│   ├── pages/            # Pages Router (if using)
│   ├── app/              # App Router (if using)
│   └── api/               # API routes
├── public/               # Static files
└── .env.local            # Local environment
```

## Quick Start Examples

### Next.js

```bash
# Create new project
npx create-next-app@latest my-app
cd my-app

# Deploy
vercel
```

### React

```bash
# Create with Vite
bun create vite@latest my-react-app -- --template react-ts
cd my-react-app
bun install

# Deploy
vercel
```

### Static Site

```bash
# Any static HTML
mkdir my-static-site
cd my-static-site

# Create index.html
echo "<h1>Hello</h1>" > index.html

# Deploy
vercel
```

## Configuration

### vercel.json (Optional)

```json
{
  "version": 2,
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "framework": null,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ]
}
```

### Environment Variables

```bash
# Add production variable
vercel env add DATABASE_URL

# Development variable
vercel env add DEBUG --development

# Preview variable
vercel env add API_KEY --preview

# Pull to local
vercel env pull
```

## Local Development

### Start Dev Server

```bash
vercel dev
# Runs on http://localhost:3000
```

### With Turbo

```bash
vercel dev --turbo
# Uses Turbopack for faster refresh
```

### Debug Function

```bash
# Run specific function locally
vercel dev --listen 3001

# Debug serverless function
vercel dev --node-correlate
```

## Deployment

### Deploy to Preview

```bash
vercel
# Generates preview URL
```

### Deploy to Production

```bash
vercel --prod
# Deploys to production domain
```

### Deploy Specific Branch

```bash
vercel --prod development
# Deploys development branch to production
```

## Common Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel dev` | Start local dev server |
| `vercel login` | Authenticate |
| `vercel link` | Link to project |
| `vercel logout` | Log out |
| `vercel switch` | Switch accounts |
| `vercel teams` | Manage teams |
| `vercel domains` | Manage domains |
| `vercel certs` | Manage SSL certificates |
| `vercel logs` | View logs |
| `vercel inspect` | Inspect deployment |
| `vercel rm` | Remove deployments |

## CI/CD Setup

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: bun ci
        
      - name: Deploy
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Generate Token

```bash
# Create token at vercel.com/tokens
vercel tokens create
```

## Framework Configuration

### Next.js

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

### Nuxt

```json
// vercel.json
{
  "framework": "nuxt",
  "buildCommand": "nuxt generate",
  "outputDirectory": ".output/public"
}
```

### Gatsby

```json
{
  "framework": null,
  "buildCommand": "gatsby build",
  "outputDirectory": "public"
}
```

## Troubleshooting

### Common Issues

```bash
# Clear cache and redeploy
vercel --force

# Check logs
vercel logs my-project

# Inspect deployment
vercel inspect <deployment-url>

# Remove stuck deployment
vercel rm <deployment-id>
```

### Build Errors

```bash
# See full build output
vercel --debug

# Check environment
vercel env pull
```

## Aliases

### Assign Domain

```bash
vercel alias set <deployment-url> example.com
```

### List Aliases

```bash
vercel aliases ls
```

## Team Management

### Invite Member

```bash
vercel teams add-member <email> --role developer
```

### Switch Team

```bash
vercel switch
```

## Next Steps

- [Configuration](./configuration.md) - การตั้งค่าเพิ่มเติม
- [Best Practices](./best-practices.md) - แนวทางที่ดีที่สุด
- [Integration](./integration.md) - การเชื่อมต่อกับ services อื่น