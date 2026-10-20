---
name: run-release
description: Auto-detect platforms, release to external platforms, gen CHANGELOG
argument-hint: "[scope]"
related:
  - deep-review
  - follow-secret-manager
  - ship
  - setup-cicd
  - update-project
  - run-verify
  - resolve-errors
  - gen-changelog-md
  - publish-package-to-registry
  - use-my-packages-on-registry
  - update-devin-global-skills

---

## Goal

Auto-detect the platforms the project supports from configuration files, release to external platforms automatically, and gen `CHANGELOG.md` from git tags with `gen-changelog-md`

## Scope

Release to npm, crates.io, VSCode Marketplace, Chrome Web Store, and Docker Hub, and gen `CHANGELOG.md` from git tags

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (release)

### 1. Check Conditions And Detect Platforms

> Goal: Confirm the release is correct and safe before running, and detect the platforms the project supports

1. Check `git branch --show-current` and `git describe --tags --exact-match` or `git tag --points-at HEAD`
   - If HEAD is not on a `v*` tag and not on `main` or `master` → stop and report
2. If on `main`/`master` but there is no tag yet → stop and recommend creating a tag or using `/ship` first
3. Check that `git status --porcelain` is clean
4. Check that CI passes for the current SHA:
   - GitHub Actions: `gh run list --branch main --json databaseId,headSha,status --limit 5`, then `/resolve-cicd <run-id>`
   - If CI has not passed yet → stop and report
