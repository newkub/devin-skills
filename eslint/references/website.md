# ESLint - Website Reference

Official resources and links for ESLint

## Official Resources

### Documentation

| Resource | URL |
|----------|-----|
| Main Documentation | https://eslint.org/docs/ |
| Configuration Guide | https://eslint.org/docs/latest/use/configure/ |
| Rules Reference | https://eslint.org/docs/latest/rules/ |
| CLI Options | https://eslint.org/docs/latest/use/migrate-to-9.0.0 |
| API Reference | https://eslint.org/docs/latest/extend/custom-rules |

### Configuration

| Resource | URL |
|----------|-----|
| Flat Config Migration | https://eslint.org/docs/latest/use/migrate-to-9.0.0 |
| Configuration Reference | https://eslint.org/docs/latest/use/configure/ |
| Configuration Files | https://eslint.org/docs/latest/use/configure/configuration-files |
| Comments in Config | https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments |

### Plugins

| Resource | URL |
|----------|-----|
| Plugin List | https://eslint.org/docs/latest/extend/plugins |
| Writing Plugins | https://eslint.org/docs/latest/extend/custom-rules |
| Plugin Format | https://eslint.org/docs/latest/extend/plugins |

## Community Plugins

### Official Plugins

| Plugin | Package | Docs |
|--------|---------|------|
| TypeScript | `@typescript-eslint/eslint-plugin` | https://typescript-eslint.io/ |
| React | `eslint-plugin-react` | https://github.com/jsx-eslint/eslint-plugin-react |
| React Hooks | `eslint-plugin-react-hooks` | https://www.bunjs.com/package/eslint-plugin-react-hooks |
| Vue | `eslint-plugin-vue` | https://eslint.vuejs.org/ |
| Node | `eslint-plugin-n` | https://github.com/eslint-community/eslint-plugin-n |
| Import | `eslint-plugin-import` | https://github.com/import-js/eslint-plugin-import |
| Unicorn | `eslint-plugin-unicorn` | https://github.com/sindresorhus/eslint-plugin-unicorn |
| Promise | `eslint-plugin-promise` | https://github.com/xJam/eslint-plugin-promise |
| Jest | `eslint-plugin-jest` | https://github.com/jest-community/eslint-plugin-jest |
| Testing Library | `eslint-plugin-testing-library` | https://github.com/testing-library/eslint-plugin-testing-library |

### Community Plugins List

- [awesome-eslint](https://github.com/dustinspecker/awesome-eslint)

## Configurations

### Shareable Configs

| Config | Package | Description |
|--------|---------|-------------|
| Standard | `eslint-config-standard` | JavaScript Standard Style |
| Prettier | `eslint-config-prettier` | Disable conflicting rules |
| React App | `eslint-config-react-app` | Create React App config |
| Next.js | `eslint-config-next` | Next.js recommended config |

## Tools

### Playground

| Tool | URL |
|------|-----|
| ESLint Playground | https://eslint.org/play/ |
| AST Explorer | https://astexplorer.net/ |

### CLI Tools

| Tool | Purpose |
|------|---------|
| `eslint` | Main CLI |
| `npx eslint` | Run without install |
| `create-eslint-config` | Interactive config setup |

## Learning Resources

### Tutorials

| Resource | Description |
|----------|-------------|
| Getting Started | https://eslint.org/docs/latest/use/getting-started |
| Migration Guide | https://eslint.org/docs/latest/use/migrate-to-9.0.0 |
| Migration to 9.0 | https://eslint.org/blog/2024/04/09/eslint-v9.0.0-released |

### Articles

| Topic | Description |
|-------|-------------|
| Why ESLint | https://eslint.org/docs/about/ |
| How Linting Works | https://eslint.org/docs/latest/extend/how-to-write-a-rule |
| Custom Rules | https://eslint.org/docs/latest/extend/custom-rules |

## Integrations

### Editor Extensions

| Editor | Extension |
|--------|-----------|
| VSCode | ESLint (by Microsoft) |
| WebStorm | Built-in support |
| Vim | ALE, COC |
| Neovim | null-ls, nvim-lint |

### CI/CD Templates

| Platform | Integration |
|----------|-------------|
| GitHub | https://github.com/eslint/action |
| GitLab | GitLab CI ESLint |
| CircleCI | CircleCI Orb |

## Version Information

### ESLint 9.x

```bash
# Install latest
bun install --save-dev eslint@latest

# Specific version
bun install --save-dev eslint@9.0.0
```

### Version Requirements

| ESLint | Node.js | Notes |
|--------|---------|-------|
| 9.x | >= 18 | Flat Config default |
| 8.x | >= 14 | Legacy config default |
| 7.x | >= 12 | - |

## Support

### Community

| Channel | Link |
|---------|------|
| GitHub Discussions | https://github.com/eslint/eslint/discussions |
| Discord | https://discord.gg/8yZmCP37Kn |
| Stack Overflow | https://stackoverflow.com/questions/tagged/eslint |

### Reporting Issues

| Type | Link |
|------|------|
| Bug Reports | https://github.com/eslint/eslint/issues |
| Feature Requests | https://github.com/eslint/eslint/discussions/categories/ideas |
| Security | security@eslint.org |

## Related Tools

### Complementary Tools

| Tool | Purpose |
|------|---------|
| Prettier | Code formatting |
| Stylelint | CSS linting |
| TypeScript | Type checking |
| Husky | Git hooks |
| lint-staged | Lint staged files |
| lefthook | Git hooks manager |

## Summary

```text
┌─────────────────────────────────────────────────┐
│             ESLint Resources                     │
├─────────────────────────────────────────────────┤
│                                                  │
│   Official:                                      │
│   ├── eslint.org/docs                          │
│   ├── github.com/eslint/eslint                 │
│   └── playground: eslint.org/play              │
│                                                  │
│   Plugins:                                      │
│   ├── typescript-eslint.io                     │
│   ├── eslint.vuejs.org                         │
│   └── github.com/dustinspecker/awesome-eslint  │
│                                                  │
│   Tools:                                        │
│   ├── AST Explorer                             │
│   ├── VSCode Extension                          │
│   └── GitHub Action                             │
│                                                  │
└─────────────────────────────────────────────────┘
```