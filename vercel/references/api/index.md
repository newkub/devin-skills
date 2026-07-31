# Vercel - API Reference

API และ endpoints สำหรับ Vercel

## หมวดหมู่

- [REST API](./rest-api.md) - Base URL and authentication
- [Projects API](./projects-api.md) - List, create, get, update, delete projects
- [Deployments API](./deployments-api.md) - List, create, get, cancel, delete deployments
- [Environment Variables](./environment-variables-api.md) - List, add, update, delete env variables
- [Secrets](./secrets-api.md) - Add secrets
- [Domains](./domains-api.md) - List, add, verify, delete domains
- [Aliases](./aliases-api.md) - List, create, delete aliases
- [Build Logs](./build-logs-api.md) - Get deployment logs
- [Teams](./teams-api.md) - List, get teams, invite members
- [Webhooks](./webhooks-api.md) - List, add webhooks
- [Screenshot API](./screenshot-api.md) - Get screenshots
- [Edge Config](./edge-config-api.md) - Get and update edge config
- [Rate Limits](./rate-limits.md) - API rate limits
- [Error Responses](./error-responses.md) - Error format and codes
- [SDK Usage](./sdk-usage.md) - Node.js and browser SDK
- [CLI API Integration](./cli-api-integration.md) - CLI commands

## สรุป

- Base URL: `https://api.vercel.com/v1`
- Authentication via Bearer token
- CRUD operations for projects, deployments, env vars
- Rate limits apply per endpoint type
- SDK available for Node.js and browser
