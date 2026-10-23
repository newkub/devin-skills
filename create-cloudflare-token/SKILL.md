---
name: create-cloudflare-token
description: Create a Cloudflare API token for a use case via dashboard URL or API (with a seed token)
argument-hint: "<use-case>"
related:
  - follow-secret-manager
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - open-web-for-config-secret

---

## Goal

Create a Cloudflare API token whose permissions match the project's use case, without the AI ever seeing or storing the token secret.

## Scope

- Identify the use case, e.g. `workers`, `d1`, `pages`, `r2`, `kv`, `access`, `zero-trust`
- Generate a dashboard URL with pre-filled permissions for the user to create the token themselves
- If a seed `CLOUDFLARE_API_TOKEN` with `API Tokens: Edit` rights exists, a new token can be created through the API
- Recommend secure token storage (`wrangler secret`, GitHub Actions secrets, Infisical, gitignored `.env`)

## Execute

### 1. Identify Use Case And Permissions

> Goal: Identify Use Case And Permissions
Pick permissions based on the use case:

| Use case | Permission keys |
|---|---|
| Workers deploy | `workers_scripts` `edit`, `workers_routes` `edit`, `account_settings` `read`, `user_details` `read`, `memberships` `read` |
| D1 | `d1` `edit` (plus the Workers deploy permissions) |
| Pages | `page` `edit`, `account_settings` `read` |
| R2 | `workers_r2_storage` `edit` |
| KV | `workers_kv_storage` `edit` |
| Queues | `workers_queues` `edit` |
| Tail | `workers_tail` `read` |
| Cloudflare Access / Zero Trust | `access_orgs` `edit`, `access_apps` `edit`, `access_policies` `edit` (or `access_apps_and_policies` `write`) |
| Account info | `account_settings` `read`, `user_details` `read`, `memberships` `read` |

Cloudflare Access in particular needs these permission groups:
- `Access: Apps and Policies Write` → key `access`, type `edit`
- `Access: Organizations, Identity Providers, and Groups Write` → key `access_acct`, type `edit` (to enable the Zero Trust org)

Check the current permission keys at:
- `https://cfdata.lol/tools/api-token-url-generator/`
- `GET /client/v4/user/tokens/permission_groups` (requires a token first)

Common permission keys:
- Workers: `workers_scripts` `edit`, `workers_routes` `edit`, `workers_kv_storage` `edit`, `workers_r2` `edit`, `d1` `edit`
- Access/Zero Trust: `access` `edit`, `access_acct` `edit`
- Account: `account_settings` `read`, `user_details` `read`, `memberships` `read`
- Token management: `account_api_tokens` `edit` (for creating tokens through the API)

### 2. Generate Dashboard URL

> Goal: Create a Dashboard URL
1. Build the JSON permissions array:
   ```json
   [
     { "key": "workers_scripts", "type": "edit" },
     { "key": "workers_routes", "type": "edit" },
     { "key": "d1", "type": "edit" },
     { "key": "account_settings", "type": "read" },
     { "key": "user_details", "type": "read" },
     { "key": "memberships", "type": "read" }
   ]
   ```
2. URL-encode the JSON with `encodeURIComponent`
3. Assemble the URL:
   ```text
   https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=<ENCODED_JSON>&accountId=*&zoneId=all&name=<TOKEN_NAME>
   ```
4. Open the URL in a browser or hand it to the user

Example Bun script:
```bash
bun -e "
const perms = [
  { key: 'workers_scripts', type: 'edit' },
  { key: 'workers_routes', type: 'edit' },
  { key: 'd1', type: 'edit' },
  { key: 'account_settings', type: 'read' },
  { key: 'user_details', type: 'read' },
  { key: 'memberships', type: 'read' }
];
const name = 'projects-wrikka-com-deploy';
console.log('https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=' + encodeURIComponent(JSON.stringify(perms)) + '&accountId=*&zoneId=all&name=' + encodeURIComponent(name));
"
```

### 3. Create Token Via API (If Seed Token Available)

> Goal: Create a Token Via API If a Seed Token Is Available
If a `CLOUDFLARE_API_TOKEN` seed with `User > API Tokens > Edit` or `Account > API Tokens > Edit` rights exists:

1. Look up the permission group IDs with `GET /client/v4/user/tokens/permission_groups`
2. Create the token with `POST /client/v4/user/tokens`:
   ```json
   {
     "name": "projects-wrikka-com-access",
     "policies": [
       {
         "effect": "allow",
         "resources": {
           "com.cloudflare.api.account.<ACCOUNT_ID>": "*"
         },
         "permission_groups": [
           { "id": "<GROUP_ID>" }
         ]
       }
     ]
   }
   ```
3. Take the `value` from the response (shown only once) and let the user store it themselves

Note: an API token cannot be created through the CLI without a seed token first. If there is no seed token, use the dashboard URL from step 2.

### 4. Store Token Securely

> Goal: Store the Token Securely
- `wrangler secret put CLOUDFLARE_API_TOKEN`
- `gh secret set CLOUDFLARE_API_TOKEN --repo <owner>/<repo>` for GitHub Actions
- A gitignored `.env` for local dev
- Infisical / 1Password for a team

The AI should never write the token value to a file, unless the user pasted it in themselves.

### 5. Verify Token

> Goal: Verify the Token
Use `GET /client/v4/user/tokens/verify` to check the token's permissions:
```bash
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/user/tokens/verify
```

## Rules

1. The AI never accepts a token secret from the user and never writes it to a file
2. Have the user name the token after the project and use case
3. Scope permissions as narrowly as possible; don't grant every permission
4. Pin the account resource to a specific account ID rather than `*` unless necessary
5. For Cloudflare Access, confirm the account has Zero Trust enabled or that the token can enable it

- Use /follow-secret-manager if needed
- Use /deploy-to-cloudflare if needed
- Use /follow-service-cloudflare if needed
- Use /open-web-for-config-secret if needed (cloudflare token)

## Expected Outcome

- A dashboard URL or API command for creating the token is produced
- The user creates the token and stores it in a secret manager themselves
- The token's permissions match the use case (Workers, D1, Pages, R2, KV, Access, Zero Trust)
- The project can use the token to deploy or manage Cloudflare resources going forward

