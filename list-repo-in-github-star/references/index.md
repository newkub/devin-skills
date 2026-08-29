# References

## GitHub API

| Resource | URL |
|---|---|
| List starred repos | https://docs.github.com/en/rest/activity/starring |
| gh CLI | https://cli.github.com/manual/gh_api |
| [website.md](website.md) | Official resources and links |

## Commands

```bash
# current user (requires auth)
gh api --paginate user/starred?sort=created&direction=desc&per_page=100

# public user
gh api --paginate users/<username>/starred?sort=created&direction=desc&per_page=100
```

## Related Skills

| Skill | Responsibility |
|---|---|
| `/search-in-github-star` | ค้นหา repos จาก GitHub stars |
