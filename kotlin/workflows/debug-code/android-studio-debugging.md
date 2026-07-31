# Android Studio Debugging

## Debug Android App

1. Connect device or start emulator
2. Click "Debug 'app'" button
3. Set breakpoints in code
4. Interact with app to trigger breakpoints

## Logcat Debugging

```kotlin
// Use Logcat for debugging
import android.util.Log

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("MainActivity", "onCreate called")
        Log.e("MainActivity", "Error occurred", exception)
    }
}
```

## Layout Inspector

1. Run app
2. Tools → Layout Inspector
3. Inspect view hierarchy
4. Check view properties

## Network Inspector

1. Run app
2. View → Tool Windows → App Inspection
3. Select Network Inspector
4. Monitor network requests
