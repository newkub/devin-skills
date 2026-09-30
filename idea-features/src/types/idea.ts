import { z } from 'zod'

export const fileChangeSchema = z.object({
  path: z.string(),
  action: z.enum(['create', 'edit', 'delete', 'move']),
  note: z.string().default(''),
})

export const ideaSchema = z.object({
  no: z.number().int().positive(),
  title: z.string(),
  kind: z.enum(['extends', 'new']),
  category: z.string(),
  tags: z.array(z.string()),
  phase: z.enum(['mvp', 'v2', 'v3']),
  impact: z.enum(['high', 'medium', 'low']),
  effort: z.enum(['s', 'm', 'l', 'xl']),
  risk: z.string(),
  mvpScore: z.number().min(1).max(10),
  features: z.array(z.string()),
  description: z.string(),
  why: z.string(),
  usage: z.string(),
  ansi: z.string(),
  fileChanges: z.array(fileChangeSchema),
  testCases: z.array(z.string()),
})

export const ideasFileSchema = z.object({
  project: z.string().default(''),
  topic: z.string().default(''),
  generatedAt: z.string().default(''),
  ideas: z.array(ideaSchema),
})

export type FileChange = z.infer<typeof fileChangeSchema>
export type Idea = z.infer<typeof ideaSchema>
export type IdeasFile = z.infer<typeof ideasFileSchema>
