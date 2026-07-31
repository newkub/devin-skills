# Webhooks

## List Webhooks

```bash
GET /v6/projects/:projectName/webhooks
```

## Add Webhook

```bash
POST /v6/projects/:projectName/webhooks
```

Body:
```json
{
  "name": "My Webhook",
  "url": "https://example.com/webhook",
  "gitSource": {
    "type": "github"
  },
  "events": ["deployment.created", "deployment.completed"]
}
```
