# review-dependencies — Full Dimension Checklist

## 1. Inventory

- [ ] ทุก dependency mapped: direct, dev, peer, transitive hotspots
- [ ] manifest vs lockfile consistency, workspace catalogs

## 2. Usage And Duplication

- [ ] unused deps (knip/depcheck), duplicate versions
- [ ] overlapping-purpose deps (2 HTTP clients, 2 date libs)
- [ ] bundle-impact: heavy deps in client bundle

## 3. Health And Risk

- [ ] maintenance: last release, open issues, bus factor
- [ ] security advisories (`/run-audit`), known CVEs
- [ ] install scripts, native builds, supply-chain flags
- [ ] typosquatting/deprecation status

## 4. Versions And Policy

- [ ] outdated but safe updates, majors pending + migration cost
- [ ] version pinning policy, ranges vs exact
- [ ] engine/runtime compatibility

## 5. Licenses

- [ ] license compatibility กับ project license
- [ ] copyleft/commercial restrictions flagged
- [ ] attribution requirements met

## 6. Alternatives

- [ ] lighter/faster/maintained alternatives scored
- [ ] stdlib-first opportunities, vendor vs build

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
