# Use Case — Triage One Function in an Unknown Binary

> You have a native artifact and one question: what does this function do, and who calls it. Source: https://rea.tools and `docs/cli.md` (accessed 2026-10-24)

## 1. Confirm authorization and readiness

Analyze only artifacts you own or are authorized to inspect. Then check the one provider the platform allows:

```bash
rea doctor --provider ghidra --json    # or hopper, ida
```

Hopper is unavailable on Windows — there, plan for Ghidra (experimental, read-only, PE on local NTFS) or IDA. If the engine is missing, repair it; do not switch providers silently to get a green result.

## 2. Give the session an explicit provider

```text
binary_session {}
open_binary { "path": "/abs/path/target.bin", "provider_id": "ghidra" }
```

`binary_session` with `{}` also returns `result.tool_availability` — the most precise readiness check for the live connection. One provider stays bound to one session; to change it, close and reopen.

If the response is `capability_unavailable`, read `details.selection_reason`:

- `ambiguous` → pick one id from `details.candidate_ids`.
- `provider_unavailable` → the engine is broken; fix it.

## 3. Read the overview before any function

```text
binary_overview
```

Architecture, sections, imports, and entry points frequently answer the question outright. Metadata questions often need no decompiler at all — `inspect-binary-layout`, `inspect-pe-certificates`, and `inspect-elf-notes` cover layout, signing, and notes.

## 4. Locate the function by literal seed

```text
search { "query": "license_check" }
function { "name": "license_check" }
```

Search strings and imports first. A literal hit is cheaper and more trustworthy than browsing a function list, and it gives you an anchor the report can cite.

## 5. Decompile, then validate

```text
decompile { "function": "license_check" }
xrefs { "function": "license_check" }
instructions { "function": "license_check" }
```

Decompiler output is a reading aid, not ground truth. Cross-check the conclusion against strings, imports, xrefs, and instructions — a decompiler can produce a plausible signature for a call it did not resolve.

`xrefs` answers the second half of the question (who calls it) and `trace` follows the data from a seed when the question is about flow rather than shape.

## 6. Close and keep evidence

```text
export_evidence_bundle {}
close_binary {}
```

Retained evidence references are scoped to one connection. Export the bundle before closing if the finding must outlive the session; a reference from a closed session is invalid, not retryable.

## Pitfalls

- Decompiling before reading the overview → the overview often contains the answer already.
- Reporting `provider_unavailable` as "not present in the binary" → the analysis never ran.
- Treating a decompiled `strcpy`-shaped call as a confirmed overflow → validate against the disassembly and the call's actual argument width.
- Leaving the session open across unrelated tasks → the provider binding and evidence scoping follow you there.
- Recovered credentials are live until rotated — REA does not infer secrets from names, and it does not tell you one is fake.

## Related

- `references/apis.md`
- `best-practices/reverse-engineering-with-rea.md`
- `usecases/trace-electron-feature.md`
