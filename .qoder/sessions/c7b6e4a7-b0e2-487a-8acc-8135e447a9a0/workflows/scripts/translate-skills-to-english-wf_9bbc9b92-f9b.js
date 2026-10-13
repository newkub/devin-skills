export const meta = {
  name: 'translate-skills-to-english',
  description: 'Translate every Thai skill .md file to English in place, batch by batch, then adversarially verify no Thai remains',
  phases: [
    { title: 'Translate', detail: 'one agent per batch from the frozen manifest' },
    { title: 'Verify', detail: 're-grep batch for Thai + structural drift, fix in place' },
    { title: 'Resweep', detail: 're-scan repo, build residual manifest, translate + verify again' },
  ],
}

const MAX_ROUNDS = args.maxRounds || 3

const RULES = `
PRESERVATION RULES (mandatory):
- Translate Thai prose into natural, idiomatic English the way an engineer would write it. Never word-for-word transliteration.
- Never change: YAML frontmatter keys; \`name:\` and \`related:\` values; skill names; \`/skill-name\` slash invocations; backticked identifiers; file/dir paths; URLs; shell commands; code inside fences (except Thai words inside comments/strings); heading levels; list markers; numbered-step order; table pipes and column counts.
- Do not add, remove, merge, split, reorder or renumber content. Each Thai passage becomes the English equivalent and nothing else. Keep the line count essentially identical.
- Keep every file at or under 250 lines.
- Keep each frontmatter \`description:\` value at or under 100 characters after translation (reword shorter if needed; never truncate mid-word).
- Preserve exact indentation, blank lines, and UTF-8 without BOM.
- Touch only the files assigned to you. Never run git add/commit/push/checkout/stash. Never rename, move or delete a file. Read-only git (git show, git grep, git status) is fine.
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

const SCAN_SCHEMA = {
  type: 'object',
  properties: {
    fileCount: { type: 'integer', description: 'markdown files still containing Thai, excluding submodules' },
    batchCount: { type: 'integer' },
    manifest: { type: 'string', description: 'repo-relative path of the TSV manifest you wrote' },
  },
  required: ['fileCount', 'batchCount', 'manifest'],
}

const listCmd = (manifest, id) => `awk -F'\\t' -v id='${id}' '$1==id {print $2}' ${manifest}`

function translatePrompt(manifest, id, round) {
  const files = listCmd(manifest, id)
  return `Round ${round} translation batch ${id} in the Devin global-skills repo (current working directory; a Windows git repo of Markdown skill packages).

Get the files for your batch:
  ${files}

For each listed file: Read it in full, then rewrite every Thai passage into English in place using Edit with exact old_string/new_string matches (a whole-file Write is acceptable only if you reproduce every other line byte-for-byte). Work through the batch file by file until all of them are done.

${RULES}

If a file turns out to contain no Thai, leave it untouched and list it in skippedFiles. Your final output is structured data, not prose for a human.`
}

function verifyPrompt(manifest, id, round) {
  const files = listCmd(manifest, id)
  return `Round ${round} adversarial verification of translation batch ${id}. Another agent claims it translated these files from Thai to English. Assume it missed things.

Get the files for your batch:
  ${files}

For EVERY file in the batch:
1. Thai-leftover check: run \`grep -cP '[\\x{0E00}-\\x{0E7F}]' <file>\`. Any nonzero count means the job is unfinished — translate the remaining Thai yourself.
2. Structural integrity check: compare against the committed version, e.g. \`git show HEAD:<path> | wc -l\` vs \`wc -l <path>\` (drift beyond +/-2 lines is suspicious), and compare heading counts with \`grep -c '^#' \` on both versions. Investigate any mismatch: content was dropped, merged, reordered or invented. Repair it by restoring the missing/changed structure in English.
3. Quality spot check on the first, middle and last file of the batch: English that reads like machine transliteration, sentences that lost their original meaning, frontmatter \`description:\` over 100 chars, translated skill names / \`related:\` entries / paths / commands / code fences, or lost \`/\` backticks. Fix all of it.

Repair everything you find yourself, in place, following these rules:

${RULES}

Report residualFiles (Thai still present after YOUR fixes) and damagedFiles (structure you could not restore). Set clean=true only if both lists are empty. Your final output is structured data.`
}

