# Use Case — Release With Changesets and Trusted Publishing

> Turn reviewed release intent into published packages without storing an npm token. Source: https://tanstack.com/config/latest/docs/publish (accessed 2026-10-20)

## 1. Confirm the release inputs

1. pnpm workspace with each publishable package in the Nx graph
2. The packages already exist on npm — trusted publishing is configured per package
3. A GitHub repository whose Actions can request an OIDC token

The first publish of a brand-new package cannot use trusted publishing, because the package settings page does not exist yet. Publish a placeholder with [`setup-npm-trusted-publish`](https://github.com/azu/setup-npm-trusted-publish) first, then configure the real release.

## 2. Record intent with a changeset

```bash
pnpm dlx @changesets/cli
```

Pick the packages and the bump type. The changeset is committed in the same PR as the change, so a reviewer sees what will be released before it is released. An ad-hoc version bump in `package.json` skips that review and leaves the changelog out of sync.

## 3. Gate pull requests on affected work

`pr.yml` should:

1. Run `nx affected` so only invalidated lint, type, test, and build tasks execute
2. Publish a preview with `pkg-pr-new` and link it from the PR

A preview install is how a consumer verifies the tarball before merge; the PR check alone never proves packaging.

## 4. Run the full graph in release

`release.yml` should:

1. Run `nx run-many` so every task and output exists, including packages that were cached as unaffected
2. Let Changesets compute versions and changelogs from the merged changesets
3. Call the publish step

```ts
import { publish } from '@tanstack/publish-config'

publish({
  branchConfigs: configOpts.branchConfigs,
  packages: configOpts.packages,
  rootDir: configOpts.rootDir,
  branch: process.env.BRANCH,
  tag: process.env.TAG,
  ghToken: process.env.GH_TOKEN,
})
  .then(() => {
    console.log('Successfully published packages!')
  })
  .catch(console.error)
```

The programmatic path is ESM-only: the release script's package needs `"type": "module"` and `import` rather than `require`.

## 5. Grant the minimum workflow permissions

```yaml
permissions:
  contents: read
  id-token: write
```

`id-token: write` is what lets GitHub mint the OIDC token npm exchanges for short-lived publish access. Without it the publish step fails at authentication even though `GH_TOKEN` is set.

## 6. Enable trusted publishing per package

1. Open the package settings page on npm
2. Add the GitHub repository and workflow as a trusted publisher
3. Save with MFA

For five or more packages, use a bulk helper such as [`open-packages-on-npm`](https://github.com/antfu/open-packages-on-npm) instead of repeating the form. Once configured, no npm token is stored in the repository.

## 7. Verify

1. A PR that changes one package produces exactly one changeset and a preview install link
2. The release run logs `nx run-many` tasks for the changed packages before publishing
3. npm shows the new version with provenance attestation
4. Installing the published version in a scratch project resolves ESM, CJS, and types
5. Repository secrets contain no npm publish token

## Pitfalls

- Storing a long-lived npm token anyway, which defeats the point of trusted publishing.
- Requesting `id-token: write` but publishing from a workflow file other than the one registered as the trusted publisher.
- Publishing from `nx affected` in release, so a package whose output was cached is packed from a stale `dist/`.
- Merging a package change without a changeset; the release then has nothing to version.
- Running the publish script from a CommonJS file, which fails because `publish-config` is ESM-only.
- Forgetting `GH_TOKEN`, which the publish step uses to read repository and release metadata.
- Configuring trusted publishing after the first publish, when the package settings page does not exist yet.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/publish-ready-package.md`
- `usecases/build-published-package.md`
