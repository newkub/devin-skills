# Infisical Reference

## Overview

Infisical is an open-source secrets management platform. The Infisical CLI retrieves, modifies, exports, and injects secrets into any process as environment variables. The Node.js SDK (`@infisical/sdk`) provides programmatic access.

## Version Info

- **CLI Package**: `@infisical/cli`
- **CLI Latest stable**: `0.43.125`
- **SDK Package**: `@infisical/sdk`
- **SDK Latest stable**: `5.0.2`
- **SDK Node.js requirement**: `>= 20`
- **CLI License**: MIT
- **SDK License**: ISC

## Install CLI

### macOS (Homebrew)

```sh
brew install infisical/get-cli/infisical
```

Update:

```sh
brew update && brew upgrade infisical
```

### Windows (Scoop)

```sh
scoop bucket add org https://github.com/Infisical/scoop-infisical.git
scoop install infisical
```

Update:

```sh
scoop update infisical
```

### Windows (Winget)

```sh
winget install infisical
```

### npm (Global)

```sh
bun add -g @infisical/cli
```

Update:

```sh
npm update -g @infisical/cli
```

### Debian/Ubuntu

```sh
curl -1sLf 'https://artifacts-cli.infisical.com/setup.deb.sh' | sudo -E bash
sudo apt-get update && sudo apt-get install -y infisical
```

### Alpine

```sh
apk add --no-cache bash sudo wget
wget -qO- 'https://artifacts-cli.infisical.com/setup.apk.sh' | sudo sh
apk update && sudo apk add infisical
```

### Production Recommendation

Pin the CLI version in production for consistent reinstalls. See [GitHub Releases](https://github.com/Infisical/cli/releases).

## CLI Authentication

### Interactive Login

```sh
infisical login
```

### Machine Identity (CI/CD)

```sh
infisical login --method=universal-auth --client-id=<id> --client-secret=<secret> --silent --plain
```

Supported machine identity strategies: `universal-auth`, `kubernetes`, `azure`, `gcp-id-token`, `gcp-iam`, `aws-iam`, `oidc`, `jwt`, `ldap`

### Self-Hosted

Set `INFISICAL_DOMAIN` before login (e.g. `https://eu.infisical.com`).

### Production Environment

```sh
export INFISICAL_DISABLE_UPDATE_CHECK=true
```

## CLI Commands

### Project Initialization

```sh
infisical init              # Initialize project (creates .infisical.json)
```

### Secrets Management

```sh
infisical secrets --env=dev                          # List secrets
infisical secrets get KEY --env=dev --plain --silent  # Get specific secret
infisical secrets set KEY=value --env=dev            # Set a secret
infisical secrets set CERT=@/path/to/cert.pem --env=dev  # Set from file
```

### Inject Secrets (Local Development)

```sh
infisical run --env=dev -- npm run dev               # Inject and run
infisical run --env=dev --watch -- npm run dev       # Auto-reload on change
infisical run --path="/api" -- npm run dev           # Filter by path
infisical run --tags=tag1,tag2 -- npm run dev        # Filter by tags
infisical run --command="npm run build && npm start" # Multiple commands
infisical run -- bun run dev                         # Bun project
```

### Export Secrets

```sh
infisical export --format=dotenv-export > .env       # Export to .env
infisical export --format=json > secrets.json        # Export to JSON
infisical export --format=yaml > secrets.yaml        # Export to YAML
```

## `.infisical.json` Configuration

```json
{
  "workspaceId": "<project-id>",
  "defaultEnvironment": "dev",
  "gitBranchToEnvironmentMapping": {
    "main": "prod",
    "staging": "staging",
    "dev": "dev"
  },
  "domain": "https://app.infisical.com"
}
```

This file is safe to commit — it contains no sensitive data.

## Install SDK

```sh
bun add @infisical/sdk
# or
bun add @infisical/sdk
# or
pnpm add @infisical/sdk
```

## SDK Code Example

```typescript
import { InfisicalSDK } from '@infisical/sdk';

const client = new InfisicalSDK({
  siteUrl: "https://app.infisical.com"
});

// Authenticate with machine identity
await client.auth().universalAuth.login({
  clientId: process.env.INFISICAL_CLIENT_ID,
  clientSecret: process.env.INFISICAL_CLIENT_SECRET
});

// Get a single secret
const secret = await client.secrets().getSecret({
  environment: "dev",
  projectId: "<project-id>",
  secretName: "API_KEY"
});

// List all secrets
const allSecrets = await client.secrets().listSecrets({
  environment: "dev",
  projectId: "<project-id>",
  expandSecretReferences: true
});

console.log("Fetched secrets", allSecrets);
```

Do not hardcode `clientId` and `clientSecret` — use environment variables.

## Docker Integration

```dockerfile
FROM alpine

RUN apk add --no-cache bash wget \
    && wget -qO- 'https://artifacts-cli.infisical.com/setup.apk.sh' | sh \
    && apk add --no-cache infisical

CMD ["infisical", "run", "--projectId=<project-id>", "--env=prod", "--", "npm", "start"]
```

Run with token:

```sh
docker run --env INFISICAL_TOKEN=$INFISICAL_TOKEN <your-image>
```

## GitHub Actions (OIDC)

```yaml
permissions:
  id-token: write
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Infisical/secrets-action@v1.0.9
        with:
          method: oidc
          identity-id: <identity-id>
          project-slug: <project-slug>
          env-slug: dev
```

## Environment Variables

- `INFISICAL_TOKEN` — Machine identity access token for CI/CD
- `INFISICAL_DOMAIN` — Self-hosted instance URL
- `INFISICAL_DISABLE_UPDATE_CHECK` — Set to `true` in production
- `INFISICAL_API_URL` — Custom API endpoint

## Source

- [CLI Overview](https://infisical.com/docs/cli/overview) | [CLI Usage](https://infisical.com/docs/cli/usage) | [Node.js SDK](https://infisical.com/docs/sdks/languages/node) | [Docker](https://infisical.com/docs/integrations/platforms/docker) | [Releases](https://github.com/Infisical/cli/releases)
