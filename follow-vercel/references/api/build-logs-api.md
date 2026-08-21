# Build Logs

## Get Deployment Logs

```bash
GET /v2/deployments/:id/logs
```

Response:
```json
{
  "logs": [
    {
      "id": "log_xxxx",
      "timestamp": 1609459200000,
      "type": "stdout",
      "message": "Building..."
    }
  ]
}
```
