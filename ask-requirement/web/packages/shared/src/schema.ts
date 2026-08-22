import { z } from "zod"

export const platformValueSchema = z.enum([
  "web", "desktop", "cli", "tui", "sdk", "mobile", "api", "extension", "bot",
])

export const integrationValueSchema = z.enum([
  "payment", "auth", "email", "sms", "push", "storage",
  "ai", "analytics", "maps", "calendar", "chat", "video", "social",
])

export const projectLevelSchema = z.enum(["landing", "basic-saas", "enterprise"])

export const customDataFieldSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  icon: z.string().optional(),
})

export const requirementFormSchema = z.object({
  platforms: z.array(platformValueSchema),
  integrations: z.array(integrationValueSchema),
  features: z.array(z.string().min(1)),
  targetUser: z.string(),
  expectedUsers: z.string(),
  competitors: z.array(z.string()),
  projectLevel: z.union([projectLevelSchema, z.literal("")]),
  customData: z.array(customDataFieldSchema),
})

export const requirementSummarySchema = z.object({
  platforms: z.array(platformValueSchema),
  integrations: z.array(integrationValueSchema),
  features: z.array(z.string()),
  targetUser: z.string(),
  expectedUsers: z.string(),
  competitors: z.array(z.string()),
  projectLevel: projectLevelSchema,
  customData: z.array(customDataFieldSchema),
  generatedAt: z.string(),
  markdown: z.string(),
  json: z.string(),
})

export type RequirementFormInput = z.infer<typeof requirementFormSchema>
export type RequirementSummaryOutput = z.infer<typeof requirementSummarySchema>
