import type {
  PlatformOption,
  IntegrationOption,
  ProjectLevelOption,
} from "./types";

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { value: "web", label: "Web", icon: "mdi-web", description: "เว็บแอปพลิเคชันบน browser" },
  { value: "desktop", label: "Desktop", icon: "mdi-monitor", description: "แอป desktop ผ่าน Tauri/Electron" },
  { value: "cli", label: "CLI", icon: "mdi-console", description: "Command-line interface" },
  { value: "tui", label: "TUI", icon: "mdi-keyboard", description: "Terminal user interface" },
  { value: "sdk", label: "SDK", icon: "mdi-package-variant", description: "Software development kit" },
  { value: "mobile", label: "Mobile", icon: "mdi-cellphone", description: "แอปมือถือ iOS/Android" },
  { value: "api", label: "API", icon: "mdi-api", description: "REST/GraphQL API server" },
  { value: "extension", label: "Extension", icon: "mdi-puzzle", description: "Browser/IDE extension" },
  { value: "bot", label: "Bot", icon: "mdi-robot", description: "Chat/Discord/Telegram bot" },
];

export const INTEGRATION_OPTIONS: IntegrationOption[] = [
  { value: "payment", label: "Payment", icon: "mdi-credit-card", description: "Stripe/PayPal payment processing" },
  { value: "auth", label: "Auth", icon: "mdi-shield-account", description: "Supabase/Auth0 authentication" },
  { value: "email", label: "Email", icon: "mdi-email", description: "Transactional email sending" },
  { value: "sms", label: "SMS", icon: "mdi-message-text", description: "SMS notifications" },
  { value: "push", label: "Push", icon: "mdi-bell", description: "Push notifications" },
  { value: "storage", label: "Storage", icon: "mdi-database", description: "File storage S3/R2" },
  { value: "ai", label: "AI", icon: "mdi-brain", description: "AI/ML integration OpenAI/Claude" },
  { value: "analytics", label: "Analytics", icon: "mdi-chart-line", description: "Analytics tracking" },
  { value: "maps", label: "Maps", icon: "mdi-map", description: "Google Maps/Mapbox" },
  { value: "calendar", label: "Calendar", icon: "mdi-calendar", description: "Calendar integration" },
  { value: "chat", label: "Chat", icon: "mdi-chat", description: "Real-time chat messaging" },
  { value: "video", label: "Video", icon: "mdi-video", description: "Video calling/streaming" },
  { value: "social", label: "Social", icon: "mdi-share-variant", description: "Social media integration" },
];

export const PROJECT_LEVEL_OPTIONS: ProjectLevelOption[] = [
  {
    value: "landing",
    label: "Landing",
    icon: "mdi-rocket-launch",
    description: "ไม่มี auth เน้น presentational content",
    features: ["Hero section", "Features showcase", "CTA buttons", "SEO optimized"],
  },
  {
    value: "basic-saas",
    label: "Basic SaaS",
    icon: "mdi-cloud",
    description: "มี auth ใช้งานได้จริง เน้น core features",
    features: ["Authentication", "Dashboard", "CRUD operations", "User settings", "Billing"],
  },
  {
    value: "enterprise",
    label: "Enterprise",
    icon: "mdi-domain",
    description: "มี auth + multi-tenant, RBAC, audit, compliance",
    features: ["Multi-tenant", "RBAC", "Audit logs", "Compliance", "SSO/SAML", "Advanced analytics", "API keys", "Webhooks"],
  },
];

export function getPlatformOption(value: string): PlatformOption | undefined {
  return PLATFORM_OPTIONS.find((p) => p.value === value);
}

export function getIntegrationOption(value: string): IntegrationOption | undefined {
  return INTEGRATION_OPTIONS.find((i) => i.value === value);
}

export function getProjectLevelOption(value: string): ProjectLevelOption | undefined {
  return PROJECT_LEVEL_OPTIONS.find((l) => l.value === value);
}
