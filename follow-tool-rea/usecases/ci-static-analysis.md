# Use Case — Run Pinned Static Analysis in GitHub Actions

> Produce reviewable artifact evidence on every pull request without a native decompiler, a browser, or network access to the target. Source: https://rea.tools and `examples/github-actions/rea-analysis.yml` (accessed 2026-10-24)

## 1. Pin the runtime and the tool

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24.22.1

- run: npm install --global rea-agents@6.7.0
  shell: bash
```

Static JavaScript/Electron analysis needs no Ghidra, Java, Hopper, or IDA — pinning just Node and `rea-agents` is enough. Do not use `@latest` in CI: the analysis output shape is versioned, and an unpinned tool turns a green run into an unreviewable diff.

## 2. Keep the job read-only

```yaml
permissions:
  contents: read
```

The job writes one artifact and posts nothing. If you later want the result in a PR comment, add `pull-requests: write` explicitly — never grant write scope for the analyze step itself.

## 3. Analyze one artifact, keep the stream separate

```yaml
- name: Analyze
  run: |
    set -o pipefail
    rea analyze-javascript-application "$TARGET" --json > analysis.json 2> analysis.stderr
    echo "$?" > exit-code.txt
  env:
    TARGET: ./dist/app.asar
```

`set -o pipefail` matters as soon as anything is piped — otherwise a truncated stream reports success. Writing stdout and stderr to separate files keeps the evidence parseable; a mixed stream is not valid JSON.

## 4. Upload on `always()`

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: rea-analysis
    path: |
      analysis.json
      analysis.stderr
      exit-code.txt
```

Failing runs are exactly the ones you need evidence from. An upload guarded by `if: success()` discards the failing record and leaves only a red check with no artifact.

## 5. Fail the job on a real failure — and only then

```yaml
- name: Enforce exit code
  if: always()
  run: test "$(cat exit-code.txt)" -eq 0
```

Exit `0` means the analysis completed; partial evidence is allowed by contract. Exit `1` means it could not complete. `128+N` is signal-derived — `137` (SIGKILL, usually OOM) and `143` are the ones a CI runner produces; `141` appears when a pipe consumer closed early. Do not add `continue-on-error` or `|| true` to make the step green: a skipped analysis that reports success is worse than a red build.

## 6. Read coverage, not the exit code

Even on a successful run, check inside `analysis.json`:

```bash
jq '{coverage, limitations, unknowns,
     parse_failures: .data.normalized_result.statistics.parse_failures}' analysis.json
```

A non-zero `parse_failures` count means part of the bundle was not parsed, so a low finding count is not a clean bill of health. Treat `--json --full-output` as an envelope shape (`{ok,error,meta}`), never as proof that nothing was missed.

## 7. Compare builds when the PR changes one

```yaml
- run: rea compare-application-versions --before baseline.json --after analysis.json --json > diff.json
```

Items come back as `unchanged` / `added` / `removed` / `changed` / `unknown`. One-sided absence is only reported as `added` or `removed` when the opposite side has complete coverage; otherwise it is `unknown`, and the workflow must not turn `unknown` into a change or a pass.

## Pitfalls

- Installing `rea-agents@latest` → the next release silently changes output shape and the stored baseline stops comparing.
- `if: success()` on the artifact upload → the failing run leaves nothing to debug.
- `|| true` or `continue-on-error` on the analyze step → a job that skips analysis looks identical to one that found nothing.
- Trusting exit `0` as "no issues" → exit codes describe completion, not findings or coverage.
- Running the workflow with `pull_request_target` and checking out fork code → untrusted code executes with the base repo's token; analyze untrusted PR builds in a plain `pull_request` job with `contents: read`.
- Committing `analysis.json` to the repository → it contains local paths, URLs, and source-derived facts; keep it as a short-retention artifact.
- Mixing stdout and stderr with `2>&1` → the JSON payload no longer parses.

## Related

- `references/apis.md`
- `best-practices/reverse-engineering-with-rea.md`
- `usecases/trace-electron-feature.md`
