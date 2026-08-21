# Teams

## vercel teams

Manage teams.

```bash
vercel teams [command]
```

| Command | Description |
|---------|-------------|
| `ls` | List teams |
| `create` | Create team |
| `invite` | Invite member |

## vercel teams add-member

Add team member.

```bash
vercel teams add-member [email] --role [role]
```

| Role | Description |
|------|-------------|
| `OWNER` | Full control |
| `MEMBER` | Can deploy |
| `DEVELOPER` | Can deploy |
| `VIEWER` | Read-only |
