# Swift Toolchain

| key | value |
|-----|-------|
| language | Swift (language mode + API availability live-checked per Xcode/Swift release) |
| toolchain | Xcode (macOS) or standalone Swift toolchain (`swift.org`) |
| package manager | Swift Package Manager (`swift package`) — the default |
| official docs | https://developer.apple.com/documentation/swift · https://www.swift.org/documentation/ |
| version policy | never pinned here — live-check Swift/Xcode state via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `swift build` / `run` | compile + execute packages | bundled toolchain |
| `swift package init` | scaffold library/executable | bundled |
| `swift test` | unit tests via XCTest / Swift Testing | bundled |
| `swift package update` / `resolve` | dependency resolution (`Package.resolved`) | bundled |
| `xcodebuild` | build/test/archive Xcode projects | with Xcode |
| `swift-format` / SwiftLint / SwiftFormat | formatting and linting — pick per project, live-check rulesets | homebrew/mint or Xcode plugin |
| Factory | dependency injection container (or protocol-based manual DI) | SPM dependency |
| Instruments / `os_signpost` | profiling and OS-level tracing | with Xcode |
