export const meta = {
  name: 'translate-skills-to-english-sweep',
  description: 'Translate a batch range of remaining Thai skill .md files to English, each agent self-verifying with a Thai grep before returning',
  phases: [
    { title: 'Translate', detail: 'one agent per 8-file batch' },
    { title: 'Rescue', detail: 're-handle batches whose agent returned incomplete' },
  ],
}

const MANIFEST = args.manifest
const RULES = `
PRESERVATION RULES (mandatory):
- Translate Thai prose into natural, idiomatic English as an engineer would write it. Never word-for-word transliteration.
- Never change: YAML frontmatter keys; \`name:\` and \`related:\` values; skill names; \`/skill-name\` slash invocations; backticked identifiers; file/dir paths; URLs; shell commands; code inside fences (except Thai words inside comments/strings); heading levels; list markers; numbered-step order; table pipes and column counts.
- Do not add, remove, merge, split, reorder or renumber content. Each Thai passage becomes the English equivalent and nothing else. Keep the line count essentially identical.
- Keep every file at or under 250 lines.
- Keep each frontmatter \`description:\` value at or under 100 characters after translation (reword shorter if needed; never truncate mid-word).
- Preserve exact indentation, blank lines, and UTF-8 without BOM.
- Touch ONLY the files assigned to you. Other agents are translating other files in this same working tree right now — ignore them. Never run git add/commit/push/checkout/stash/reset. Never rename, move or delete a file. Read-only git is fine.
- Technical terms that are conventionally English (API, middleware, monorepo, dispatcher, tree-shaking, ...) stay English.`

const SCHEMA = {
  type: 'object',
  properties: {
    filesAssigned: { type: 'integer' },
    filesTranslated: { type: 'integer' },
    filesAlreadyEnglish: { type: 'array', items: { type: 'string' } },
    filesStillThai: { type: 'array', items: { type: 'string' }, description: 'must be empty — files you could not finish' },
    notes: { type: 'string' },
  },
  required: ['filesAssigned', 'filesTranslated', 'filesStillThai'],
}

const listCmd = (id) => `awk -F'\\t' -v id='${id}' '$1==id {print $2}' ${MANIFEST}`

const prompt = (id) => {
  const header = `Translation batch ${id} in the Devin global-skills repo (current working directory; Windows git repo of Markdown skill packages). Many files here were already converted to English in an earlier pass; only Thai text remains to be converted.

Get your file list:
  ${listCmd(id)}

For each file, in order: Read it in full, then convert every Thai passage to English in place with Edit (exact old_string/new_string). Skip a file that already reads as clean English and list it in filesAlreadyEnglish. Do not stop until every assigned file has been handled.

Self-verification (mandatory before you return): run grep -lP '[\\x{0E00}-\\x{0E7F}]' on each of your files and keep fixing until it reports nothing. Only list a file in filesStillThai if you genuinely could not finish it.`
  return header + RULES + '\n\nYour final output is structured data, not prose.'
}

const ids = []
if (args.direction === 'desc') {
  for (let i = args.startId; i >= args.endId; i--) ids.push(String(i).padStart(3, '0'))
} else {
  for (let i = args.startId; i <= args.endId; i++) ids.push(String(i).padStart(3, '0'))
}

phase('Translate')
log(`${ids.length} batches: ${ids[0]} -> ${ids[ids.length - 1]} (${args.direction})`)

let results = (await pipeline(
  ids,
  (id) => agent(prompt(id), { label: `translate:${id}`, phase: 'Translate', schema: SCHEMA }).then((r) => ({ id, r })),
)).filter(Boolean)

let pending = results.filter((x) => !x.r).map((x) => x.id)
  .concat(results.filter((x) => x.r && x.r.filesStillThai && x.r.filesStillThai.length).map((x) => x.id))
  .filter((v, i, a) => a.indexOf(v) === i)

if (pending.length) {
  log(`${pending.length} batches unfinished — rescuing`)
  const rescue = (await pipeline(
    pending,
    (id) => agent(`${prompt(id)}\n\nNOTE: a previous agent abandoned this batch partway, so some files may already be fully English. Finish only what is still Thai.`, { label: `rescue:${id}`, phase: 'Rescue', schema: SCHEMA }).then((r) => ({ id, r })),
  )).filter(Boolean)
  results = results.filter((x) => !pending.includes(x.id)).concat(rescue)
}

const failed = results.filter((x) => !x.r).map((x) => x.id)
const stillThai = results.flatMap((x) => (x.r && x.r.filesStillThai) || [])
log(`done: ${results.length}/${ids.length} batches, ${failed.length} agent failures, ${stillThai.length} unfinished files`)

return { batches: results.length, expected: ids.length, failedBatches: failed, unfinishedFiles: stillThai }