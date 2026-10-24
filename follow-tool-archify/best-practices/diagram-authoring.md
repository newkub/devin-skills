# Archify Diagram Authoring — Best Practices

Patterns verified against the Archify README (MIT, `tt-a1i/archify`, v3.1) and its SKILL.md contract.

## 1. Brief The Diagram Like A Doc

- Give the prompt the type's mandatory content up front: scope, 8–12 core components, the one primary path, trust boundaries (architecture); states + retry/cancellation paths (lifecycle); sources/transforms/stores/boundaries (data flow)
- Put supporting detail in node cards, not extra edges — arrow soup fails the readability gate and the reader

## 2. Honesty Rules For Time-Based Types

- Timeline/Waterfall: mark every timestamp source — `observed` (from logs/traces) vs `illustrative`; never let a rendered diagram claim runtime impact the IR didn't author
- ERD/Class: include every column with type + keys (ERD) or selected members + relationships (Class); partial schemas mislead reviewers more than no diagram

## 3. Repair Loop

- Validation failures return machine-readable receipts (`validate --json`, `deliver --json` with stable rule codes) — apply only the listed `supportedFixes`
- Two correction rounds max; still failing → the brief was wrong (too many components, unclear primary path), fix the prompt, not the JSON by hand

## 4. Repo-Grounded Architecture Maps

- Analyze first (`/deep-analyze` or read the actual entrypoints), then generate — diagrams from memory drift
- Pin evidence to one public commit when requesting `SRC` nodes; state the commit in the artifact meta so staleness is detectable (`/git-file-history find` to re-verify later)

## 5. Delivery And Sharing

- Prefer `deliver --quality showcase` for anything shown to others; static preset for print/no-animation contexts; `meta.locale` changes chrome text only — authored content stays in its language
- Use `preview` (loopback-only) while iterating with a human; disable its update-check network call in restricted environments via `ARCHIFY_UPDATE_CHECK_DISABLED=1`
- Review the final HTML in the browser yourself (`/open-web`) before linking it in reports — validation gates don't judge taste

## 6. Architecture Delta Reviews

- `compare` needs both base and head IR authored from real states; present Before/Delta/After as review aids — it infers no risk or merge safety, don't claim any in the write-up (`/report-review` stays the findings channel)
