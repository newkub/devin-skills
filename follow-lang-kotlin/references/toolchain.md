# Kotlin Toolchain

| key | value |
|-----|-------|
| language | Kotlin (JVM / Compose Multiplatform / KMP) |
| JDK install | `mise use -g java` (version from live check) |
| build system | Gradle with Kotlin DSL + wrapper + version catalog |
| official docs | https://kotlinlang.org/docs/home.html · https://www.jetbrains.com/compose-multiplatform/ |
| version policy | never pinned here — live-check Kotlin/Compose/Gradle state via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `java` (JDK) | runtime + compiler host | `mise use -g java` |
| `kotlinc` | standalone compiler / REPL (scripting, quick checks) | via Kotlin distribution or IDE bundle |
| `./gradlew build` / `run` / `test` | build, execute, test — wrapper only | `gradle wrapper` to bootstrap |
| `gradle/libs.versions.toml` | version catalog — single source for versions | project file |
| IntelliJ IDEA / Android Studio | IDE (Compose preview, KMP tooling) | per platform installer |
| `ktlint` (plugin) | formatter + style gate | Gradle plugin, live-checked version |
| `detekt` (plugin) | static analysis | Gradle plugin, live-checked version |
| `kotlinx-coroutines` + `runTest` | async + coroutine testing | catalog dep |
| Koin | dependency injection (`module { }` per layer) | catalog dep |
| Ktor client | HTTP | catalog dep |
| Arrow (`Either`) | functional error handling | catalog dep |
| MockK | mocking (`mockk`, `coEvery`) | catalog dep (test) |
