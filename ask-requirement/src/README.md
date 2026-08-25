# ask-requirement
> 🚀 Structured project requirement collection tool with CLI, Web UI, and MCP Server

Collect, structure, and summarize project requirements through an interactive CLI, a web UI, or MCP-compatible AI tools. Generate markdown and JSON summaries ready for AI consumption.
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Quick Start

1. **Install Dependencies** — `terminal`
   Install all workspace dependencies
   ```bash
   bun install
   ```
2. **Build All Workspaces** — `terminal`
   Build shared package, CLI, MCP server, and web app
   ```bash
   bun run build
   ```
3. **Run The Web UI** — `terminal`
   Start the SolidStart dev server
   ```bash
   bun --filter @ask-requirement/web dev
   ```

## Features

| :---: | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| ![cli](https://api.iconify.design/mdi:console.svg?color=0097a7) | Interactive CLI | Multi-select prompts for platforms, integrations, features | Collect requirements without a browser | `bun --filter @ask-requirement/cli dev` |
| ![web](https://api.iconify.design/mdi:web.svg?color=303f9f) | Web UI | SolidStart app with live summary preview | Visual form with real-time markdown output | `bun --filter @ask-requirement/web dev` |
| ![mcp](https://api.iconify.design/mdi:server-network.svg?color=388e3c) | MCP Server | Exposes tools via stdio transport | AI tools can call requirement generation | `bun --filter @ask-requirement/mcp-server dev` |
| ![platforms](https://api.iconify.design/mdi:devices.svg?color=1976d2) | Platform Options | 9 platform types: web, desktop, cli, tui, sdk, mobile, api, extension, bot | Cover all deployment targets | `PLATFORM_OPTIONS` |
| ![integrations](https://api.iconify.design/mdi:link-variant.svg?color=7b1fa2) | Integration Options | 13 integrations: payment, auth, email, sms, push, storage, ai, analytics, maps, calendar, chat, video, social | Specify third-party services | `INTEGRATION_OPTIONS` |
| ![levels](https://api.iconify.design/mdi:stairs-up.svg?color=f57c00) | Project Levels | 3 levels: landing, basic-saas, enterprise | Match complexity to scope | `PROJECT_LEVEL_OPTIONS` |
| ![custom](https://api.iconify.design/mdi:database-plus.svg?color=c2185b) | Custom Data | Add key-value pairs with icons for AI consumption | Extend beyond predefined fields | `customData` field |
| ![summary](https://api.iconify.design/mdi:clipboard-text.svg?color=00796b) | Summary Generator | Generate markdown and JSON output | Ready for AI tools and documentation | `generateSummary(form)` |
| ![validation](https://api.iconify.design/mdi:shield-check.svg?color=d32f2f) | Zod Validation | Runtime validation for all inputs | Type-safe data flow | `requirementFormSchema` |

## Usage

### cli/index.ts

```typescript
import { PLATFORM_OPTIONS, INTEGRATION_OPTIONS, generateSummary } from "@ask-requirement/shared"

const form = {
  platforms: ["web", "mobile"],
  integrations: ["auth", "payment"],
  features: ["Booking system", "Dashboard"],
  targetUser: "SME shops",
  expectedUsers: "10,000",
  competitors: ["Calendly"],
  projectLevel: "basic-saas",
  customData: [],
}

const summary = generateSummary(form)
console.log(summary.markdown)
```

### mcp-server/index.ts

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { generateSummary } from "@ask-requirement/shared"

server.tool("generate-requirement", "Generate requirement summary", {
  platforms: z.array(z.string()),
  integrations: z.array(z.string()),
  // ... other fields
}, async (params) => {
  const summary = generateSummary(params)
  return { content: [{ type: "text", text: summary.markdown }] }
})
```

## Project

<details><summary>Goal</summary>

| :---: | Goal | Status | Description |
|------|------|--------|-------------|
| ![goal](https://api.iconify.design/mdi:target.svg?color=388e3c) | Structured requirement collection | ✓ Goal | Collect project requirements in a structured format |
| ![goal](https://api.iconify.design/mdi:format-list-text.svg?color=388e3c) | Multi-interface access | ✓ Goal | CLI, Web UI, and MCP Server interfaces |
| ![goal](https://api.iconify.design/mdi:robot.svg?color=388e3c) | AI-ready output | ✓ Goal | Generate markdown and JSON for AI consumption |
| ![nongoal](https://api.iconify.design/mdi:close.svg?color=d32f2f) | Project management | ✗ Not Goal | Not a project management tool |
| ![nongoal](https://api.iconify.design/mdi:close.svg?color=d32f2f) | Requirement tracing | ✗ Not Goal | Not a requirement traceability matrix |

</details>

<details><summary>Scope</summary>

| :---: | Scope | Status | Description |
|------|-------|--------|-------------|
| ![in](https://api.iconify.design/mdi:check.svg?color=388e3c) | Platform selection | ✓ In Scope | 9 platform types with multi-select |
| ![in](https://api.iconify.design/mdi:check.svg?color=388e3c) | Integration selection | ✓ In Scope | 13 integration types with multi-select |
| ![in](https://api.iconify.design/mdi:check.svg?color=388e3c) | Project level selection | ✓ In Scope | 3 levels with feature lists |
| ![in](https://api.iconify.design/mdi:check.svg?color=388e3c) | Custom data fields | ✓ In Scope | Key-value pairs with icons |
| ![in](https://api.iconify.design/mdi:check.svg?color=388e3c) | Summary generation | ✓ In Scope | Markdown and JSON output |
| ![out](https://api.iconify.design/mdi:close.svg?color=d32f2f) | Database storage | ✗ Out of Scope | No persistence layer |
| ![out](https://api.iconify.design/mdi:close.svg?color=d32f2f) | User accounts | ✗ Out of Scope | No authentication |

</details>

<details><summary>Key Concepts</summary>

| :---: | Concept | Description |
|------|---------|-------------|
| ![concept](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Requirement Form | Structured data model for collecting project requirements |
| ![concept](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Option Items | Predefined options with icon, label, and description |
| ![concept](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Summary Generator | Pure function that converts form data to markdown and JSON |
| ![concept](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | MCP Tools | Server-exposed tools for AI integration via stdio |

</details>

<details><summary>Core Principles</summary>

| :---: | Principle | Description |
|------|-----------|-------------|
| ![principle](https://api.iconify.design/mdi:star.svg?color=ffa000) | Shared kernel | All types, data, and logic in `packages/shared` |
| ![principle](https://api.iconify.design/mdi:star.svg?color=ffa000) | Pure functions | Summary generation is pure, no side effects |
| ![principle](https://api.iconify.design/mdi:star.svg?color=ffa000) | Type safety | Zod schemas + TypeScript strict mode throughout |
| ![principle](https://api.iconify.design/mdi:star.svg?color=ffa000) | Multi-interface | Same data model across CLI, Web, and MCP |

</details>

<details><summary>When To Use</summary>

| :---: | Use Case | Description |
|------|----------|-------------|
| ![use](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Starting a new project | Collect requirements before development |
| ![use](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | AI-assisted planning | Feed structured data to AI tools via MCP |
| ![use](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Team alignment | Share structured requirements with stakeholders |

</details>

<details><summary>Best Practices</summary>

| :---: | Practice | Description |
|------|----------|-------------|
| ![practice](https://api.iconify.design/mdi:check.svg?color=00796b) | Select project level | Always select a project level to enable summary generation |
| ![practice](https://api.iconify.design/mdi:check.svg?color=00796b) | Use custom data | Add domain-specific fields via custom data for richer context |
| ![practice](https://api.iconify.design/mdi:check.svg?color=00796b) | Copy markdown | Use the markdown output for documentation and AI prompts |

</details>

## API References

<details><summary>Shared Exports</summary>

| Export | Type | Description |
|--------|------|-------------|
| `PLATFORM_OPTIONS` | `PlatformOption[]` | 9 platform options with icon, label, description |
| `INTEGRATION_OPTIONS` | `IntegrationOption[]` | 13 integration options with icon, label, description |
| `PROJECT_LEVEL_OPTIONS` | `ProjectLevelOption[]` | 3 project levels with feature lists |
| `generateSummary(form)` | `RequirementSummary` | Generate markdown + JSON from form data |
| `generateMarkdown(form)` | `string` | Generate markdown only from form data |
| `requirementFormSchema` | `ZodSchema` | Zod schema for form validation |
| `RequirementForm` | `interface` | TypeScript type for form data |
| `RequirementSummary` | `interface` | TypeScript type for summary output |

</details>

<details><summary>MCP Tools</summary>

| Tool | Description |
|------|-------------|
| `get-platforms` | Get all available platform options |
| `get-integrations` | Get all available integration options |
| `get-project-levels` | Get all available project level options |
| `generate-requirement` | Generate markdown + JSON summary from form data |
| `generate-markdown-only` | Generate markdown only (lightweight) |

</details>

## Development

<details><summary>Tech Stack</summary>

| Layer | Technology | Version | Description |
|-------|-------------|---------|-------------|
| Runtime | Bun | >= 1.3.0 | JavaScript runtime and package manager |
| Language | TypeScript | ^5.8.0 | Type-safe development |
| Monorepo | Turborepo | ^2.5.0 | Task orchestration and caching |
| Linting | Biome | ^2.0.0 | Linting and formatting |
| Web Framework | SolidStart | ^1.3.2 | SSR web framework for SolidJS |
| UI Library | SolidJS | ^1.9.14 | Fine-grained reactive UI |
| Styling | UnoCSS | ^66.7.4 | Atomic CSS engine |
| MCP SDK | @modelcontextprotocol/sdk | ^1.29.0 | MCP server and client |
| Validation | Zod | ^4.4.3 | Runtime schema validation |

</details>

<details><summary>How It Work</summary>

```text
  +----------+     +----------+     +--------------+     +----------+
  | User     | --> | Form     | --> | Shared       | --> | Summary  |
  | Input    |     | Data     |     | Generator    |     | MD+JSON  |
  +----------+     +----------+     +--------------+     +----------+
                         |                                    |
                         v                                    v
                   +----------+                        +----------+
                   | Zod      |                        | AI Tools |
                   | Validate |                        | (MCP)    |
                   +----------+                        +----------+
```

</details>

<details><summary>Architecture</summary>

```
ask-requirement/
├── apps/
│   ├── cli/              # Interactive CLI tool (Bun runtime)
│   │   └── src/index.ts  # MCP client + interactive prompts
│   ├── mcp-server/       # MCP server (stdio transport)
│   │   └── src/index.ts  # 5 tools: get-platforms, get-integrations, etc.
│   └── web/              # SolidStart web app
│       └── src/
│           ├── routes/   # File-system routing
│           ├── app.tsx   # Root layout
│           └── entry-*.tsx
├── packages/
│   └── shared/           # Shared types, data, schemas, generator
│       └── src/
│           ├── types.ts      # TypeScript interfaces
│           ├── data.ts       # Static option data
│           ├── schema.ts     # Zod schemas
│           └── generator.ts  # Summary generation
├── turbo.json            # Turborepo task config
├── biome.jsonc           # Linting config
└── tsconfig.json         # Root TypeScript config
```

</details>

<details><summary>Scripts</summary>

```json
{
  "dev": "turbo dev",                           // Start all dev servers
  "build": "turbo build",                       // Build all workspaces
  "typecheck": "turbo typecheck",               // Type check all workspaces
  "lint": "biome lint .",                       // Lint with Biome
  "lint:fix": "biome lint --write .",           // Lint and auto-fix
  "format": "biome format --write .",           // Format with Biome
  "verify": "turbo verify",                     // Typecheck + build
  "clean": "turbo clean"                        // Clean build outputs
}
```

</details>

<details><summary>Workspaces</summary>

| Workspace | Package | Path | Description |
|-----------|---------|------|-------------|
| CLI | `@ask-requirement/cli` | `apps/cli` | Interactive CLI tool |
| MCP Server | `@ask-requirement/mcp-server` | `apps/mcp-server` | MCP server via stdio |
| Web | `@ask-requirement/web` | `apps/web` | SolidStart web UI |
| Shared | `@ask-requirement/shared` | `packages/shared` | Types, data, schemas, generator |

</details>

## License

MIT
