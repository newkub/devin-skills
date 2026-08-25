export type PlatformValue =
  | "web"
  | "desktop"
  | "cli"
  | "tui"
  | "sdk"
  | "mobile"
  | "api"
  | "extension"
  | "bot"

export type IntegrationValue =
  | "payment"
  | "auth"
  | "email"
  | "sms"
  | "push"
  | "storage"
  | "ai"
  | "analytics"
  | "maps"
  | "calendar"
  | "chat"
  | "video"
  | "social"

export type ProjectLevelValue = "landing" | "basic-saas" | "enterprise"

export interface OptionItem {
  value: string
  label: string
  icon: string
  description: string
}

export interface PlatformOption extends OptionItem {
  value: PlatformValue
}

export interface IntegrationOption extends OptionItem {
  value: IntegrationValue
}

export interface ProjectLevelOption {
  value: ProjectLevelValue
  label: string
  icon: string
  description: string
  features: string[]
}

export interface CustomDataField {
  key: string
  value: string
  icon?: string
}

export interface RequirementForm {
  platforms: PlatformValue[]
  integrations: IntegrationValue[]
  features: string[]
  targetUser: string
  expectedUsers: string
  competitors: string[]
  projectLevel: ProjectLevelValue | ""
  customData: CustomDataField[]
}

export interface RequirementSummary {
  platforms: PlatformValue[]
  integrations: IntegrationValue[]
  features: string[]
  targetUser: string
  expectedUsers: string
  competitors: string[]
  projectLevel: ProjectLevelValue
  customData: CustomDataField[]
  generatedAt: string
  markdown: string
  json: string
}
