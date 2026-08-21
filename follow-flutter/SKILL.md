---
name: follow-flutter
description: พัฒนา Flutter applications ด้วย Clean Architecture และ Riverpod
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

พัฒนา Flutter applications ด้วย Clean Architecture, Riverpod สำหรับ state management และ GoRouter สำหรับ navigation

## Scope

ใช้สำหรับ project ที่พัฒนาด้วย Flutter framework

## Execute

### 1. Setup และ Dependencies

### `pubspec.yaml`

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management & DI
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5

  # Functional Programming & Error Handling
  fpdart: ^1.1.0

  # HTTP Client
  dio: ^5.4.3+1

  # Routing
  go_router: ^14.1.0

  # Immutable Data Classes & Serialization
  freezed_annotation: ^2.4.1
  json_annotation: ^4.9.0

dev_dependencies:
  flutter_test:
    sdk: flutter

  # Code Generation
  build_runner: ^2.4.9
  riverpod_generator: ^2.4.0
  freezed: ^2.5.2
  json_serializable: ^6.8.0

  # Mocking
  mocktail: ^1.0.3
```

### Code Generation

ใช้ `build_runner` เพื่อสร้างไฟล์ `.g.dart` และ `.freezed.dart` ทั้งหมด

```bash
# Run once to generate files
dart run build_runner build --delete-conflicting-outputs

