import { createServerFn } from '@tanstack/solid-start'

export interface RegenRequest {
  no: number
  title: string
  note?: string
  queuedAt?: string
}

const QUEUE_FILE = 'src/data/regenerate-queue.json'

export const queueRegenerate = createServerFn({ method: 'POST' })
  .validator((d: RegenRequest) => d)
  .handler(async ({ data }) => {
    const fs = await import('node:fs/promises')
    let list: RegenRequest[] = []
    try {
      list = JSON.parse(await fs.readFile(QUEUE_FILE, 'utf8'))
    } catch {}
    list.push({ ...data, queuedAt: new Date().toISOString() })
    await fs.writeFile(QUEUE_FILE, JSON.stringify(list, null, 2))
    return { queued: list.length }
  })

export const getRegenQueue = createServerFn({ method: 'GET' }).handler(async () => {
  const fs = await import('node:fs/promises')
  try {
    return JSON.parse(await fs.readFile(QUEUE_FILE, 'utf8')) as RegenRequest[]
  } catch {
    return [] as RegenRequest[]
  }
})
