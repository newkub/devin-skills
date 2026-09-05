---
title: CLI Sidebar Template
description: VitePress sidebar config for CLI documentation
---

# CLI Sidebar Template

Use this config in `docs/.vitepress/config.ts` for command-line tools.
Nav is defined separately — copy the CLI array from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: copy "CLI Nav" from templates/nav-config.md
    sidebar: {
      '/project/': [
        {
          text: 'Project',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/project/overview' },
            { text: 'Features', link: '/project/features' },
            { text: 'Workspaces', link: '/project/workspaces' }, // monorepo only
          ],
        },
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Usage', link: '/getting-started/usage' },
          ],
        },
      ],
      '/commands/': [
        {
          text: 'Commands',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/commands/' },
            // one item per command: { text: '<name>', link: '/commands/<name>' }
          ],
        },
      ],
      '/roadmap/': [
        {
          text: 'Roadmap',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/roadmap/' },
            { text: 'Idea Features', link: '/roadmap/idea-features' },
          ],
        },
      ],
      '/development/': [
        {
          text: 'Development',
          collapsed: true,
          items: [
            { text: 'Setup', link: '/development/setup' },
            { text: 'Architecture', link: '/development/architecture' },
            { text: 'Workflows', link: '/development/workflows' },
            { text: 'Testing', link: '/development/testing' },
            { text: 'CI/CD', link: '/development/ci-cd' },
            { text: 'Scripts', link: '/development/scripts' },
            { text: 'Troubleshooting', link: '/development/troubleshooting' },
          ],
        },
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/references/' },
            { text: 'Contributing', link: '/references/contributing' },
            { text: 'License', link: '/references/license' },
            { text: 'Troubleshooting', link: '/references/troubleshooting' },
          ],
        },
      ],
    },
  },
}
```

## Command Page Format

Each `commands/<name>.md` should include:

```md
---
title: <command-name>
description: What the command does
---

# <command-name>

## Usage

​```bash
<cli-name> <command> [options]
​```

## Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|

## Examples

​```bash
# real invocation with expected output
​```

## Exit Codes

| Code | Meaning |
|------|---------|
```
