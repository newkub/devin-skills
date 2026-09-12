# Library Design Checks

Reference สำหรับ library design review checks — ใช้เฉพาะ project ที่เป็น library

## API Surface And Export Strategy

1. ตรวจสอบ public API surface: exported functions/classes/types, API naming consistency, API discoverability, API minimalism (no over-export), API stability
2. ตรวจสอบ export strategy: barrel exports (`index.ts`), named exports vs default export, re-export patterns, export from subpaths, export conditions (import, require, types)
3. ตรวจสอบ module format: `ESM` support, `CJS` support, `UMD` support (if needed), dual package hazard prevention, module resolution strategy, `package.json` exports field
4. ตรวจสอบ TypeScript declarations: `.d.ts` generation, declaration map, source map, type-only exports, ambient declarations, types field in `package.json`

## Bundle And Tree-Shaking

1. ตรวจสอบ bundle size: bundle size limits, bundle size tracking, bundle composition, dependency size impact, export size analysis
2. ตรวจสอบ tree-shaking: side effects declaration (`sideEffects` field), tree-shakeable exports, pure function annotations, dead code elimination, import granularity

## Peer Dependencies And Semver

1. ตรวจสอบ peer dependencies: peer dep declaration, peer dep version range, peer dep minimal, optional peer deps, peer dep meta
2. ตรวจสอบ semver compliance: version bump strategy, breaking change detection, changelog generation, deprecation policy, sunset policy

## Compatibility And Package Config

1. ตรวจสอบ compatibility: `Node.js` version support, browser support, bundler compatibility (`Vite`, `webpack`, `Rollup`), engine field, compatibility matrix documentation
2. ตรวจสอบ `package.json` config: name, version, description, keywords, license, author, repository, homepage, bugs, files field, publishConfig, `sideEffects`, type field

## Skip Conditions

- ถ้า project ไม่ใช่ library → ข้ามทั้งหมด
- ถ้า library ไม่มี `CJS` support → ข้าม CJS checks
- ถ้า library ไม่มี peer deps → ข้าม peer deps checks

## Severity Mapping

- Critical: dual package hazard, missing TypeScript declarations, broken export, circular export, missing peer deps declaration, broken tree-shaking
- High: over-exported API, missing barrel export, inconsistent export naming, missing semver compliance, over-sized bundle, missing `sideEffects` field
- Medium: suboptimal export strategy, missing declaration map, minor bundle size, missing deprecation policy
- Low: cosmetic, minor `package.json` improvement, documentation gap
