# Environment Variables

## List Variables

```bash
GET /v6/projects/:projectName/env
```

## Add Variable

```bash
POST /v6/projects/:projectName/env
```

Body:
```json
{
  "key": "DATABASE_URL",
  "value": "postgres://...",
  "target": ["production", "preview", "development"],
  "type": "encrypted"
}
```

## Update Variable

```bash
PATCH /v6/projects/:projectName/env/:id
```

## Delete Variable

```bash
DELETE /v6/projects/:projectName/env/:id
```
