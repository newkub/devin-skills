---
name: follow-lang-kotlin-setup-project
description: Scaffold a new Kotlin project with Gradle, toolchain pin, and quality plugins
argument-hint: "[project-name]"
related:
  - follow-lang-kotlin
  - follow-architecture
  - follow-best-practice
  - deep-research
  - resolve-errors
---

## Goal

Create a new Kotlin project (JVM or Compose Multiplatform) with a pinned toolchain, Gradle wrapper, and quality gates wired from the first commit

## Scope

For a fresh Kotlin project; live-check the latest stable Kotlin, Compose Multiplatform, and Gradle plugin versions via `/deep-research` before pinning anything — read `/follow-lang-kotlin` for the language rules

## Execute

### 1. Pin The Toolchain

1. `mise use -g java` for the JDK the live check recommends; verify `java -version` and `kotlinc -version` where the standalone compiler is used
2. Gradle via the wrapper only (`gradle wrapper` once, then `./gradlew` everywhere) — never a machine-global Gradle

### 2. Scaffold

1. `build.gradle.kts` (Kotlin DSL) with the Kotlin plugin at the live-checked version; `settings.gradle.kts` with `rootProject.name`
2. Version catalog `gradle/libs.versions.toml` for all versions — one place, referenced as `alias(libs.plugins...)`/`libs.xxx`
3. App types: plain JVM (`application` plugin), library (`java-library`), Compose Multiplatform/Desktop per the official template (creator name live-checked via `/deep-research`)
4. Layout per Clean Architecture: `core/error/`, `data/`, `domain/`, `presentation/` — run `/follow-architecture` for the pattern choice

### 3. Add Dependencies Deliberately

1. Coroutines (+ Flow/StateFlow) for async, Koin for DI, Ktor for HTTP, Arrow for functional error handling — confirm each optional dep with the user before adding; versions only from the live check
2. Test deps: `kotlin.test`/JUnit 5, `runTest`, MockK

### 4. Quality Gates

1. Add `ktlint` (format) and `detekt` (static analysis) plugins; fail the build on new violations
2. Verify: `./gradlew build` → `./gradlew test` → `./gradlew ktlintCheck detekt` all green
3. On failure → run `/resolve-errors`

## Rules

- Never hardcode a stale Kotlin/library version in code, comments, or this workflow — everything resolves from the `/deep-research` check at use time

## Expected Outcome

- New Kotlin project: pinned JDK + Gradle wrapper, version catalog, Clean Architecture skeleton, ktlint/detekt/test gates green