# Watch for changes and regenerate automatically
dart run build_runner watch --delete-conflicting-outputs
```

## 2. Project Structure (Clean Architecture)

เพิ่มโฟลเดอร์ `core` สำหรับจัดการส่วนกลางที่ใช้ร่วมกันในโปรเจกต์

```plaintext
lib/
├── src/
│   ├── core/              # Core utilities
│   │   ├── error/         # Failure classes, Exceptions
│   │   ├── network/       # Network info, Dio client setup
│   │   └── usecases/      # Base usecase class
│   │   └── typedefs/      # Common type definitions
│   ├── data/
│   │   ├── datasources/   # Remote/Local data sources
│   │   ├── models/        # DTOs (Data Transfer Objects) with Freezed
│   │   └── repositories/  # Implementation of domain repositories
│   ├── domain/
│   │   ├── models/        # Business models (Entities)
│   │   ├── repositories/  # Repository interfaces (contracts)
│   │   └── usecases/      # Business logic
│   └── presentation/
│       ├── providers/     # Riverpod providers
│       ├── screens/       # UI screens/pages
│       └── widgets/       # Reusable UI widgets
└── main.dart
```

## 3. Data Layer: การจัดการข้อมูล

### `data/models` (DTOs)

ใช้ `freezed` เพื่อสร้าง DTOs ที่รับข้อมูลโดยตรงจาก API

```dart
// lib/src/data/models/user_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:your_app/src/domain/models/user.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String username,
    required String email,
  }) = _UserModel;

  const UserModel._();

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

  // Mapper to convert DTO to Domain Model
  User toDomain() => User(id: id, name: username, email: email);
}
```

### `data/repositories`

Implement Repository โดยจัดการ `Exception` และแปลงเป็น `Failure` ผ่าน `Either`

```dart
// lib/src/data/repositories/user_repository_impl.dart
import 'package:fpdart/fpdart.dart';
import 'package:your_app/src/core/error/failure.dart';
import 'package:your_app/src/core/typedefs/future_either.dart';
import 'package:your_app/src/domain/models/user.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource _remoteDataSource;

  UserRepositoryImpl(this._remoteDataSource);

  @override
  FutureEither<User> getUser(String id) async {
    try {
      final userModel = await _remoteDataSource.fetchUser(id);
      return Right(userModel.toDomain());
    } on DioException catch (e) {
      return Left(ServerFailure.fromDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
```

## 4. Domain Layer: ตรรกะทางธุรกิจ

### `domain/repositories`

กำหนด Interface โดยใช้ `FutureEither` เพื่อบังคับให้มีการจัดการ Error

```dart
// lib/src/domain/repositories/user_repository.dart
import 'package:your_app/src/core/typedefs/future_either.dart';
import 'package:your_app/src/domain/models/user.dart';

abstract class UserRepository {
  FutureEither<User> getUser(String id);
}
```

### `domain/usecases`

สร้าง Use Case สำหรับแต่ละ Business Flow เพื่อให้ Logic ถูกแยกและนำกลับมาใช้ใหม่ได้

```dart
// lib/src/domain/usecases/get_user_usecase.dart
class GetUserUseCase {
  final UserRepository _repository;

  GetUserUseCase(this._repository);

  FutureEither<User> call(String id) => _repository.getUser(id);
}
```

## 5. Presentation Layer: UI และ State

### `presentation/providers`

ใช้ `riverpod_generator` เพื่อสร้าง Provider ที่อ่านง่ายและ Type-safe

```dart
// lib/src/presentation/providers/user_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'user_provider.g.dart';

// 1. Provider for dependencies
@riverpod
UserRepository userRepository(UserRepositoryRef ref) {
  return UserRepositoryImpl(ref.watch(userRemoteDataSourceProvider));
}

@riverpod
GetUserUseCase getUserUseCase(GetUserUseCaseRef ref) {
  return GetUserUseCase(ref.watch(userRepositoryProvider));
}

// 2. Provider for fetching data
@riverpod
Future<User> user(UserRef ref, String id) {
  return ref.watch(getUserUseCaseProvider).call(id).then(
        (result) => result.fold(
          (failure) => throw failure, // Riverpod's AsyncValue.error will catch this
          (user) => user,
        ),
      );
}
```

### `presentation/screens`

UI จะ "React" กับ State ที่มาจาก Provider ผ่าน `AsyncValue`

```dart
// lib/src/presentation/screens/user_profile_screen.dart
class UserProfileScreen extends ConsumerWidget {
  final String userId;
  const UserProfileScreen({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProvider(userId));

    return Scaffold(
      appBar: AppBar(title: const Text('User Profile')),
      body: userAsync.when(
        data: (user) => Center(child: Text('Hello, ${user.name}')),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) {
          final failure = error as Failure;
          return Center(child: Text(failure.message));
        },
      ),
    );
  }
}
```

## 6. Error Handling ด้วย `fpdart`

ใช้ `Either<L, R>` เพื่อจัดการกับผลลัพธ์ที่อาจเป็น `Failure` (L) หรือ `Success` (R) โดยไม่ต้องใช้ `try-catch` ใน UI Layer

```dart
// lib/src/core/error/failure.dart
abstract class Failure {
  final String message;
  const Failure(this.message);
}

class ServerFailure extends Failure {
  const ServerFailure(super.message);

  factory ServerFailure.fromDioException(DioException e) {
    // Logic to parse DioException
    return ServerFailure('API Error: ${e.message}');
  }
}
```

## 7. Navigation ด้วย `GoRouter`

ตั้งค่า Router ใน `main.dart` หรือไฟล์แยกเพื่อจัดการเส้นทางทั้งหมดในแอป

```dart
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/user/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return UserProfileScreen(userId: id);
      },
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _router,
    );
  }
}
```

## 8. Testing

เขียนเทสสำหรับแต่ละ Layer เพื่อรับประกันคุณภาพของโค้ด

### Repository Unit Test

```dart
import 'package:mocktail/mocktail.dart';
import 'package:flutter_test/flutter_test.dart';

// Mocks
class MockUserRemoteDataSource extends Mock implements UserRemoteDataSource {}

void main() {
  late UserRepository repository;
  late UserRemoteDataSource dataSource;

  setUp(() {
    dataSource = MockUserRemoteDataSource();
    repository = UserRepositoryImpl(dataSource);
  });

  test('should return User when call is successful', () async {
    // Arrange
    when(() => dataSource.fetchUser(any())).thenAnswer((_) async => userModel);

    // Act
    final result = await repository.getUser('1');

    // Assert
    expect(result, isA<Right<Failure, User>>());
    verify(() => dataSource.fetchUser('1')).called(1);
  });
}
```

## Rules

- ใช้ Clean Architecture แบ่งเป็น data, domain, presentation layers
- ใช้ Riverpod สำหรับ state management และ DI
- ใช้ GoRouter สำหรับ navigation
- ใช้ fpdart สำหรับ error handling (Either<Failure, Success>)
- ใช้ `freezed` สำหรับ immutable data classes
- เขียน unit tests สำหรับ repository และ use cases

## Expected Outcome

- Flutter project ใช้ Clean Architecture แบ่ง layers ชัดเจน
- State management ด้วย Riverpod
- Navigation ด้วย GoRouter
- Error handling ด้วย fpdart Either pattern
- มี unit tests ครอบคลุม
