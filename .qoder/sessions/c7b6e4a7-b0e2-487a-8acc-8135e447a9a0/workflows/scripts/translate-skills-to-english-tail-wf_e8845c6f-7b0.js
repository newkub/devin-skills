export const meta = {
  name: 'translate-skills-to-english-tail',
  description: 'Translate manifest batches 314 down to 200 from Thai to English, verified per batch (runs alongside the main sweep on a disjoint range)',
  phases: [
    { title: 'Translate', detail: 'one agent per batch, descending batch ids' },
    { title: 'Verify', detail: 're-grep batch for Thai + structural drift, fix in place' },
  ],
}

const MANIFEST = args.manifest
const RULES = `
PRESERVATION RULES (mandatory):
- Translate Thai prose into natural, idiomatic English the way an engineer would write it. Never word-for-word transliteration.
- Never change: YAML frontmatter keys; \`name:\` and \`related:\` values; skill names; \`/skill-name\` slash invocations; backticked identifiers; file/dir paths; URLs; shell commands; code inside fences (except Thai words inside comments/strings); heading levels; list markers; numbered-step order; table pipes and column counts.
- Do not add, remove, merge, split, reorder or renumber content. Each Thai passage becomes the English equivalent and nothing else. Keep the line count essentially identical.
- Keep every file at or under 250 lines.
- Keep each frontmatter \`description:\` value at or under 100 characters after translation (reword shorter if needed; never truncate mid-word).
- Preserve exact indentation, blank lines, and UTF-8 without BOM.
- Touch only the files assigned to you. Never run git add/commit/push/checkout/stash/reset. Never rename, move or delete a file. Read-only git (git show, git grep, git status) is fine.
- Other agents are translating OTHER files in this same working tree right now. Ignore anything you see changing outside your own batch, and never revert English text back to Thai.
- Technical terms that are conventionally English (API, middleware, monorepo, tree-shaking, dispatcher, ...) stay English.`

const TRANSLATE_SCHEMA = {
  type: 'object',
  properties: {
    filesAssigned: { type: 'integer' },
    filesTranslated: { type: 'integer' },
    skippedFiles: { type: 'array', items: { type: 'string' }, description: 'files that already contained no Thai' },
    notes: { type: 'string' },
  },
  required: ['filesAssigned', 'filesTranslated'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    clean: { type: 'boolean', description: 'true when no Thai remains anywhere in the batch' },
    fixedFiles: { type: 'array', items: { type: 'string' } },
    residualFiles: { type: 'array', items: { type: 'string' }, description: 'still contains Thai after your own fixes' },
    damagedFiles: { type: 'array', items: { type: 'string' }, description: 'structure/content drift vs HEAD that you could not repair' },
  },
  required: ['clean', 'residualFiles'],
}

const listCmd = (id) => `awk -F'\\t' -v id='${id}' '$1==id {print $2}' ${MANIFEST}`

const translatePrompt = (id) => `Translation batch ${id} in the Devin global-skills repo (current working directory; a Windows git repo of Markdown skill packages).

Get the files for your batch:
  ${listCmd(id)}

For each listed file: Read it in full, then rewrite every Thai passage into English in place using Edit with exact old_string/new_string matches (a whole-file Write is acceptable only if you reproduce every other line byte-for-byte). Work through the batch file by file until all of them are done. If a file already reads as clean English, leave it alone and list it in skippedFiles.

${RULES}

Your final output is structured data, not prose for a human.`

const verifyPrompt = (id) => `Adversarial verification of translation batch ${id}. Another agent claims it translated these files from Thai to English. Assume it missed things.

Get the files for your batch:
  ${listCmd(id)}

For EVERY file in the batch:
1. Thai-leftover check: run \`grep -cP '[\\x{0E00}-\\x{0E7F}]' <file>\`. Any nonzero count means the job is unfinished — translate the remaining Thai yourself.
2. Structural integrity check: compare against the committed all-Thai baseline, e.g. \`git show HEAD:<path> | wc -l\` vs \`wc -l <path>\` (drift beyond +/-2 lines is suspicious), and compare heading counts with \`grep -c '^#'\` on both versions. Investigate any mismatch: content was dropped, merged, reordered or invented. Repair it by restoring the missing/changed structure in English.
3. Quality spot check on the first, middle and last file of the batch: English that reads like machine transliteration, sentences that lost their original meaning, frontmatter \`description:\` over 100 chars, translated skill names / \`related:\` entries / paths / commands / code fences. Fix all of it.

Repair everything you find yourself, in place, following these rules:

${RULES}

Report residualFiles (Thai still present after YOUR fixes) and damagedFiles (structure you could not restore). Set clean=true only if both lists are empty. Your final output is structured data.`

const ids = []
for (let i = args.startId; i >= args.endId; i--) ids.push(String(i).padStart(3, '0'))

phase('Translate')
log(`tail range: ${ids.length} batches, descending from ${ids[0]} to ${ids[ids.length - 1]}`)

const results = (await pipeline(
  ids,
  (id) => agent(translatePrompt(id), { label: `translate:${id}`, phase: 'Translate', schema: TRANSLATE_SCHEMA }),
  (t, id) => agent(verifyPrompt(id), { label: `verify:${id}`, phase: 'Verify', schema: VERIFY_SCHEMA }).then((v) => ({ id, translate: t, verify: v })),
)).filter(Boolean)

const residual = results.flatMap((r) => (r.verify && r.verify.residualFiles) || [])
const damaged = results.flatMap((r) => (r.verify && r.verify.damagedFiles) || [])
log(`tail done: ${results.length}/${ids.length} batches, ${residual.length} residual, ${damaged.length} damaged`)

return { batches: results.length, skippedBatches: ids.length - results.length, residualFiles: residual, damagedFiles: damaged }