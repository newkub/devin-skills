---
name: update-dot-vscode
description: Update .vscode for workspace settings, extensions, tasks, launch, snippets, editor associations
argument-hint: "[scope]"
related:
  - follow-create-plugins
  - deep-review-codebase
  - deep-analyze
  - check-monorepo
  - learn
  - update-references
  - report
  - deep-validate

---

## Goal

Manage the `.vscode` directory completely and systematically, covering workspace settings, recommended extensions, tasks, launch configurations, and file associations

## Scope

Use to create, improve, and verify the entire `.vscode` directory. Does not overlap with `/follow-create-plugins` (vscode) (building VSCode extensions) or `/deep-review-codebase` (config consistency).

### Standard Project

```text
.vscode/
├── settings.json       # Workspace settings
├── extensions.json     # Recommended extensions
├── launch.json         # Debug configurations
├── tasks.json          # Task configurations
└── snippets/           # Custom snippets (optional)
```

### Monorepo

```text
.vscode/
├── settings.json       # Root workspace settings
├── extensions.json     # Recommended extensions for all workspaces
├── launch.json         # Debug configs for multiple apps
├── tasks.json          # Tasks for build, dev, test, lint, typecheck
└── snippets/           # Shared snippets (optional)
```

## Execute

### 1. Analyze Existing .vscode

> Goal: Read and analyze the existing `.vscode` directory to understand its current state

1. Read the whole `.vscode/` directory
2. List the files that exist and the files that are missing
3. Read the existing files to check their correctness
4. If there is no `.vscode/` directory → start from scratch
5. If a file cannot be read → stop and report

### 2. Analyze Project

> Goal: Analyze the project to determine the required settings

1. Run `/deep-analyze` to see the tech stack and structure
2. Run `/check-monorepo` to check the project type
3. Identify the package manager (Bun, npm, pnpm, yarn)
4. Identify the formatter/linter (Biome, ESLint, Prettier)
5. Identify the type checker (tsc)
6. Identify the test runner (Vitest, Jest, Playwright)
7. If the project type is unclear → stop and report

### 3. Setup Settings.json

> Goal: Create or update `settings.json` per the project's tech stack

1. Run `/learn` (web) from the VSCode settings docs to confirm the relevant settings
2. Define formatter settings:
   - `editor.defaultFormatter` → the formatter in use (e.g. `biomejs.biome` for Biome)
   - `editor.formatOnSave` → `true`
   - `[language]` overrides if needed
3. Define editor associations (`workbench.editorAssociations`):
   - `*.md` → `vscode.markdown.preview.editor` (open every markdown file in preview by default)
   - For other files such as `*.svg`, `*.drawio`, use editor associations as appropriate
   - Users can press `Ctrl+Shift+V` to switch to the text editor when they need to edit
4. Define file associations (`files.associations`):
   - `*.jsonc` → `jsonc` (if JSONC config files are used)
   - `biome.jsonc` → `jsonc`
   - Other files per the tech stack
5. Define TypeScript settings (use the `js/ts.*` prefix, not the deprecated `typescript.*`):
   - `js/ts.tsdk.path` → path of the TypeScript SDK (if using the workspace version)
   - `js/ts.tsdk.promptToUseWorkspaceVersion` → `true`
   - `js/ts.preferences.importModuleSpecifier` → `non-relative` (if using path aliases)
   - `js/ts.preferences.importModuleSpecifierEnding` → `minimal`
   - `js/ts.updateImportsOnFileMove.enabled` → `always`
6. Define search exclude (`search.exclude`):
   - `node_modules`, `dist`, `.output`, `.turbo`
   - `.supabase`, `target` (Rust)
   - Others per the tech stack's build output
7. Define files exclude (`files.exclude`):
   - `/.git`: `true`, `/.DS_Store`: `true`
   - `dist`: `true`, `.turbo`: `true`
8. Check existing configs (`biome.jsonc`, `tsconfig.json`) for conflicts
9. If a setting conflicts with an existing config → fix it to be consistent
10. For a monorepo → add `conventionalCommits.scopes` per workspace

### 4. Setup Extensions.json

> Goal: Create or update `extensions.json` with recommended extensions

1. Identify extensions per the tech stack:
   - Formatter/Linter: `biomejs.biome` (Biome) or `dbaeumer.vscode-eslint` (ESLint)
   - Framework: extensions per framework (SolidJS, Vue, React, etc.)
   - CSS: `antfu.unocss` (UnoCSS) or `bradlc.vscode-tailwindcss` (Tailwind)
   - Desktop: `tauri-apps.tauri-vscode` (Tauri) if used
   - Rust: `rust-lang.rust-analyzer` if Rust code exists
   - Test: extensions for the test runner
   - Markdown: `shd101wyy.markdown-preview-enhanced` if an enhanced preview is wanted
   - Database: `Drizzle.drizzle` if Drizzle is used
   - Others per requirements
2. Split extensions into `recommendations` and `unwantedRecommendations`
3. For a monorepo → include all extensions needed by every workspace
4. Verify the extension IDs against the VSCode Marketplace