const runBatch = async (manifest, id, round, translatePhase, verifyPhase) => {
  const t = await agent(translatePrompt(manifest, id, round), { label: `translate:${id}`, phase: translatePhase, schema: TRANSLATE_SCHEMA })
  const v = await agent(verifyPrompt(manifest, id, round), { label: `verify:${id}`, phase: verifyPhase, schema: VERIFY_SCHEMA })
  return { id, translate: t, verify: v }
}

// ---- Round 1: the frozen full-repo manifest ----
const ids = []
for (let i = 1; i <= args.batchCount; i++) ids.push(String(i).padStart(3, '0'))
phase('Translate')
log(`round 1: ${ids.length} batches over ${args.fileCount} files (${args.lineCount} lines)`)
let roundResults = await pipeline(
  ids,
  (id) => runBatch(args.manifest, id, 1, 'Translate', 'Verify'),
)
roundResults = roundResults.filter(Boolean)

let residual = roundResults.flatMap((r) => (r.verify && r.verify.residualFiles) || [])
let damaged = roundResults.flatMap((r) => (r.verify && r.verify.damagedFiles) || [])
log(`round 1 done: ${roundResults.length}/${ids.length} batches completed, ${residual.length} residual files reported by verifiers`)

// ---- Rounds 2..N: re-scan the repo and re-sweep whatever still has Thai ----
const roundLog = [{ round: 1, batches: ids.length, residual: residual.length }]
let lastManifest = args.manifest
let finalScan = null

for (let round = 2; round <= MAX_ROUNDS; round++) {
  const scan = await agent(
    `Find every Markdown file in this repo (current working directory) that still contains Thai text, and pack them into a translation manifest.

Run exactly this (git bash; \`git grep\` emits forward-slash paths which is what we need):
  git grep -lP '[\\x{0E00}-\\x{0E7F}]' -- '*.md' | grep -v -E '^(open-files-in-web/|open-devin-in-web/|create-github-pr/)' | sort > .devin/temp/thai_list_r${round}.txt
  wc -l < .devin/temp/thai_list_r${round}.txt

Then build a TSV manifest of 5 files per batch, batch ids zero-padded to 3 digits starting at 001:
  awk '{ printf "%03d\\t%s\\n", int((NR-1)/5)+1, $0 }' .devin/temp/thai_list_r${round}.txt > .devin/temp/batches_r${round}.tsv
  cut -f1 .devin/temp/batches_r${round}.tsv | sort -u | tail -1

If the file count is 0, do not create a manifest — report fileCount 0 and batchCount 0 with manifest "".

Report fileCount (rows in the list), batchCount (highest batch id, as an integer), and manifest (repo-relative path of the TSV).`,
    { label: `scan:r${round}`, phase: 'Resweep', schema: SCAN_SCHEMA },
  )
  if (!scan) { log(`round ${round}: scan agent failed, stopping`); break }
  roundLog.push({ round, files: scan.fileCount, batches: scan.batchCount, residual: scan.fileCount })
  log(`round ${round} scan: ${scan.fileCount} files still Thai across ${scan.batchCount} batches`)
  finalScan = scan
  if (!scan.fileCount || !scan.batchCount) break
  lastManifest = scan.manifest

  const rids = []
  for (let i = 1; i <= scan.batchCount; i++) rids.push(String(i).padStart(3, '0'))
  const rr = (await pipeline(
    rids,
    (id) => runBatch(lastManifest, id, round, 'Resweep', 'Resweep'),
  )).filter(Boolean)
  residual = rr.flatMap((r) => (r.verify && r.verify.residualFiles) || [])
  damaged = rr.flatMap((r) => (r.verify && r.verify.damagedFiles) || [])
  log(`round ${round} done: ${rr.length}/${rids.length} batches, ${residual.length} residual files`)
  if (!residual.length && !damaged.length) break
}

return {
  rounds: roundLog,
  lastResweepManifest: lastManifest,
  residualFiles: residual,
  damagedFiles: damaged,
}