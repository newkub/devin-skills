# Architecture

## Common Architecture Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│         (Widgets, Pages, ViewModels, BLoCs)                  │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                           │
│           (Entities, Use Cases, Repositories)                │
├─────────────────────────────────────────────────────────────┤
│                       Data Layer                            │
│      (Data Sources, Models, Repository Implementations)       │
└─────────────────────────────────────────────────────────────┘
```

## Clean Architecture

### Folder Structure

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   └── utils/
├── features/
│   └── auth/
│       ├── data/
│       │   ├── datasources/
│       │   ├── models/
│       │   └── repositories/
│       ├── domain/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── usecases/
│       └── presentation/
│           ├── bloc/
│           ├── pages/
│           └── widgets/
├── injection_container.dart
└── main.dart
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Presentation** | UI widgets, state management, user input |
| **Domain** | Business logic, entities, use cases |
| **Data** | API calls, local storage, model mapping |

## State Management Patterns

### BLoC Pattern

```
┌─────────────────────────────────────────────────┐
│                  UI (Widget)                     │
│                     │                            │
│              Events & States                     │
│                     │                            │
├─────────────────────▼────────────────────────────┤
│                    BLoC                          │
│         (Business Logic Component)                │
│                     │                            │
│              Events & States                      │
├─────────────────────▼────────────────────────────┤
│                 Repository                       │
│            (Data Operations)                      │
├─────────────────────────────────────────────────┤
│           Data Sources (API, DB)                 │
└─────────────────────────────────────────────────┘
```

```dart
// Event
abstract class AuthEvent {}
class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  LoginRequested({required this.email, required this.password});
}

// State
abstract class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthSuccess extends AuthState {
  final User user;
  AuthSuccess(this.user);
}
class AuthFailure extends AuthState {
  final String message;
  AuthFailure(this.message);
}

// BLoC
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;

  AuthBloc({required this.loginUseCase}) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final user = await loginUseCase(event.email, event.password);
      emit(AuthSuccess(user));
    } catch (e) {
      emit(AuthFailure(e.toString()));
    }
  }
}
```

## Repository Pattern

```dart
// Abstract repository (Domain layer)
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<void> saveUser(User user);
  Future<void> deleteUser(String id);
}

// Implementation (Data layer)
class UserRepositoryImpl implements UserRepository {
  final RemoteDataSource remoteDataSource;
  final LocalDataSource localDataSource;

  UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<User> getUser(String id) async {
    try {
      final userModel = await remoteDataSource.getUser(id);
      await localDataSource.cacheUser(userModel);
      return userModel.toEntity();
    } catch (e) {
      final cached = await localDataSource.getCachedUser(id);
      return cached.toEntity();
    }
  }
}
```

## Feature-First Structure

```
lib/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── auth_repository_impl.dart
│   │   │   └── datasources/
│   │   ├── domain/
│   │   │   ├── auth_repository.dart
│   │   │   ├── entities/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   └── home/
│       └── ...
└── main.dart
```

## Dependency Injection

### GetIt

```bash
flutter pub add get_it
```

```dart
final sl = GetIt.instance;

Future<void> init() async {
  // BLoCs
  sl.registerFactory(() => AuthBloc(loginUseCase: sl()));

  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));

  // Repositories
  sl.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl(sl(), sl()));

  // Data sources
  sl.registerLazySingleton<RemoteDataSource>(() => RemoteDataSourceImpl());
  sl.registerLazySingleton<LocalDataSource>(() => LocalDataSourceImpl());

  // External
  sl.registerLazySingleton(() => http.Client());
}
```

## Design Principles

| Principle | Description |
|-----------|-------------|
| **SOLID** | Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion |
| **DRY** | Don't Repeat Yourself - extract reusable code |
| **KISS** | Keep It Simple, Stupid - avoid over-engineering |
| **YAGNI** | You Aren't Gonna Need It - only implement what's needed |
