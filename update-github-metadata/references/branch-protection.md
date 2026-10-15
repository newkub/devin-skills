# Branch Protection

> Protect `main` and the integration branch on GitHub with `gh api` (merged from `/follow-github`)

Use after the repo has `main` and the integration branch on remote. Never change visibility, rename the repo, delete branches, or switch the default branch to anything but `main`.

## 1. Pre-flight

1. Check `gh auth status`; if not authenticated → stop and report
2. Find `<owner/repo>`: `gh repo view --json owner,name --jq '.owner.login + "/" + .name'`
3. Determine the integration branch from `AGENTS.md` or project conventions (default: `integration`)
4. Check both branches exist on remote:
   ```bash
   gh api repos/<owner>/<repo>/branches/main
   gh api repos/<owner>/<repo>/branches/<integration-branch>
   ```
5. If the integration branch is missing on remote → create it:
   - `git fetch origin`
   - `git switch -c <integration-branch> origin/main`
   - `git push -u origin <integration-branch>`

## 2. Protection Payload

Save this JSON to `.devin/github/main-protection.json` (create the directory if missing):

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

## 3. Protect main

1. PUT the payload:
   ```bash
   gh api repos/<owner>/<repo>/branches/main/protection --method PUT --input .devin/github/main-protection.json
   ```
2. Or in PowerShell:
   ```powershell
   $body = Get-Content .devin/github/main-protection.json -Raw
   $body | gh api repos/<owner>/<repo>/branches/main/protection --method PUT --input -
   ```
3. If the API answers 422 → adjust `enforce_admins` to `null` or `{"enabled": true}` per the error message, then retry once
4. Record the status code

## 4. Protect The Integration Branch

1. Reuse the same payload but target `branches/<integration-branch>/protection`
2. Save `.devin/github/<integration-branch>-protection.json`; if required PRs are not wanted on the integration branch, set `required_pull_request_reviews` to `null`
3. `gh api repos/<owner>/<repo>/branches/<integration-branch>/protection --method PUT --input .devin/github/<integration-branch>-protection.json`

## 5. Verify

1. `gh repo view <owner/repo> --json defaultBranchRef` → must be `main`; else `gh repo edit <owner/repo> --default-branch main`
2. `gh api repos/<owner>/<repo>/branches/main/protection --jq .`
3. `gh api repos/<owner>/<repo>/branches/<integration-branch>/protection --jq .`
4. Confirm both branches have protection; open the browser with `/open-github` for a final visual check

## Rules

- `main`: PR required + status checks + no force push + no delete
- Integration branch: status checks + no force push + no delete (PR optional)
- `required_approving_review_count` starts at `0` for a solo project; raise it to `1` via `AGENTS.md` when the team grows
- Idempotent: read existing protection before updating; if the settings are already correct → skip
- Never run `git config --global` or `git init`; use the `gh` CLI for all GitHub operations
