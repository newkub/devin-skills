# Best Practices

## Code Organization

| Practice | Description |
|----------|-------------|
| **Separate Concerns** | แยก UI, Business Logic, และ Data layer |
| **Use Repository Pattern** | Abstract data sources จาก business logic |
| **Consistent File Naming** | ใช้ snake_case สำหรับไฟล์และ class |
| **Keep Widgets Small** | ไม่เกิน 150 lines ต่อ widget |

## Widget Best Practices

```dart
// ✅ Good: Small, focused widget
class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, required this.imageUrl});

  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      backgroundImage: NetworkImage(imageUrl),
    );
  }
}

// ❌ Bad: Large widget doing too much
class UserProfilePage extends StatelessWidget {
  // 500+ lines of code
}
```

## State Management

| Pattern | Use Case |
|---------|----------|
| `setState` | Simple local state |
| `Provider` | Simple dependency injection |
| `Riverpod` | Type-safe, testable state |
| `BLoC` | Complex event-driven apps |
| `GetX` | Quick prototyping |

## Performance

| Practice | Description |
|----------|-------------|
| **Use `const` constructors** | const widgets are cached |
| **Avoid rebuilds** | Use `RepaintBoundary` sparingly |
| **ListView.builder** | Lazy loading for large lists |
| **Cache network images** | Use `CachedNetworkImage` |
| **Avoid large widget trees** | Break down deeply nested widgets |

```dart
// ✅ Good: Use const
const Text('Hello', style: TextStyle(fontSize: 16));

// ❌ Bad: Unnecessary rebuild
Text('Hello ${someVariable}', style: TextStyle(fontSize: 16));

// ✅ Good: ListView.builder for large lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(title: Text(items[index])),
);

// ❌ Bad: ListView for all items
ListView(children: items.map((item) => ListTile(title: Text(item))).toList());
```

## Error Handling

```dart
// ✅ Use try-catch with async
Future<void> fetchData() async {
  try {
    final response = await http.get(uri);
    // handle response
  } on SocketException {
    // No internet
  } on TimeoutException {
    // Request timeout
  } catch (e) {
    // Generic error
    rethrow;
  }
}
```

## Testing

| Type | Target |
|------|--------|
| **Unit Test** | Business logic, repositories |
| **Widget Test** | Individual widgets |
| **Integration Test** | Full app flow |

```dart
testWidgets('Counter increments', (WidgetTester tester) async {
  await tester.pumpWidget(const MyApp());
  expect(find.text('0'), findsOneWidget);
  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();
  expect(find.text('1'), findsOneWidget);
});
```

## Security

| Practice | Description |
|----------|-------------|
| **Secure Storage** | ใช้ flutter_secure_storage สำหรับ sensitive data |
| **Validate Input** | ตรวจสอบ user input ก่อนใช้งาน |
| **HTTPS Only** | หลีกเลี่ยง HTTP connections |
| **Obfuscate Release** | ใช้ code obfuscation สำหรับ release |

## Navigation

```dart
// ✅ Use named routes
Navigator.pushNamed(context, '/details', arguments: itemId);

// ✅ Use go_router for complex navigation
GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => const HomePage()),
    GoRoute(path: '/details/:id', builder: (context, state) => DetailsPage(id: state.pathParameters['id']!)),
  ],
);
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Deep widget nesting | Use Builder or pass callbacks |
| Memory leaks | Dispose controllers and listeners |
| Rebuilds everywhere | Use `const`, `ValueListenableBuilder` |
| Large images | Resize before loading |
| Blocking UI | Use async/await and isolates |
