# open-github-secrets (merged content)

## Goal

Open the GitHub Secrets page to configure environment variables and secrets in a repository

## Scope

Use `open-github-secrets` for specific tasks and workflows that cover it

## Execute

### 1. Open GitHub Secrets Page

> Goal: Open GitHub Secrets Page

1. Open the URL: `https://github.com/{GITHUB_USERNAME}/{GITHUB_REPOSITORY}/settings/secrets/actions`
2. Replace `{GITHUB_USERNAME}` with your GitHub username
3. Replace `{GITHUB_REPOSITORY}` with your repository name
4. Before adding secrets, do `/follow-secret-manager` to manage secrets safely, or `/open-web-for-config-secret` to open URLs for creating API keys
5. Add the needed secrets

## Rules

1. Must have access rights to the repository settings
2. Must be the repository owner or a maintainer
3. Specify the correct repository name and username

- Use /follow-math-concepts if needed

## Expected Outcome

- The GitHub Secrets page opens successfully
- New secrets can be added
- Environment variables and secrets are accessible
