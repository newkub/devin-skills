# Installation

## การเตรียม Environment สำหรับ Runtime Optimization

### เครื่องมือที่จำเป็น

- **Profiler**: perf, VTune, Instruments, หรือ custom profiler
- **Benchmarking**: Google Benchmark, Criterion, หรือ custom
- **Compiler**: GCC, Clang, หรือ MSVC พร้อม optimization flags
- **Debugger**: GDB, LLDB, หรือ Visual Studio Debugger
- **Analysis Tools**: Valgrind, AddressSanitizer, ThreadSanitizer

### การติดตั้ง

#### บน Linux

```bash
# Ubuntu/Debian
sudo apt-get install build-essential perf valgrind

# Install Google Benchmark
git clone https://github.com/google/benchmark.git
cd benchmark
cmake -DCMAKE_BUILD_TYPE=Release
make -j
sudo make install

# Install perf
sudo apt-get install linux-tools-common linux-tools-generic
```

#### บน macOS

```bash
# ติดตั้ง Xcode Command Line Tools
xcode-select --install

# ติดตั้ง Instruments (มากับ Xcode)
# Instruments อยู่ใน Xcode > Open Developer Tool > Instruments

# ติดตั้ง Google Benchmark ผ่าน Homebrew
brew install google-benchmark
```

#### บน Windows

```powershell
# ติดตั้ง Visual Studio (รวม Profiler)
# ดาวน์โหลดจาก: https://visualstudio.microsoft.com/downloads/

# ติดตั้ง Intel VTune (ถ้ามี Intel CPU)
winget install Intel.VTune

# ติดตั้ง Google Benchmark
git clone https://github.com/google/benchmark.git
cd benchmark
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
```

### การตั้งค่า Project

```bash
# สร้าง project structure
mkdir runtime-optimization
cd runtime-optimization
mkdir src include tests benchmark build

# เริ่ม CMake project
cd build
cmake ..
```

### Dependencies

- **Benchmarking**: Google Benchmark, Criterion
- **Profiling**: perf, VTune, Instruments
- **Memory Analysis**: Valgrind, AddressSanitizer
- **Thread Analysis**: ThreadSanitizer, Helgrind
