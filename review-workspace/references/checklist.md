# review-workspace — Full Dimension Checklist

## 1. Workspace Identity

- [ ] package manager + workspace tool detected correctly
- [ ] workspace globs/config valid, all packages discovered

## 2. Manifest

- [ ] package.json fields complete: name, version, license, engines
- [ ] scripts consistent across packages, root scripts orchestrate
- [ ] packageManager field, volta/mise pins aligned

## 3. Structure

- [ ] package boundaries clean, shared code in shared packages
- [ ] naming conventions, directory layout consistent
- [ ] no orphan/misplaced packages

## 4. Dependencies

- [ ] version consistency across workspace (single-version policy)
- [ ] catalog/workspace protocol used correctly
- [ ] dev vs prod deps placed correctly, hoisting issues

## 5. Config Consistency

- [ ] shared tsconfig/eslint/biome bases, per-package extends
- [ ] CI covers all packages, build order correct
- [ ] inter-package tsconfig references/project refs

## 6. Checks

- [ ] install clean, lockfile fresh
- [ ] build/test/lint pass workspace-wide
- [ ] publish readiness for publishable packages

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
