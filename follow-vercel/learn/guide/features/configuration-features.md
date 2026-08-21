# Configuration Features

## vercel.json

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ],
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

## Environment Variables

```bash
# Add via CLI
vercel env add DATABASE_URL

# Pull locally
vercel env pull
```
