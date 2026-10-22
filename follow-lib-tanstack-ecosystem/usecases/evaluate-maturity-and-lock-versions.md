# Use Case — Decide How Much Maturity Risk a Library Carries

> Read the real maturity signal, then pin the version so an API change is a decision rather than a surprise. Source: https://tanstack.com/libraries (accessed 2026-10-20)

## 1. Read the maturity label, not the semver

| Label | Meaning | Acceptable for |
|-------|---------|----------------|
| stable (`v1`, `v5`, `v9` lines) | API commitments hold across minors | product features, public packages |
| `0.x` | a minor bump may break the API | internal tools, features with an owner who can absorb churn |
| alpha | API changes without notice | spikes, prototypes, devtools |
| deprecated | do not install | nothing |

A `0.x` package can be mature in quality and still break on upgrade; the label is about API stability, not bugs.

## 2. Read the installed and current versions

```bash
npm view @tanstack/react-query version
grep -n '"@tanstack/react-query"' package.json
```

Compare them before reading any docs, because docs default to the current major. `/follow-lib-tanstack-cli` provides `doc <library> <path> --docs-version <tag>` when the project is behind.

## 3. Set a risk budget per package

1. Stable → allow normal caret ranges
2. `0.x` → pin exact and schedule upgrades
3. Alpha → pin exact, keep behind a feature flag or a dev-only import
4. Deprecated → replace before adding anything beside it (`@tanstack/config` is the current example)

Journal the decision: package, label, version, and who owns the upgrade.

## 4. Pin exact for anything below 1.0

```json
{
  "dependencies": {
    "@tanstack/react-db": "0.11.1"
  }
}
```

A caret on a `0.x` range still floats patches, and `0.x` patches are allowed to change behavior. Pinning exact makes the upgrade appear in review.

## 5. Force one version in a monorepo

```json
{
  "pnpm": {
    "overrides": {
      "@tanstack/react-query": "5.104.1"
    }
  }
}
```

Two copies of a TanStack library break context and devtools bridges: the provider from one copy is invisible to hooks imported from the other.

## 6. Set the upgrade checkpoint

1. Re-read the changelog at the next minor for `0.x` packages
2. Re-run `/follow-lib-tanstack-*` docs lookups before upgrading a major
3. Upgrade one package per change, with `/run-typecheck` and `/run-test` after each
4. Remove the pin only when the package reaches a stable major

## 7. Verify

1. `npm ls @tanstack/<lib>` shows one version per library in the workspace
2. The pinned version matches the docs version used to write the code
3. No deprecated TanStack package remains in any manifest
4. `/run-typecheck` passes after a deliberate upgrade attempt

## Pitfalls

- Treating a high patch number as a stability guarantee — the major/minor line is the signal.
- Using `^` on a `0.x` package and receiving a behavioral change in a patch.
- Letting a monorepo resolve two majors of the same library, which silently splits providers.
- Reading `latest` docs while the project is pinned to an older major.
- Upgrading several TanStack packages in one commit, so the failure cannot be attributed.
- Keeping a deprecated umbrella package "because it still resolves".

## Related

- `references/apis.md`
- `best-practices/tanstack-ecosystem.md`
- `usecases/pick-library-for-a-feature.md`
- `usecases/audit-tanstack-stack.md`
