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

### 1. Data Layer: การจัดการข้อมูล

### 2. `data/models` (DTOs)

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

### 3. `data/repositories`

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

### 4. Domain Layer: ตรรกะทางธุรกิจ

### 5. `domain/repositories`

กำหนด Interface โดยใช้ `FutureEither` เพื่อบังคับให้มีการจัดการ Error

```dart
// lib/src/domain/repositories/user_repository.dart
import 'package:your_app/src/core/typedefs/future_either.dart';
import 'package:your_app/src/domain/models/user.dart';

abstract class UserRepository {
  FutureEither<User> getUser(String id);
}
```

### 6. `domain/usecases`

สร้าง Use Case สำหรับแต่ละ Business Flow เพื่อให้ Logic ถูกแยกและนำกลับมาใช้ใหม่ได้

```dart
// lib/src/domain/usecases/get_user_usecase.dart
class GetUserUseCase {
  final UserRepository _repository;

  GetUserUseCase(this._repository);

  FutureEither<User> call(String id) => _repository.getUser(id);
}
```

### 7. Presentation Layer: UI และ State

### 8. `presentation/providers`

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

### 9. `presentation/screens`

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
