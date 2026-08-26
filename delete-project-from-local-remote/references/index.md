# References

## Official CLI Documentation

| Tool | Resource | URL |
|---|---|---|
| Wrangler | Workers CLI | https://developers.cloudflare.com/workers/wrangler/ |
| Wrangler | Commands | https://developers.cloudflare.com/workers/wrangler/commands/ |
| GitHub CLI | `gh repo delete` | https://cli.github.com/manual/gh_repo_delete |
| Git | `git remote` | https://git-scm.com/docs/git-remote |

## Related Skills

| Skill | Responsibility |
|---|---|
| `/follow-service-cloudflare` | Cloudflare services, wrangler, bindings |
| `/list-cloudflare-project` | Find Cloudflare projects in machine |
| `/delete-files` | Safe file/folder deletion |
| `/delete-git-branch` | Delete local/remote git branches |

## Safety

- ต้อง dry run และ user confirmation ก่อนดำเนินการ
- ตรวจสอบ `wrangler whoami` และ `gh auth status` ก่อนลบ resources
