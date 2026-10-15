---
name: follow-lang-swift-setup-project
description: Scaffold a new Swift package or app project with SPM and test targets
argument-hint: "[project-name]"
related:
  - follow-lang-swift
  - follow-architecture
  - deep-research
  - resolve-errors
---

## Goal

Create a new Swift package (or app skeleton) with SwiftPM, clean layer targets, and a passing test setup

## Scope

For a fresh Swift project; live-check the current Swift language mode, Xcode toolchain, and Observation availability via `/deep-research` first (execution requires macOS/Xcode) — read `/follow-lang-swift` for the language rules

## Execute

### 1. Create The Package

1. `swift package init --name MyLibrary --type library` (library) or `--type executable`
2. App targets (iOS/macOS/visionOS): create the Xcode project with the `@main struct MyApp: App` SwiftUI entry point; keep its scheme building the same targets as the package layout
3. `Package.swift`: declare `platforms`, `products`, `dependencies`, and targets for main + tests — versions from the live check, never a stale template

### 2. Layer The Structure

1. Create the Clean Architecture folders: `Application/`, `Core/`, `Data/`, `Domain/`, `Presentation/`, `Resources/` — run `/follow-architecture` for the pattern decision
2. Enforce the import direction: `Presentation → Domain`, `Data → Domain`, `Domain → nothing` (separate targets make the compiler enforce it)

### 3. Wire The Stack

1. Swift Concurrency (`async/await`) for I/O APIs; DI via Factory registrations or protocol-based manual DI (confirm the current recommendation via `/deep-research`)
2. Test target(s) with `swift test` / the Xcode test target — add one passing use-case test through an injected protocol mock

### 4. Verify

1. `swift build` → `swift run` (executables) → `swift test` all green; `swift package update`/`resolve` behave with the committed `Package.resolved`
2. On failure → run `/resolve-errors`

## Rules

- Never copy `Package.swift` version pins from another project — resolve fresh per `/deep-research`

## Expected Outcome

- New Swift project: SPM-managed, layered targets with enforced dependency direction, and a green first test
