# Create Flutter App

Workflow for creating a Flutter application.

## Steps

1. **Install Flutter SDK**
   - Download Flutter SDK
   - Add to PATH
   - Run flutter doctor

2. **Create new project**
   ```bash
   flutter create my_app
   ```

3. **Choose template**
   - Application
   - Package
   - Plugin
   - FFI Plugin

4. **Configure project**
   - Set up dependencies
   - Configure pubspec.yaml
   - Set up platform-specific settings

5. **Implement widgets**
   - Create widgets
   - Add state management
   - Implement navigation

6. **Run development**
   ```bash
   cd my_app
   flutter run
   ```

7. **Build for production**
   ```bash
   flutter build apk  # Android
   flutter build ios  # iOS
   flutter build web  # Web
   ```

## Example: Simple Widget

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Hello Flutter')),
        body: const Center(child: Text('Hello World')),
      ),
    );
  }
}
```

## Best Practices

- Use const widgets
- Follow widget composition
- Use state management solutions
- Test on multiple platforms
- Optimize for performance
