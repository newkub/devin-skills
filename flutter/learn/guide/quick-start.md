# Quick Start

## เริ่มต้นใช้งาน Flutter อย่างรวดเร็ว

## Create New Project

```bash
# Create new Flutter project
flutter create my_app

# Navigate to project
cd my_app

# Run the app
flutter run
```

## Project Structure

```
my_app/
├── lib/
│   └── main.dart          # Entry point
├── test/                  # Test files
├── android/               # Android native code
├── ios/                   # iOS native code
├── web/                   # Web files
└── pubspec.yaml           # Dependencies
```

## Basic App Structure

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
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## Common Commands

```bash
# Run on specific device
flutter run -d chrome
flutter run -d windows
flutter run -d macos

# Build for release
flutter build apk --release
flutter build ios --release
flutter build web --release

# Run tests
flutter test

# Format code
flutter format .
```

## Add Dependencies

```bash
# Add package
flutter pub add provider

# Add dev dependency
flutter pub add --dev build_runner

# Get dependencies
flutter pub get
```
