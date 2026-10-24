export const CATEGORIES = [
  "variable",
  "function",
  "config",
  "comment",
  "class",
  "type",
  "import",
  "file",
  "symbol",
  "diagnostic",
  "architecture",
  "change",
  "screen",
  "video",
  "runtime",
] as const

export type Category = (typeof CATEGORIES)[number]

export const SCANNED_CATEGORIES: Category[] = [
  "variable",
  "function",
  "config",
  "comment",
  "class",
  "type",
  "import",
  "file",
  "symbol",
  "diagnostic",
  "architecture",
  "change",
]

export type Provenance = {
  generator: string
  astgrepKind?: string
  language?: string
  fileHash?: string
  capturedAt: string
  source: string
}

export type Reference = {
  id: string
  category: Category
  kind: string
  name: string
  file: string
  language: string
  startLine: number
  endLine: number
  startColumn: number
  endColumn: number
  excerpt: string
  provenance: Provenance
  meta?: Record<string, string | number | boolean>
}

export type FileRecord = {
  hash: string
  language: string
  bytes: number
  refs: number
  scannedAt: string
  error?: string
}

export type Index = {
  version: number
  generatedAt: string
  root: string
  files: Record<string, FileRecord>
  refs: Reference[]
}

export type ChangeEntry = {
  path: string
  kind: "added" | "modified" | "removed"
  at: string
  refsChanged: number
}

export type ChangeSet = {
  version: number
  at: string
  entries: ChangeEntry[]
}

export type Status = {
  version: number
  state: "idle" | "scanning" | "watching" | "error"
  initializedAt: string
  lastScanAt: string | null
  lastChangeAt: string | null
  lastError: string | null
  files: number
  references: number
  watcher: {
    healthy: boolean
    startedAt: string | null
    lastEventAt: string | null
    pending: number
    ignored: number
  }
}

export type FeedbackStatus = "open" | "accepted" | "fixed" | "verified" | "rejected" | "wontfix"

export type FeedbackRecord = {
  id: string
  category: string
  description: string
  status: FeedbackStatus
  locations: string[]
  referenceIds: string[]
  createdAt: string
  updatedAt: string
  verifiedAt: string | null
  verification: { command?: string; exitCode?: number; output?: string; scanClean?: boolean } | null
  fix: {
    requestedAt: string
    authorized: boolean
    scope: string[]
    planPath: string
    appliedAt: string | null
  } | null
}

export type FixOp = {
  file: string
  startLine: number
  endLine: number
  expectedText: string
  replacement: string
}

export type FixPlan = {
  version: number
  feedbackId: string
  createdAt: string
  scope: string[]
  ops: FixOp[]
}

export type VisualEvidence = {
  id: string
  kind: "screen" | "video" | "runtime"
  label: string
  file: string
  sha256: string
  bytes: number
  capturedAt: string
  source: string
}

export type DevState = {
  pid: number | null
  command: string | null
  cwd: string | null
  startedAt: string | null
  logPath: string | null
  exitCode: number | null
  restarts: number
}
