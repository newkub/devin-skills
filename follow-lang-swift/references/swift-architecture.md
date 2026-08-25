# Swift Clean Architecture Patterns

## Layer Dependencies

```
Presentation --> Domain
Domain        --> (no dependencies on Presentation/Data)
Data          --> Domain
Core          --> (shared only)
Application   --> Presentation, Domain, Data
```

## Domain Layer (no external dependencies)

### Models (Entities)

```swift
// Domain/Models/User.swift
struct User: Identifiable, Hashable {
    let id: UUID
    let name: String
    let email: String
}
```

### Repository Protocols

```swift
// Domain/Repositories/UserRepository.swift
protocol UserRepository {
    func fetchUser(id: UUID) async throws -> User
    func updateUser(_ user: User) async throws
}
```

### Use Cases

```swift
// Domain/UseCases/FetchUserUseCase.swift
final class FetchUserUseCase {
    private let repository: UserRepository

    init(repository: UserRepository) {
        self.repository = repository
    }

    func execute(id: UUID) async throws -> User {
        try await repository.fetchUser(id: id)
    }
}
```

## Data Layer (depends on Domain)

### DTOs

```swift
// Data/Models/UserDTO.swift
struct UserDTO: Codable {
    let id: String
    let name: String
    let email: String

    func toDomain() -> User {
        User(
            id: UUID(uuidString: id) ?? UUID(),
            name: name,
            email: email
        )
    }

    init(from user: User) {
        self.id = user.id.uuidString
        self.name = user.name
        self.email = user.email
    }
}
```

### Repository Implementation

```swift
// Data/Repositories/UserRepositoryImpl.swift
final class UserRepositoryImpl: UserRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchUser(id: UUID) async throws -> User {
        let dto: UserDTO = try await apiClient.get("/users/\(id)")
        return dto.toDomain()
    }

    func updateUser(_ user: User) async throws {
        let dto = UserDTO(from: user)
        try await apiClient.put("/users/\(user.id)", body: dto)
    }
}
```

## Presentation Layer (depends on Domain)

### ViewModels

```swift
// Presentation/ViewModels/UserViewModel.swift
@MainActor
final class UserViewModel: ObservableObject {
    @Published var user: User?
    @Published var isLoading = false

    private let fetchUserUseCase: FetchUserUseCase

    init(fetchUserUseCase: FetchUserUseCase) {
        self.fetchUserUseCase = fetchUserUseCase
    }

    func load(id: UUID) async {
        isLoading = true
        defer { isLoading = false }
        do {
            user = try await fetchUserUseCase.execute(id: id)
        } catch {
            print("Error: \(error)")
        }
    }
}
```

### Screens

```swift
// Presentation/Screens/UserDetailView.swift
struct UserDetailView: View {
    @StateObject private var viewModel: UserViewModel

    init(viewModel: UserViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        Group {
            if let user = viewModel.user {
                Text(user.name)
            } else {
                ProgressView()
            }
        }
        .task {
            await viewModel.load(id: UUID())
        }
    }
}
```

### Reusable Components

```swift
// Presentation/Components/UserCard.swift
struct UserCard: View {
    let user: User
    let onTap: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(user.name)
                    .font(.headline)
                Text(user.email)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .onTapGesture(perform: onTap)
    }
}
```

## Dependency Injection with Factory

```swift
// Core/DI/Container.swift
import Factory

extension Container {
    var userRepository: Factory<UserRepository> {
        Factory { UserRepositoryImpl(apiClient: APIClient.shared) }
    }

    var fetchUserUseCase: Factory<FetchUserUseCase> {
        Factory { FetchUserUseCase(repository: Container.shared.userRepository()) }
    }
}
```

## Project Structure

```
MyApp/
├── Application/
│   ├── MyAppApp.swift
│   └── SceneDelegate.swift
├── Core/
│   ├── DI/
│   ├── Extensions/
│   └── Utils/
├── Data/
│   ├── DataSources/
│   ├── Models/          (DTOs)
│   └── Repositories/
├── Domain/
│   ├── Models/          (Entities)
│   ├── Repositories/    (Protocols)
│   └── UseCases/
├── Presentation/
│   ├── Components/
│   ├── Screens/
│   └── ViewModels/
└── Resources/
    └── Assets.xcassets
```

## Source URLs

- SwiftUI docs: `https://developer.apple.com/documentation/swiftui`
- SwiftUI getting started: `https://developer.apple.com/swiftui/`
- Swift.org: `https://www.swift.org/`
- Factory (DI): `https://github.com/hmlongco/Factory`
