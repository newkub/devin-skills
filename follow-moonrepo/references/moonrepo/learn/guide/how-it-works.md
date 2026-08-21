# How It Works

วิธีการทำงานของ moonrepo

## Architecture

```
User Command
    ↓
moon CLI
    ↓
Read moon.yml
    ↓
Resolve Projects
    ↓
Resolve Tasks
    ↓
Calculate Hashes
    ↓
Check Cache
    ↓
Execute Tasks
    ↓
Cache Outputs
```

## Execution Flow

### 1. Command Parsing
moon CLI parse command:
- Parse task name
- Parse options
- Parse filters

### 2. Configuration Loading
moon อ่าน configuration:
- Read `moon.yml`
- Read project configs
- Merge configurations

### 3. Project Resolution
moon resolve projects:
- Find matching projects
- Filter by options
- Sort by dependencies

### 4. Task Resolution
moon resolve tasks:
- Find matching tasks
- Resolve dependencies
- Create execution graph

### 5. Hash Calculation
moon calculate hashes:
- Hash source files
- Hash dependencies
- Hash configuration

### 6. Cache Check
moon check cache:
- Check local cache
- Check remote cache
- Return cached outputs if available

### 7. Task Execution
moon execute tasks:
- Execute tasks in parallel
- Execute tasks sequentially (if dependent)
- Capture outputs

### 8. Cache Storage
moon store outputs:
- Store in local cache
- Store in remote cache
- Update cache metadata

## Example Flow

```bash
# User runs
bunx moon run build

# moon CLI
# 1. Parse command
# 2. Read moon.yml
# 3. Resolve projects
# 4. Resolve tasks
# 5. Calculate hashes
# 6. Check cache
# 7. Execute tasks (if not cached)
# 8. Store outputs
```

## Smart Hashing

### Hash Inputs
moon hash inputs:
- Source files
- Dependencies
- Configuration
- Environment variables

### Hash Outputs
moon hash outputs:
- Build artifacts
- Test results
- Generated files

## Remote Caching

### Cache Upload
moon upload cache:
- Upload to remote cache
- Compress outputs
- Store metadata

### Cache Download
moon download cache:
- Download from remote cache
- Decompress outputs
- Restore files
