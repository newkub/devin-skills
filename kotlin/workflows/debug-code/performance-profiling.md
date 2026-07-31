# Performance Profiling

## IntelliJ Profiler

1. Run → Profile
2. Select profiling type:
   - CPU: Method execution time
   - Memory: Allocation and GC
   - Threads: Thread activity
3. Analyze results in profiler window

## Android Profiler

1. Run app
2. View → Tool Windows → Profiler
3. Select CPU, Memory, Network, or Energy
4. Record and analyze performance

## Async Profiler

```bash
# Install async-profiler
# Run with profiler
java -agentpath:/path/to/libasyncProfiler.so=start,profile=100,file=profile.svg -jar app.jar
```
