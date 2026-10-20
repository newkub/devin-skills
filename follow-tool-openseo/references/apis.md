| key | value |
|---|---|
| package | self-hosted web app — no npm/CLI package (deploy from source) |
| source | https://github.com/every-app/open-seo |
| version | `main` branch — deploy from source (no published CLI release) |
| license | MIT |
| docs | https://openseo.so/docs |
| homepage | https://openseo.so |
| hosting | Docker (personal) or Cloudflare (recommended, internet-facing, free plan) — hosted `app.openseo.so` optional |
| data source | BYO DataForSEO API key, usage-priced — no free data source |
| agent setup | https://openseo.so/docs/agent-setup |

| api | description | signature/example |
|---|---|---|
| keyword research | seed → volume/KD/intent + live SERPs → clusters | saved to the workspace |
| rank tracking | tracked keywords/competitors with position deltas | over time |
| site audit | crawl target pages, surface technical issues | route fixes into `/improve seo` |
| backlinks | backlink profile analysis | DataForSEO-backed |
| AI visibility | AI mentions/citations/prompts for the brand | |
| MCP server | exposes SEO workflows to agents | register the self-hosted endpoint |
| agent skills | pre-built or focused skills | `/seo-audit`, `/keyword-research`, `/competitor-analysis`, `/seo-coach` |
| Docker guide | quick single-user path | `docs/SELF_HOSTING_DOCKER.md` |
| Cloudflare guide | multi-device/team path | `docs/SELF_HOSTING_CLOUDFLARE.md` |
| DataForSEO key guide | how to create + wire the key | `docs/DATAFORSEO_API_KEY.md` |
| reports | every agent run persists as a shareable report | link, not pasted tables |
