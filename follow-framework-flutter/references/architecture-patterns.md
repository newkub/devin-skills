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
