# Swift Language and SwiftUI

## Swift Language

### Install

Swift is included with Xcode on macOS. For Linux/Windows, download from
`https://www.swift.org/download/`.

```bash
swift --version          # Verify installation
mise use -g swift        # Install via mise
brew install swift       # Install via Homebrew (macOS)
```

### Swift Package Manager

```bash
mkdir MyPackage
cd MyPackage
swift package init --type executable
```

### Package.swift

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "MyApp",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .executable(name: "MyApp", targets: ["MyApp"]),
    ],
    dependencies: [
        .package(url: "https://github.com/hmlongco/Factory.git", from: "2.3.0"),
    ],
    targets: [
        .executableTarget(
            name: "MyApp",
            dependencies: ["Factory"]
        ),
        .testTarget(
            name: "MyAppTests",
            dependencies: ["MyApp"]
        ),
    ]
)
```

### Build and Test Commands

```bash
swift build              # Build the package
swift run                # Build and run the executable
swift test               # Run tests
swift package update     # Update dependencies
swift package resolve    # Resolve dependencies
```

## SwiftUI

SwiftUI provides views, controls, and layout structures for declaring app
user interfaces. Available on iOS 13.0+, macOS 10.15+, tvOS 13.0+,
watchOS 6.0+, visionOS 1.0+.

### App Structure

```swift
import SwiftUI

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### View Protocol

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .font(.title)
            Button("Tap Me") {
                print("Button tapped")
            }
        }
        .padding()
    }
}
```

### Property Wrappers for Data Flow

```swift
import SwiftUI

// @State - local view state
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
            Button("Increment") {
                count += 1
            }
        }
    }
}

// @StateObject - owned observable object
struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        Text(viewModel.displayName)
    }
}

// @ObservedObject - externally owned observable object
struct EditView: View {
    @ObservedObject var viewModel: ProfileViewModel

    var body: some View {
        TextField("Name", text: $viewModel.name)
    }
}

// @EnvironmentObject - shared across view hierarchy
struct SettingsView: View {
    @EnvironmentObject var settings: AppSettings

    var body: some View {
        Toggle("Dark Mode", isOn: $settings.darkMode)
    }
}
```

### ObservableObject and @Published

```swift
import SwiftUI

class ProfileViewModel: ObservableObject {
    @Published var name: String = ""
    @Published var email: String = ""

    var displayName: String {
        name.isEmpty ? "Guest" : name
    }

    func save() async throws {
        // Async save logic
    }
}
```

### async/await

```swift
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(
        from: URL(string: "https://api.example.com/users/\(id)")!
    )
    return try JSONDecoder().decode(User.self, from: data)
}

@MainActor
class UserViewModel: ObservableObject {
    @Published var user: User?

    func loadUser() async {
        do {
            user = try await fetchUser(id: "123")
        } catch {
            print("Failed to fetch: \(error)")
        }
    }
}
```

## Source URLs

- SwiftUI docs: `https://developer.apple.com/documentation/swiftui`
- SwiftUI getting started: `https://developer.apple.com/swiftui/`
- Swift.org: `https://www.swift.org/`
- Swift Package Manager: `https://www.swift.org/documentation/package-manager/`
- SwiftUI tutorials: `https://developer.apple.com/swiftui/get-started/`
