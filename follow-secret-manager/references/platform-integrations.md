# Platform Integrations

> Goal: configure Infisical for various platforms

Configure Infisical for various platforms

- Docker: install the CLI in the Dockerfile and use `infisical run` in `CMD`
- Kubernetes: use the Infisical Operator or sync into Kubernetes secrets
- GitHub Actions: use `Infisical/secrets-action` with OIDC authentication
  - create a machine identity in Infisical project > Access Control > Machine Identities
  - delete the default Universal Auth, then add the `OIDC Auth` method
  - set the OIDC Discovery URL and Issuer to `https://token.actions.githubusercontent.com`
  - set the Subject to `repo:<owner>/<repo>:<context>`, e.g. `repo:octocat/example-repo:ref:refs/heads/main`
  - set the Audiences to the GitHub organization URL, e.g. `https://github.com/octo-org`
  - copy the Identity ID (safe to commit in the workflow)
  - workflow example:
    ```yaml
    permissions:
      id-token: write
      contents: read
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v7
          - uses: Infisical/secrets-action@v1.0.17
            with:
              method: oidc
              identity-id: <identity-id>
              project-slug: <project-slug>
              env-slug: dev
    ```
  - use `github/actions-oidc-debugger` to help inspect token claims
  - alternative: GitHub Secret Syncs for a one-way sync Infisical → GitHub Secrets
- Vercel: use Infisical sync into Vercel environment variables
- Cloudflare Workers / Pages: keep `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in Infisical, then inject with `infisical run --env=prod -- wrangler deploy`, or use `Infisical/secrets-action` in GitHub Actions
- Terraform: use the Infisical Terraform Provider
- OIDC: use for passwordless authentication in CI/CD when supported
- Gateway & Relay: use for secure tunneling to internal resources
- PAM Proxies: use for audited access to databases (MySQL, Redis, Kubernetes)
- Infisical Agent: use the daemon for automatic secret rotation and certificate management
