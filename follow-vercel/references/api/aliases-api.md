# Aliases (URLs)

## List Aliases

```bash
GET /v13/aliases
```

## Create Alias

```bash
POST /v13/aliases
```

Body:
```json
{
  "deploymentId": "dpl_xxxx",
  "domain": "example.com"
}
```

## Delete Alias

```bash
DELETE /v13/aliases/:id
```
