# Platform Integrations

> Goal: ตั้งค่า Infisical สำหรับ platforms ต่างๆ

ตั้งค่า Infisical สำหรับ platforms ต่างๆ

- Docker: ติดตั้ง CLI ใน Dockerfile และใช้ `infisical run` ใน `CMD`
- Kubernetes: ใช้ Infisical Operator หรือ sync ไป Kubernetes secrets
- GitHub Actions: ใช้ `Infisical/secrets-action` ด้วย OIDC authentication
  - สร้าง machine identity ใน Infisical project > Access Control > Machine Identities
  - ลบ Universal Auth default แล้วเพิ่ม auth method `OIDC Auth`
  - ตั้งค่า OIDC Discovery URL และ Issuer เป็น `https://token.actions.githubusercontent.com`
  - ตั้งค่า Subject `repo:<owner>/<repo>:<context>` เช่น `repo:octocat/example-repo:ref:refs/heads/main`
  - ตั้งค่า Audiences เป็น GitHub organization URL เช่น `https://github.com/octo-org`
  - คัดลอก Identity ID (safe สำหรับ commit ใน workflow)
  - Workflow example:
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
  - ใช้ `github/actions-oidc-debugger` ช่วย inspect token claims
  - ทางเลือก: GitHub Secret Syncs สำหรับ one-way sync Infisical → GitHub Secrets
- Vercel: ใช้ Infisical sync ไป Vercel environment variables
- Cloudflare Workers / Pages: เก็บ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน Infisical แล้ว inject ด้วย `infisical run --env=prod -- wrangler deploy` หรือใช้ `Infisical/secrets-action` ใน GitHub Actions
- Terraform: ใช้ Infisical Terraform Provider
- OIDC: ใช้สำหรับ passwordless authentication ใน CI/CD ถ้ารองรับ
- Gateway & Relay: ใช้สำหรับ secure tunneling ไปยัง internal resources
- PAM Proxies: ใช้สำหรับ audited access ไปยัง databases (MySQL, Redis, Kubernetes)
- Infisical Agent: ใช้ daemon สำหรับ automatic secret rotation และ certificate management
