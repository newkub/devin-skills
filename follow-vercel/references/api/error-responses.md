# Error Responses

## Error Format

```json
{
  "error": {
    "code": "not_found",
    "message": "Project not found"
  }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| `not_found` | Resource not found |
| `unauthorized` | Authentication failed |
| `forbidden` | Permission denied |
| `conflict` | Resource already exists |
| `validation_error` | Invalid request body |
| `rate_limited` | Rate limit exceeded |
