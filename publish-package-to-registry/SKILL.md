---
name: publish-package-to-registry
description: Detect the registry, then publish to npm, crates.io, GitHub Packages, or other
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - run-release
  - run-verify
  - gen-changelog-md
  - use-bun-native-api
  - list-my-npm-packages
  - use-my-packages-on-registry
  - ship
  - ask-me
  - follow-tool-release-it
  - follow-tool-semantic-release
  - follow-tool-changelogen
  - follow-tool-changesets
  - deep-review
---

## Goal

Auto-detect the registry from the project manifest, then publish the package to npm, crates.io, GitHub Packages, or a specified registry

## Scope

Use to publish a single package to the registry detected from the project files

## Execute

### 1. Detect Registry

> Goal: Identify the project's registry and package manager

1. Read `package.json` → npm/bun registry (default), or the GitHub npm registry if `publishConfig.registry` points to `npm.pkg.github.com`
2. Read `Cargo.toml` → crates.io
3. Read `pyproject.toml` → PyPI
4. Read `Dockerfile` or `docker-compose.yml` → GitHub Container Registry (`ghcr.io`) if the image tag starts with `ghcr.io/` or there is a `.github/workflows` that pushes the package
5. If `package.json` has `private: true` → do not publish unless the user confirms
6. If it cannot be detected or there are multiple registries → run `/ask-me`

### 2. Verify

> Goal: Verify quality before publishing

1. Run `/run-verify`
2. Check that the version is valid per semver
3. Run `/gen-changelog-md` or check `CHANGELOG.md`
4. Check authentication:
   - npm: `npm whoami`
   - cargo: `cargo login` or `CARGO_REGISTRY_TOKEN`
   - python: `twine check` + token
   - GitHub Packages npm: `npm ping --registry https://npm.pkg.github.com` with `GITHUB_TOKEN` or `NODE_AUTH_TOKEN`
   - GitHub Container Registry (ghcr.io): `echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin`

### 3. Build

> Goal: Build the package before publishing

1. npm/bun: `bun run build` or `npm run build`
2. cargo: `cargo build --release`
3. python: `python -m build`
4. GitHub Container Registry: `docker build -t ghcr.io/OWNER/IMAGE:VERSION .`
5. If the build fails → fix it before publishing

### 4. Dry Run

> Goal: Test the publish before the real one

1. npm/bun: `npm publish --dry-run` or `bun publish --dry-run`
2. cargo: `cargo publish --dry-run`
3. python: `twine check dist/*` then `twine upload --repository testpypi dist/*` if needed
4. GitHub Packages npm: `npm publish --dry-run --registry https://npm.pkg.github.com`
5. GitHub Container Registry: `docker push --dry-run ghcr.io/OWNER/IMAGE:VERSION` or build and then inspect the image layers
6. Check warnings and size limits

### 5. Publish

> Goal: Publish the package to the registry

1. npm/bun: `bun publish` or `npm publish`
2. cargo: `cargo publish`
3. python: `twine upload dist/*`
4. GitHub Packages npm: `npm publish --registry https://npm.pkg.github.com`
5. GitHub Container Registry: `docker push ghcr.io/OWNER/IMAGE:VERSION`
6. If publishing fails → fix it and run again

### 6. Verify Publish

> Goal: Confirm the publish succeeded

1. Check the registry for the new version
2. Run `/list-my-npm-packages` if it is npm, to confirm
3. GitHub Packages: `gh package list` or open https://github.com/OWNER?tab=packages
4. Run `/suggest-next-action`

## Rules

### 1. Auto-Detection

- Use the project's main manifest to identify the registry
- GitHub Packages: check `Dockerfile` / image tag `ghcr.io` or `package.json` `publishConfig.registry` → `https://npm.pkg.github.com`
- If there are multiple manifests, let the user choose, or publish in order
- Do not assume a registry if there is no manifest

### 2. Verify Before Publish

- Always run `/run-verify` before publishing
- The version must be bumped before publishing
- The changelog must be generated with `/gen-changelog-md`

### 3. Dry Run First

- Always dry-run before the real publish when possible
- Check the package contents and warnings
- GitHub Container Registry: check the image tag, owner, and visibility (public/private) before push

### 4. Authentication And Security

- Check tokens before publishing
- Do not expose secrets in the output
- Use `/follow-secret-manager` to manage tokens, then sync to CI/CD, or use `gh secret set` manually
- GitHub Packages: requires the `write:packages` permission for `GITHUB_TOKEN`, or a classic PAT with `read:packages` + `write:packages`

### 5. Scripts

- If complex data processing is needed → run `/use-scripts`
- Use `/create-files-in-os-temp` for temp files or temporary build artifacts

- Use /run-release if needed
- Use /use-bun-native-api if needed
- Use /follow-create-cli if needed
- Use /use-my-packages-on-registry if needed
- Use /ship if needed
- Use /follow-tool-release-it if needed
- Use /follow-tool-semantic-release if needed (package to registry)
- Use /follow-tool-changelogen if needed
- Use /follow-tool-changesets if needed
- Use /deep-review if needed
- Use /follow-tool-turborepo if needed
- Use /follow-tool-pkg-new if needed

## Expected Outcome

- The package is published to the detected registry (npm, crates.io, PyPI, GitHub npm registry, or ghcr.io)
- Version, changelog, and build are correct
- Verify passes before publishing
- Dry run passes before the real one
- No secrets exposed
