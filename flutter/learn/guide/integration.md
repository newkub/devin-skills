# Integration

## การรวม Flutter กับ tools และ services อื่นๆ

## State Management Libraries

### Provider

```bash
flutter pub add provider
```

```dart
// Create provider
class Counter extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Wrap app with provider
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: const MyApp(),
    ),
  );
}

// Consume provider
Consumer<Counter>(
  builder: (context, counter, child) {
    return Text('Count: ${counter.count}');
  },
)
```

### Riverpod

```bash
flutter pub add flutter_riverpod
```

```dart
// Create provider
final counterProvider = StateProvider<int>((ref) => 0);

// Wrap app with provider
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

// Consume provider
final count = ref.watch(counterProvider);
Text('Count: $count')
```

### BLoC

```bash
flutter pub add flutter_bloc
```

```dart
// Create BLoC
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
}

// Provide BLoC
BlocProvider(
  create: (context) => CounterCubit(),
  child: const CounterView(),
)

// Consume BLoC
BlocBuilder<CounterCubit, int>(
  builder: (context, count) => Text('Count: $count'),
)
```

## Backend Integration

### Firebase

```bash
flutter pub add firebase_core firebase_auth cloud_firestore
```

```dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const MyApp());
}
```

### REST API

```bash
flutter pub add http
```

```dart
import 'package:http/http.dart' as http;

Future<void> fetchData() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/data'),
  );

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    // Handle data
  }
}
```

### GraphQL

```bash
flutter pub add graphql_flutter
```

## Local Storage

### SharedPreferences

```bash
flutter pub add shared_preferences
```

```dart
final prefs = await SharedPreferences.getInstance();
await prefs.setString('key', 'value');
final value = prefs.getString('key');
```

### Hive

```bash
flutter pub add hive
flutter pub add --dev hive_generator
```

### SQLite

```bash
flutter pub add sqflite
```

## Navigation

### go_router

```bash
flutter pub add go_router
```

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/details/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailsPage(id: id);
      },
    ),
  ],
);
```

## Dependency Injection

### GetIt

```bash
flutter pub add get_it
```

```dart
final getIt = GetIt.instance;

void setupLocator() {
  getIt.registerLazySingleton(() => ApiService());
  getIt.registerFactory(() => UserRepository(getIt()));
}
```
