# visualize-repo-in-web (merged content)

- read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-lib-solidjs
  - follow-create-rust-crate
  - follow-tool-vite
  - alternative
  - review-frontend
  - resolve-errors
  - ship
  - suggest-next-action
---

## Goal

Build a web application that displays the repository as an interactive graph, using Rust to analyze the repo structure and SolidJS to render it in the browser

## Scope

Works with general repos such as projects with a `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, or `requirements.txt`. Supports scanning modules, files, and dependencies and displaying them as a graph

## Execute

### 1. Setup Rust Scanner

> Goal: Build a Rust crate for analyzing the repo

1. Create the `src/rust/repo-graph/` directory inside the skill workspace or OS temp
2. Run `cargo init --name repo-graph` in `src/rust/repo-graph/`
3. Add the `serde`, `serde_json`, `walkdir` dependencies with `cargo add`
4. Create `src/main.rs` that takes `<repo-path>` as an argument and scans the tree
5. Create `src/graph.rs` for building nodes and edges
6. Test with `cargo run -- <repo-path>` to produce `repo-graph.json`

### 2. Analyze Repo Structure

> Goal: Collect nodes and edges from the repo

1. Use `glob` to find key files such as `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
2. `read` manifests to find dependencies and workspace members
3. `grep` imports / exports or `mod` declarations to find file relations
4. Create nodes: `directory`, `file`, `module`, `dependency`, `workspace`
5. Create edges from imports, parent-child, dependency links
6. Save `repo-graph.json` into `src/web/public/` or `src/web/src/data/`

### 3. Choose Graph Library

> Goal: Choose a library for rendering the graph

1. Run `/alternative` to evaluate `cytoscape`, `vis-network`, `force-graph`, `d3`
2. For SolidJS, prefer `cytoscape` or `force-graph` via npm
3. Install with `bun add cytoscape` or `bun add force-graph` in the web project
4. Pick a library that supports zoom, pan, drag, and tooltip instead of writing your own engine

### 4. Generate Solid Frontend

> Goal: Build the web app with SolidJS

1. Follow `/follow-tool-vite` to create a Vite project with `bun create vite@latest repo-graph-web --template solid-ts`
2. Install `solid-js`, `vite`, `vite-plugin-solid`, `unocss`, `@unocss/preset-wind`
3. Create `src/App.tsx` using `createSignal`, `<For>`, `<Show>`
4. Create `src/components/GraphView.tsx` that loads `repo-graph.json` and renders the graph
5. Add controls: search, filter by type, zoom reset, dark mode toggle

### 5. Wire Rust Output To Solid

> Goal: Let the Solid app consume data from the Rust scanner

1. Run the Rust scanner to produce `repo-graph.json`
2. Copy `repo-graph.json` to `src/web/public/repo-graph.json`
3. In Solid, use `fetch('/repo-graph.json')` or `import data from '../data/repo-graph.json'`
4. Display the graph with node labels, tooltips, and a side panel

### 6. Build And Serve

> Goal: Run and verify the web app

1. In the web project, run `bun install` then `bun run dev`
2. Verify the graph renders correctly
3. Run `/open-web` to open the browser
4. If there are errors → run `/resolve-errors`

### 7. Ship

> Goal: Deliver the project

1. If the user wants to keep the project → run `/ship`
2. Report the number of nodes, edges, and types found
3. Run `/suggest-next-action`

## Rules

### 1. Src Directory

- The skill has a `src/` directory as a scaffold for the Rust crate and the Solid web app
- Scaffold files must build with `cargo build` and `bun run build`
- No more than 250 lines per file

### 2. Graph UX

- Use distinct colors per node type: directory, file, module, dependency, workspace
- Support zoom, pan, search, and filter
- Show tooltips with metadata
- Do not write your own graph engine

### 3. Multi Ecosystem

- Support multiple package manifests: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
- Use commands per ecosystem, e.g. `cargo run` for Rust, `bun install` for JS/TS

- Use /follow-lib-solidjs if needed
- Use /follow-create-rust-crate if needed
- Use /review-frontend if needed

## Expected Outcome

- The Rust scanner produces `repo-graph.json` from the specified repo
- The SolidJS web app renders the graph in the browser with interactions
- The `src/` directory contains scaffolds for the Rust crate and the Solid web app
- Supports multiple ecosystems and repo layouts
- Can be shipped or run in the browser

