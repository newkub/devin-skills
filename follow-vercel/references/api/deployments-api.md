# Deployments API

## List Deployments

```bash
GET /v13/deployments
```

## Create Deployment

```bash
POST /v13/deployments
```

Body:
```json
{
  "name": "my-project",
  "gitSource": {
    "type": "github",
    "repo": "user/repo",
    "ref": "main"
  }
}
```

## Get Deployment

```bash
GET /v13/deployments/:id
```

Response:
```json
{
  "id": "dpl_xxxx",
  "name": "my-project",
  "url": "my-project.vercel.app",
  "state": "READY",
  "createdAt": 1609459200000,
  "readyAt": 1609459200000,
  "meta": {
    "githubCommitMessage": "Update"
  }
}
```

## Cancel Deployment

```bash
POST /v13/deployments/:id/cancel
```

## Delete Deployment

```bash
DELETE /v13/deployments/:id
```
