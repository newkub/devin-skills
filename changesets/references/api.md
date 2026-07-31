# API Reference

Programmatic API for Changesets

## Package

```bash
bun install @changesets/cli
```

## readChangesets

Read all changeset files:

```typescript
import { readChangesets } from '@changesets/core';

const changesets = await readChangesets('.changeset');
```

## getVersion

Calculate version for a package:

```typescript
import { getVersion } from '@changesets/core';

const version = getVersion(currentVersion, changesets, {
  pkg: { name: '@my-org/pkg', version: '1.0.0' },
  changesets: allChangesets,
  config: changesetsConfig,
});
```

## applyVersion

Apply version changes to packages:

```typescript
import { applyVersion } from '@changesets/core';

await applyVersion(
  '.',
  newVersion,
  {
    changesets: allChangesets,
    config: changesetsConfig,
  }
);
```

## assemble

Main function to assemble version state:

```typescript
import { assemble } from '@changesets/core';

const state = await assemble(
  '.',
  {
    changesets: allChangesets,
    packages: packageConfigs,
  },
  changesetsConfig
);
```

## writeChangeset

Create a changeset file programmatically:

```typescript
import { writeChangeset } from '@changesets/cli';

await writeChangeset({
  id: 'cool-unicorn',
  changesets: [
    {
      summary: 'Add new feature',
      releases: [{ name: 'my-package', type: 'minor' }],
    },
  ],
  dir: '.changeset',
});
```

## getReleaseLine

Generate release line for changelog:

```typescript
import { getReleaseLine } from '@changesets/changelog-github';

const lines = await getReleaseLine(changesets, version, commit);
```

## Types

```typescript
interface Changeset {
  id: string;
  summary: string;
  releases: Array<{
    name: string;
    type: 'major' | 'minor' | 'patch';
  }>;
}

interface Config {
  changelog: string | [string, object];
  commit: boolean;
  fixed: string[][];
  linked: string[][];
  access: 'public' | 'restricted';
  baseBranch: string;
  updateInternalDependencies: 'patch' | 'minor' | 'major' | 'never';
  ignore: string[];
  gitTag: boolean;
  push: boolean;
}
```

## Error Handling

```typescript
try {
  const state = await assemble('.', options, config);
} catch (error) {
  if (error instanceof ChangesetErrors.NoChangesetsFound) {
    // Handle no changesets
  }
  if (error instanceof ChangesetErrors.CouldNotFindCurrencyVersion) {
    // Handle missing version
  }
}
```