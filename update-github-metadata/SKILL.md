---
name: update-github-metadata
description: Update GitHub repo metadata (description, homepage, topics, default branch) to match the project
argument-hint: "[owner/repo]"
related:
  - git-push
  - update-project
  - follow-dot-github
  - list-github
  - list-cloudflare-projects
  - create-github
  - ask-me

---

## Goal

Update GitHub repository metadata to reflect the real project, covering description, homepage, topics, and default branch

## Scope

Use after push or after `update-project` to sync GitHub repo metadata with the content in `README.md`, `package.json`, and `AGENTS.md`, including the Cloudflare project URL from `/list-cloudflare-projects`. Covers metadata set via `gh repo edit`; does not edit code, docs, or license

## Execute

### 1. Prepare

> Goal: Check the environment before reading files

1. Verify `gh` is available by running `gh auth status`
2. If `gh` is not logged in → stop and report
3. Determine `<owner/repo>` from the argument, the `package.json` field `repository.url`, or the `origin` remote (`git remote get-url origin`)

### 2. Gather Project Info

> Goal: Gather data from project files into settable values

1. Read the first `README.md` line that is not a badge (`>`) or heading as the short `description`
2. Read the `package.json` fields: `name`, `description`, `homepage`, `repository.url`, `license`
3. Read the `AGENTS.md` `### Architecture`, `### Platform`, or `### Skills` sections to derive `topics` from the tech stack
4. If `package.json` has no `homepage` → search for `VITE_APP_URL`, `APP_URL`, or a production URL in `wrangler.toml`, `.env.example`, or `AGENTS.md`
5. If the project uses Cloudflare (has `wrangler.toml`, or `cloudflare` in `package.json` or `AGENTS.md`) → run `/list-cloudflare-projects` to find the production URL and topic candidates such as `cloudflare-workers`, `cloudflare-pages`
6. If there is no `README.md` or `package.json` → stop and report

### 3. Determine Desired Metadata

> Goal: Build the target metadata to set

1. `description` = the shortest line from `README.md` or `package.json.description` (no more than 350 characters)
2. `homepageUrl` = `package.json.homepage` → production URL from `wrangler.toml`/`.env.example`/`AGENTS.md` → URL from `/list-cloudflare-projects`
3. `defaultBranchRef` = `main` (if the project uses another branch, use that value)
4. `topics` = no more than 10 topics from the tech stack, ordered: framework > language > platform > tool > service > domain; if using Cloudflare, add `cloudflare-workers` or `cloudflare-pages` by type
5. Do not change `license` — if `licenseInfo` differs from `package.json.license`, report it but do not update

### 4. Check Current Metadata

> Goal: Know the current metadata before updating

1. Run `gh repo view <owner/repo> --json defaultBranchRef,description,homepageUrl,licenseInfo,repositoryTopics,isPrivate`
2. If `repositoryTopics` is `null`, treat the topic list as empty
3. Compare current with desired
4. Identify the fields and topics to update

### 5. Update Metadata

> Goal: Set the metadata to match the project

1. If `description` changed → run `gh repo edit <owner/repo> --description "<description>"`
2. If `homepageUrl` changed → run `gh repo edit <owner/repo> --homepage "<homepage-url>"`
3. If `defaultBranchRef` differs → run `gh repo edit <owner/repo> --default-branch <default-branch>`
4. Compute the topic diff:
   - `topics_to_add` = desired topics - current topics
   - `topics_to_remove` = current topics - desired topics
5. If `topics_to_add` is not empty → run `gh repo edit <owner/repo> --add-topic <t1> --add-topic <t2> ...` for each topic
6. If `topics_to_remove` is not empty → run `gh repo edit <owner/repo> --remove-topic <t1> --remove-topic <t2> ...`
7. If the repo is public (`isPrivate: false`) → run `gh repo edit <owner/repo> --enable-issues=true --enable-wiki=false`

### 6. Verify

> Goal: Confirm the metadata updated successfully

1. Run `gh repo view <owner/repo> --json defaultBranchRef,description,homepageUrl,licenseInfo,repositoryTopics`
2. Compare the result with the desired metadata
3. If it does not match → retry once; if it still does not match → report

### 7. Report

> Goal: Report the result concisely

1. Build a Before/After table of the changed fields
2. List the topics added/removed
3. List the fields that did not need updating
4. Report in chat; do not create a file

## Rules

### 1. Source Of Truth

- The first non-badge line of `README.md` is the main source for `description`
- `package.json` is the source of `homepage` (fall back to config/deploy)
- `AGENTS.md` `### Architecture`, `### Platform`, and `package.json` dependencies are the source of `topics`
- Do not change `license` — if it differs from `package.json.license`, report it

### 2. Topic Selection

- Never add generic topics such as `awesome`, `cool`, `project`
- Choose topics relevant to the real tech stack and discoverable on GitHub
- If the project is on Cloudflare, add `cloudflare`, `cloudflare-workers`, or `cloudflare-pages` by type
- Limit to no more than 10 topics
- Priority order: framework > language > platform > tool > service > domain

### 3. Idempotent

- Always check the current metadata first
- Compute the diff before `add`/`remove` topics
- Do not update any field whose value is unchanged
- If every field is correct → report that no update is needed; this is not an error

### 4. Safety

- Do not delete an existing license
- Do not change the repo visibility (public/private)
- Do not rename the repo
- If `gh` is unavailable → stop and report

### 5. Related Actions

- Use `/git-push` if you need to push first
- Use `/follow-dot-github` if you need to check GitHub settings
- Use `/list-github-repo` if you need to list repos
- Use `/list-cloudflare-projects` if you need to find a Cloudflare URL
- Use `/create-github-repo` if the repo does not exist yet
- Use `/ask-me` if you are unsure about topics or homepage

## Expected Outcome

- GitHub repo metadata matches `README.md` and `package.json`
- The description is concise and reflects the real project
- The homepage points to the production URL or docs
- The topics are complete and relevant to the real tech stack
- The default branch is `main` (or the value the project defines)
- A Before/After report is given in chat
