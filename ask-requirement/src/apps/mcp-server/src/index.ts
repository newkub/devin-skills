#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import {
  PLATFORM_OPTIONS,
  INTEGRATION_OPTIONS,
  PROJECT_LEVEL_OPTIONS,
  generateSummary,
  generateMarkdown,
} from "@ask-requirement/shared"
import type { RequirementForm } from "@ask-requirement/shared"

const server = new McpServer({
  name: "ask-requirement",
  version: "0.1.0",
})

server.tool(
  "get-platforms",
  "Get all available platform options with icons and descriptions",
  {},
  async () => {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(PLATFORM_OPTIONS, null, 2),
        },
      ],
    }
  },
)

server.tool(
  "get-integrations",
  "Get all available integration options with icons and descriptions",
  {},
  async () => {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(INTEGRATION_OPTIONS, null, 2),
        },
      ],
    }
  },
)

server.tool(
  "get-project-levels",
  "Get all available project level options with features lists",
  {},
  async () => {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(PROJECT_LEVEL_OPTIONS, null, 2),
        },
      ],
    }
  },
)

server.tool(
  "generate-requirement",
  "Generate a structured requirement summary from form data. Returns markdown and JSON.",
  {
    platforms: z.array(z.string()).describe("Selected platform values"),
    integrations: z.array(z.string()).describe("Selected integration values"),
    features: z.array(z.string()).describe("List of desired features"),
    targetUser: z.string().describe("Target user description"),
    expectedUsers: z.string().describe("Expected number of users"),
    competitors: z.array(z.string()).describe("List of competitors or similar projects"),
    projectLevel: z.string().describe("Project level: landing, basic-saas, or enterprise"),
    customData: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
        icon: z.string().optional(),
      }),
    ).describe("Custom key-value data for AI consumption"),
  },
  async (params) => {
    const form: RequirementForm = {
      platforms: params.platforms as RequirementForm["platforms"],
      integrations: params.integrations as RequirementForm["integrations"],
      features: params.features,
      targetUser: params.targetUser,
      expectedUsers: params.expectedUsers,
      competitors: params.competitors,
      projectLevel: params.projectLevel as RequirementForm["projectLevel"],
      customData: params.customData,
    }

    const summary = generateSummary(form)

    return {
      content: [
        {
          type: "text" as const,
          text: summary.markdown,
        },
        {
          type: "text" as const,
          text: `\n\n--- JSON ---\n${summary.json}`,
        },
      ],
    }
  },
)

server.tool(
  "generate-markdown-only",
  "Generate only markdown from form data (lightweight)",
  {
    platforms: z.array(z.string()),
    integrations: z.array(z.string()),
    features: z.array(z.string()),
    targetUser: z.string(),
    expectedUsers: z.string(),
    competitors: z.array(z.string()),
    projectLevel: z.string(),
    customData: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
        icon: z.string().optional(),
      }),
    ).optional().default([]),
  },
  async (params) => {
    const form: RequirementForm = {
      platforms: params.platforms as RequirementForm["platforms"],
      integrations: params.integrations as RequirementForm["integrations"],
      features: params.features,
      targetUser: params.targetUser,
      expectedUsers: params.expectedUsers,
      competitors: params.competitors,
      projectLevel: params.projectLevel as RequirementForm["projectLevel"],
      customData: params.customData ?? [],
    }

    const markdown = generateMarkdown(form)

    return {
      content: [
        {
          type: "text" as const,
          text: markdown,
        },
      ],
    }
  },
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error("MCP Server error:", err)
  process.exit(1)
})
