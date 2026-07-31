# Configuration

## Compiler Configuration Options

### Build Configuration

### Optimization Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| **-O0** | No optimization | Debugging |
| **-O1** | Basic optimization | Development |
| **-O2** | Standard optimization | Production |
| **-O3** | Aggressive optimization | Performance-critical |
| **-Os** | Optimize for size | Embedded systems |
| **-Og** | Optimize for debugging | Debug with some optimization |

### Debug Configuration

```bash
# Enable debug symbols
gcc -g source.c

# Enable debug info with optimization
gcc -g -O1 source.c

# Generate source maps (for transpiled languages)
tsc --sourceMap
```

### Target Configuration

### Architecture Targets

```bash
# x86-64
gcc -march=x86-64 source.c

# ARM64
gcc -march=armv8-a source.c

# Native architecture
gcc -march=native source.c
```

### Operating System Targets

```bash
# Linux
gcc --target=x86_64-linux-gnu

# Windows
gcc --target=x86_64-w64-mingw32

# macOS
clang --target=x86_64-apple-darwin
```

### Language Configuration

### Language Standards

```bash
# C standards
gcc -std=c11 source.c
gcc -std=c17 source.c
gcc -std=c23 source.c

# C++ standards
g++ -std=c++17 source.cpp
g++ -std=c++20 source.cpp
g++ -std=c++23 source.cpp
```

### Language Features

```bash
# Enable specific features
gcc -fopenmp source.c      # OpenMP
gcc -fopenacc source.c     # OpenACC
gcc -fexceptions source.cpp # Exceptions
gcc -frtti source.cpp      # RTTI
```

### Warning Configuration

### Warning Levels

```bash
# Enable all warnings
gcc -Wall source.c

# Enable extra warnings
gcc -Wextra source.c

# Treat warnings as errors
gcc -Werror source.c

# Specific warnings
gcc -Wunused source.c
gcc -Wconversion source.c
gcc -Wsign-compare source.c
```

### Diagnostic Configuration

```bash
# Error format
gcc -fdiagnostics-color=always
gcc -fdiagnostics-show-option

# Error limits
gcc -fmax-errors=10
```

### Linker Configuration

### Library Linking

```bash
# Link static library
gcc source.c -lmylib -L/path/to/lib

# Link shared library
gcc source.c -lmylib

# Link specific library path
gcc source.c -L/usr/local/lib
```

### Linker Options

```bash
# Strip debug symbols
gcc -s source.c

# Position-independent code
gcc -fPIC -shared source.c

# Link-time optimization
gcc -flto source.c
```

### Runtime Configuration

### Runtime Library

```bash
# Static runtime
gcc -static source.c

# Dynamic runtime
gcc source.c

# Specific runtime
gcc -static-libgcc source.c
```

### Memory Configuration

```bash
# Stack size
gcc -Wl,--stack,8388608 source.c

# Heap size (platform-specific)
```

### Custom Configuration

### Compiler Flags

```bash
# Define macros
gcc -DDEBUG=1 source.c
gcc -DVERSION="1.0.0" source.c

# Include directories
gcc -I/path/to/include source.c

# Preprocessor definitions
gcc -E source.c > preprocessed.c
```

### Build System Configuration

### CMake Configuration

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyCompiler)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

option(BUILD_SHARED_LIBS "Build shared libraries" ON)
option(ENABLE_TESTING "Enable testing" ON)

add_executable(mycompiler src/main.c)
target_link_libraries(mycompiler PRIVATE mylib)
```

### Make Configuration

```makefile
CC = gcc
CFLAGS = -Wall -O2 -std=c11
LDFLAGS = -lm

all: mycompiler

mycompiler: main.o lexer.o parser.o
	$(CC) $(LDFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o mycompiler
```

### Environment Configuration

### Environment Variables

```bash
# Compiler path
export CC=/usr/bin/gcc
export CXX=/usr/bin/g++

# Library path
export LD_LIBRARY_PATH=/usr/local/lib

# Include path
export CPATH=/usr/local/include
```

### Cross-Compilation Configuration

```bash
# Set cross-compiler
export CC=arm-linux-gnueabihf-gcc
export CXX=arm-linux-gnueabihf-g++

# Set sysroot
export SYSROOT=/path/to/sysroot
export CFLAGS="--sysroot=$SYSROOT"
```
