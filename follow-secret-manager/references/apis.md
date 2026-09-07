# Service Infisical API & Dependencies

## Install

CLI (global):

```sh
bun add -g @infisical/cli
# or
npm install -g @infisical/cli
# Windows alternatives:
scoop bucket add org https://github.com/Infisical/scoop-infisical.git && scoop install infisical
winget install infisical
# macOS:
brew install infisical/get-cli/infisical
```

Node.js SDK (programmatic access):

```sh
bun add @infisical/sdk
# or
npm install @infisical/sdk
```

## Version

- CLI latest (`@infisical/cli`): 0.43.129
- SDK latest (`@infisical/sdk`): 5.0.2 — Node.js `>= 20`
- [Package Registry (CLI)](https://www.npmjs.com/package/@infisical/cli)
- [Package Registry (SDK)](https://www.npmjs.com/package/@infisical/sdk)
- [Repository (CLI)](https://github.com/Infisical/cli)
- [Repository (platform + SDK)](https://github.com/Infisical/infisical)

## Dependencies

- CLI is a Go binary distributed via npm/brew/scoop/winget and Linux package repos — no runtime deps.
- `@infisical/sdk` is a JS client; secrets can also be consumed via the REST API (`https://app.infisical.com/api`) or `INFISICAL_TOKEN` + CLI.
- Self-hosted: set `INFISICAL_DOMAIN` before `login` (e.g. `https://eu.infisical.com`).
- Production: set `INFISICAL_DISABLE_UPDATE_CHECK=true` or pass `--silent`.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `infisical login` | Authenticate (browser or machine identity) | interactive | `--method` (`universal-auth`, `kubernetes`, `azure`, `gcp-id-token`, `gcp-iam`, `aws-iam`, `oidc`, `jwt`, `ldap`), `--client-id`, `--client-secret`, `--silent`, `--plain`, `--domain` |
| `infisical login-status` | Show current login status | — | — |
| `infisical init` | Link cwd to an Infisical project (writes `.infisical.json`) | interactive | — |
| `infisical run -- <cmd>` | Inject secrets as env vars into a process | env `dev`, path `/` | `--env`, `--path` (repeatable), `--recursive`, `--watch`, `--command`, `--projectId`, `--token`, `--tags`, `--expand`, `--include-imports`, `--secret-overriding`, `--project-config-dir` |
| `infisical secrets` | Print all secrets in the project | env `dev`, path `/` | `--env`, `--path`, `--recursive`, `--projectId`, `--plain`, `--silent`, `--expand` |
| `infisical secrets get <names...>` | Print selected secrets by name | env `dev` | `--env`, `--plain`, `--silent` |
| `infisical secrets set <K=V...>` | Create or update secrets | type `shared` | `--env`, `--path`, `--type` (`shared`\|`personal`), `--tag`, `--file` (`.env`/YAML), `KEY=@file` to read from file |
| `infisical secrets delete <names...>` | Delete secrets by name | env `dev` | `--env`, `--path` |
| `infisical secrets folders get` | List folders under a path | path `/` | `--path`, `--token` |
| `infisical secrets folders create` | Create a folder in a path | — | `--path`, `--name` |
| `infisical secrets generate <name>` | Generate a random secret value | — | `--length`, `--symbols` |
| `infisical export` | Export secrets to a file/stdout | env `dev`, format `dotenv` | `--format` (`dotenv`, `json`, `yaml`, `csv`), `--env`, `--path`, `--file` |
| `infisical scan` | Scan repo for leaked secrets (gitleaks engine) | full scan | `--source`, `--baseline`, `--report-format` |
| `infisical user` | View/manage current user | — | `switch`, `update` subcommands |
| `infisical reset` | Remove stored credentials/config | prompts | — |
| `infisical token` | Issue service-token-style auth artifacts | — | subcommands per token type |
| `infisical dynamic-secrets` | Manage dynamic secrets & leases | — | `--projectId`, `--env`, `--path` |
| `infisical ssh` | SSH certificate issuance / access | — | `issue-credentials`, `register-host`, `connect` |
| `infisical pam` | Privileged access management sessions | — | `db`, `ssh`, `rdp`, `kubernetes` access subcommands |
| `infisical gateway` | Run an Infisical gateway/relay for private networks | — | `--token`, `--domain` |
| `infisical relay` | Run a network relay | — | `--name`, `--token` |
| `infisical agent` | Run the Infisical agent (auto cert/secret renewal) | — | config file |
| `infisical vault` | Configure keyring/vault backend for token storage | — | `set`, backend selection |

## SDK Quick Reference

| commands | description | default | options |
|---|---|---|---|
| `new InfisicalSDK()` | Create SDK client (`@infisical/sdk`) | cloud API endpoint | `siteUrl` for self-hosted |
| `client.auth().universalAuth.login({ clientId, clientSecret })` | Machine-identity auth | — | other auth methods available |
| `client.secrets().listSecrets({ environment, projectId })` | List secrets | — | `path`, `recursive`, `expandSecretReferences` |
| `client.secrets().getSecret({ secretName, ... })` | Get one secret | — | `environment`, `projectId`, `type` |
| `client.secrets().createSecret(...)` / `updateSecret(...)` / `deleteSecret(...)` | Write/delete secrets | shared | `secretValue`, `type`, `tagIds` |

## Source

- Official docs: https://infisical.com/docs/cli/overview
- CLI usage guide: https://infisical.com/docs/cli/usage
- Command reference: https://infisical.com/docs/cli/commands/run, https://infisical.com/docs/cli/commands/secrets
- Node.js SDK: https://infisical.com/docs/sdks/languages/node
