# Edge Config

## Get Config

```bash
GET /v1/edge-config/:id
```

## Update Config

```bash
PATCH /v1/edge-config/:id
```

Body:
```json
{
  "items": [
    { "operation": "upsert", "key": "feature-flag", "value": true }
  ]
}
```
