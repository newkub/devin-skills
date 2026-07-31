# Domains

## List Domains

```bash
GET /v6/domains
```

## Add Domain

```bash
POST /v6/domains
```

Body:
```json
{
  "name": "example.com",
  "gitBranch": "main"
}
```

## Verify Domain

```bash
POST /v6/domains/:domain/verify
```

## Delete Domain

```bash
DELETE /v6/domains/:domain
```
