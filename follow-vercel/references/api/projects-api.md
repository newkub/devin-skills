# Projects API

## List Projects

```bash
GET /v6/projects
```

Response:
```json
{
  "projects": [
    {
      "id": "prj_xxxx",
      "name": "my-project",
      "framework": "nextjs",
      "createdAt": 1609459200000,
      "updatedAt": 1609459200000
    }
  ],
  "pagination": {
    "count": 20,
    "next": null
  }
}
```

## Create Project

```bash
POST /v6/projects
```

Body:
```json
{
  "name": "my-project",
  "framework": "nextjs",
  "gitRepository": {
    "type": "github",
    "repo": "user/repo"
  }
}
```

## Get Project

```bash
GET /v6/projects/:projectName
```

## Update Project

```bash
PATCH /v6/projects/:projectName
```

## Delete Project

```bash
DELETE /v6/projects/:projectName
```