5. Check that the required secrets are available (`NPM_TOKEN`, `VSCE_PAT`, `CARGO_REGISTRY_TOKEN`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`)
6. If every condition passes → detect platforms:
   - Check that `package.json` has `private: false` → supports `npm`
   - Check that `package.json` has a `publisher` field → supports `vscode`
   - Check that `Cargo.toml` exists → supports `crates`
   - Check that `manifest.json` exists → supports `webstore`
   - Check that `Dockerfile` exists → supports `docker`

### 2. Check Configuration

> Goal: Check Configuration

Verify the configuration is complete before releasing, according to the detected platforms

- `npm`: check that `package.json` has name, version, description, license, repository, homepage, files
- `vscode`: check that `package.json` has publisher, engines.vscode, activationEvents, main, contributes
- `crates`: check that `Cargo.toml` has name, version, description, license, repository, categories, keywords, edition, rust-version
- `webstore`: check that `manifest.json` has name, version, manifest_version, permissions, icons, action
- `docker`: check that `Dockerfile` has FROM, WORKDIR, COPY, RUN and that `.dockerignore` excludes files
- If the package manifest or release config is incomplete → run `/update-project` `### setup-package`, or set up the release tool/workflow via `/setup-cicd` + `/follow-tool-*` first, then come back and rerun `/run-release`

### 3. Setup Authentication

> Goal: Setup Authentication

Set up authentication for the detected platforms

- `npm`: use `/follow-secret-manager` to manage `NPM_TOKEN`, then sync it to GitHub Secrets, or set it manually with `gh secret set NPM_TOKEN`
- `vscode`: set `VSCE_PAT` in GitHub Secrets with `gh secret set VSCE_PAT`
- `crates`: set `CARGO_REGISTRY_TOKEN` in GitHub Secrets with `gh secret set CARGO_REGISTRY_TOKEN`
- `webstore`: set `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` in GitHub Secrets
- `docker`: set `DOCKER_USERNAME`, `DOCKER_PASSWORD` in GitHub Secrets

### 4. Run Verify

> Goal: Run Verify

Check code quality before releasing

1. Run `/run-verify` to check code quality
2. Run `/deep-validate` before tag/release
3. If verify fails, fix the issues before continuing

### 5. Setup Release Tool

> Goal: Setup Release Tool

Set up the release tool according to the detected platforms

1. `npm`: run `/publish-package-to-registry` to set up the release tool
2. `crates`: run `/publish-package-to-registry` to set up the release tool
3. `vscode`: run `/follow-create-plugins` (vscode) to set up the release tool
4. `webstore`: run `/follow-create-plugins` (browser-wxt) to set up the release tool
5. `docker`: run `/follow-release` to set up the release tool

### 6. Run Prerelease

> Goal: Run the prerelease before the real publish

1. `npm`: run `bun run build` or `npm run build`
2. `crates`: run `cargo build` or `cargo build --release`
3. `vscode`: run `vsce package` to create the `.vsix`
4. `webstore`: run `chrome-webstore-upload validate` to validate before publishing
5. `docker`: run `docker build --no-cache` to build the image
6. If the prerelease fails → fix and rerun

### 7. Test Release Artifact

> Goal: Smoke test the artifact before publishing — never publish in this step

1. If an artifact from the prerelease step already exists and the version matches → reuse it
2. Smoke test per platform:
   - `npm`: `npm pack` + `npm install <tarball>` in a temp dir, then `node -e "require('<pkg>')"`
   - `crates`: `cargo test --release` + `cargo publish --dry-run`
   - `vscode`: validate the `.vsix` with `vsce ls`, or `code --install-extension` in a temp profile
   - `webstore`: `chrome-webstore-upload validate`, or upload as a draft
   - `docker`: `docker run --rm <image>:test --help`, or a health check
3. Check that the version in the artifact matches the manifest + audit the deps (`npm audit`, `cargo audit`)
4. If the test fails → stop and fix before proceeding, never skip ahead to publish; clean up temp files after the test

### 8. Run Release

> Goal: Run Release

Run the release according to the detected platforms

1. `npm`: run `/publish-package-to-registry`
2. `crates`: run `/publish-package-to-registry`
3. `vscode`: run `vsce publish`
4. `webstore`: run `chrome-webstore-upload`
5. `docker`: run `docker build` and `docker push`
6. If the release fails, fix it and rerun until it passes

### 9. Write Release Notes

> Goal: Write release notes that are well-summarized and easy to read, before publishing

1. Use the template from `templates/release-note.md`
2. Summarize the changes since the latest tag: pull commits with `git log <last-tag>..HEAD --oneline`
3. Categorize: `Breaking Changes`, `Features`, `Bug Fixes`, `Chores`, `Other`
4. Write in polite, concise language; no bullet longer than 2 lines
5. Include links to `CHANGELOG.md`, the release docs, and a migration guide if there are breaking changes
6. Save the result as `RELEASE_NOTES.md` or use it as the body of the GitHub Release

### 10. Generate CHANGELOG.md

> Goal: Gen `CHANGELOG.md` from git tags with `gen-changelog-md`; never edit it by hand

1. Run `/gen-changelog-md` to gen `CHANGELOG.md` from `git tag --sort=-version:refname`
2. Or run the script directly:
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md
```
3. Read the generated `CHANGELOG.md` to verify the version numbers and dates are correct
4. If an update is needed → rerun the script; never edit `CHANGELOG.md` by hand

## Rules

### 1. Conditions

- Must be on a tag `v*` or on `main`/`master` only
- If on `main` without a tag → stop and recommend `/ship`
- The working tree must be clean
- CI must pass before release
- Secrets for the detected platforms must be ready
- Never release automatically on every merge

### 2. Auto-Detection

- Check `package.json` for npm and vscode
- Check `Cargo.toml` for crates
- Check `manifest.json` for webstore
- Check `Dockerfile` for docker
- Run only the detected platforms

### 3. Configuration Requirements

- Every platform must have name, version, description, license
- `npm`: `private` must be `false`, and `repository` and `homepage` are required
- `vscode`: `publisher`, `engines.vscode`, and `contributes` are required
- `crates`: `categories`, `keywords`, `edition`, and `rust-version` are required
- `webstore`: `manifest_version`, `permissions`, and `icons` are required
- `docker`: a `.dockerignore` and a clear tag are required

### 4. Authentication

- Use API/Automation tokens, not personal tokens
- Set secrets in GitHub Secrets before release
- Verify the token has publish rights for the relevant package/extension
- `npm` alternative: use npm Trusted Publishers (OIDC) instead of a token

### 5. Release Tool Usage

- Use the `release-*` workflows to set up the release tool for each platform
- Use `/publish-package-to-registry` for npm and crates
- Always run verify before release
- Run the prerelease script before release for npm
- Run `vsce package` before publish for vscode
- Run `chrome-webstore-upload validate` before publish for webstore
- Run `docker build --no-cache` for a full rebuild

### 6. CHANGELOG.md Generation

- `CHANGELOG.md` is only generated by the `gen-changelog-md` skill from `git tag --sort=-version:refname`
- Never edit `CHANGELOG.md` by hand — if an update is needed, rerun the script
- Use `scripts/gen-release-md` for the generation logic
- Use the semantic versioning format: `vX.Y.Z` (e.g. `v1.0.0`, `v1.2.3`)
- Use annotated tags for releases
- For projects that want conventional commits grouping and changelog generation, use `/follow-tool-changelogen` instead

- Use /setup-cicd if needed
- Use /use-my-packages-on-registry if needed
- Use /deep-review if needed
- Use /update-devin-global-skills if needed (release)

- Use /resolve-errors if needed

## Expected Outcome

- Platforms are detected automatically from the project configuration
- Packages are released successfully to the detected platforms
- Versions are bumped automatically
- The changelog is generated automatically
- Git tags are created automatically
- `CHANGELOG.md` is gen'd from git tags with `gen-changelog-md`, never edited by hand
- Release notes are written as a clear, easy-to-read summary from the template