### 5. Setup Launch.json

> Goal: Create or update `launch.json` for debug configurations

1. Create a debug config for the browser app (SolidJS/Vue/React):
   - URL: `http://localhost:3000` (or the app's port)
   - `webRoot`: path of the app source
2. Create a debug config for the desktop app (Tauri) if present:
   - `type`: `node` (set `runtimeExecutable` to `bun` or `cargo`)
   - Avoid `lldb`/`cppvsdbg` since they require extra extension installs
3. Create a debug config for Node.js/Bun scripts if present
4. For a monorepo → create a compound config that runs several apps at once
5. If there is no debug scenario → skip this step

### 6. Setup Tasks.json

> Goal: Create or update `tasks.json` for task configurations

1. Create a task for `dev` (run the dev server)
2. Create a task for `build` (production build)
3. Create a task for `test` (run tests)
4. Create a task for `lint` (run the linter)
5. Create a task for `typecheck` (run the type checker)
6. For a monorepo → use package manager workspace commands (e.g. `bun run <script>` at the root)
7. Set `group` to `build` for the build task
8. Set `isDefault` for frequently used tasks
9. If the project has no scripts → skip this step

### 7. Setup Snippets (Optional)

> Goal: Create or update custom snippets

1. If the project has repeated patterns (e.g. React component, SolidJS signal) → create `snippets/<language>.json`
2. Check the JSON syntax
3. Don't add snippets that are personal preferences

### 8. Validate And Update References

> Goal: Verify correctness and update references

1. Check the JSON syntax of every file in `.vscode/`
2. Check that settings don't conflict with `biome.jsonc`, `tsconfig.json`, and `turbo.json`
3. Check that the extension IDs are correct
4. Check that task commands match the scripts in `package.json`
5. Run `/update-references` if file operations occurred
6. Update `AGENTS.md` if a new `.vscode/` directory was added
7. If validation fails → fix and re-validate (max 3 → stop/report)

## Rules

### 1. No Overlap With Specialized Workflows

- Use `/follow-create-plugins` (vscode) to build VSCode extensions (not config)
- Use `/deep-review-codebase` for general config consistency
- `update-dot-vscode` manages only the files in the `.vscode/` directory

### 2. Settings Priority

- Workspace settings (`.vscode/settings.json`) have higher priority than user settings
- Include only project-specific settings — no personal preferences
- If a setting is a personal preference (e.g. theme, font size) → keep it out of the workspace
- Use `[language]` overrides for language-specific settings

### 3. Editor Associations

- `workbench.editorAssociations` controls the default editor for file patterns
- Use `*.md` → `vscode.markdown.preview.editor` to open every markdown file in preview by default
- For `.svg`, `.drawio`, or other files, use editor associations as appropriate
- Users can switch to the text editor with `Ctrl+Shift+V` or `Ctrl+K V` to edit
- Use `default` as the starting value if no custom editor is wanted

### 4. Monorepo Guidelines

- The root `settings.json` applies to all workspaces
- `extensions.json` includes all needed extensions
- `launch.json` has a separate config for each app
- `tasks.json` uses root package.json scripts that call workspace commands
- If a workspace needs its own settings → create `.vscode/settings.json` in that workspace

### 5. Tech Stack Alignment

- Check that `editor.defaultFormatter` matches the formatter in `biome.jsonc` or the lint config
- Check that `js/ts.tsdk.path` is correct (not the deprecated `typescript.tsdk`)
- Check that `files.associations` covers all config files
- Check that `search.exclude` covers every tool's build output
- Don't add settings for tools the project doesn't use

### 6. High Impact Content

- Include only settings with real impact — no noise
- Every setting must answer "would productivity drop without it?" — if not → leave it out
- Don't add settings that are already the default
- Don't add settings that are personal preferences
- Check that every extension in `extensions.json` is still maintained and compatible

### 7. Safety And Determinism

- Results must be deterministic — same tech stack → same settings every time
- Never hardcode absolute paths in settings or tasks
- Use variables such as `${workspaceFolder}`, `${command:...}` instead of absolute paths
- If an existing file is already correct → don't recreate it, update only the missing parts
- If user settings conflict → workspace settings automatically override

- Use /report if needed
- Use /deep-validate if needed

## Expected Outcome

- `.vscode/` directory has all files: `settings.json`, `extensions.json`, `launch.json`, `tasks.json`
- `settings.json` matches the tech stack: formatter, TypeScript, search exclude, file associations
- `workbench.editorAssociations` sets `*.md` → `vscode.markdown.preview.editor`, opening every markdown file in preview
- `.svg`, `.drawio`, or other files get editor associations as appropriate
- `extensions.json` recommends all extensions needed by the tech stack
- `launch.json` has debug configs for each app (if any)
- `tasks.json` has tasks for build, dev, test, lint, typecheck
- Every file passes JSON syntax validation
- Settings don't conflict with `biome.jsonc`, `tsconfig.json`, `turbo.json`
- `AGENTS.md` updated if new files were added
