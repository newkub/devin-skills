# Installation

## การเตรียม Environment สำหรับ Algorithms Study

### เครื่องมือที่จำเป็น

- **Programming Language**: Python, C++, Java, หรือภาษาที่ชอบ
- **IDE**: VS Code, IntelliJ IDEA, หรือ IDE ที่ชอบ
- **Visualization**: Graphviz, PlantUML, หรือ draw.io
- **Testing Framework**: pytest, JUnit, หรือ framework ที่เหมาะสม
- **Profiling**: cProfile, VisualVM, หรือ profiler ที่เหมาะสม

### การติดตั้ง

#### บน Linux

```bash
# ติดตั้ง Python
sudo apt-get install python3 python3-pip

# ติดตั้ง Graphviz
sudo apt-get install graphviz

# ติดตั้ง PlantUML
sudo apt-get install plantuml

# ติดตั้ง libraries
pip3 install numpy matplotlib networkx
```

#### บน macOS

```bash
# ติดตั้ง Python ผ่าน Homebrew
brew install python3

# ติดตั้ง Graphviz
brew install graphviz

# ติดตั้ง PlantUML
brew install plantuml

# ติดตั้ง libraries
pip3 install numpy matplotlib networkx
```

#### บน Windows

```powershell
# ติดตั้ง Python
winget install Python.Python.3.11

# ติดตั้ง Graphviz
winget install Graphviz.Graphviz

# ติดตั้ง PlantUML
winget install PlantUML.PlantUML

# ติดตั้ง libraries
pip install numpy matplotlib networkx
```

### การตั้งค่า VS Code Extensions

```bash
# ติดตั้ง extensions ที่จำเป็น
code --install-extension ms-python.python
code --install-extension ms-azuretools.vscode-docker
code --install-extension jebbs.plantuml
code --install-extension PKief.material-icon-theme
```

### การตั้งค่า Project

```bash
# สร้าง project structure
mkdir algorithms-study
cd algorithms-study
mkdir src tests docs visualizations

# เริ่ม Git repository
git init
echo "# Algorithms Study" > README.md
git add .
git commit -m "Initial commit"
```

### Dependencies

- **Python Libraries**: numpy, matplotlib, networkx
- **Visualization**: Graphviz, PlantUML
- **Testing**: pytest, unittest
- **Profiling**: cProfile, line_profiler
