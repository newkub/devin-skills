# Installation

## การเตรียม Environment สำหรับ Database Design

### เครื่องมือที่จำเป็น

- **Database**: PostgreSQL, MySQL, MongoDB, Redis
- **IDE**: VS Code, DBeaver, DataGrip
- **ORM**: Prisma, Drizzle, TypeORM
- **Migration Tools**: Prisma Migrate, Flyway, Liquibase
- **Documentation**: Markdown, ERD tools

### การติดตั้ง

#### บน Linux

```bash
# ติดตั้ง PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# ติดตั้ง MySQL
sudo apt-get install mysql-server

# ติดตั้ง MongoDB
sudo apt-get install mongodb

# ติดตั้ง Redis
sudo apt-get install redis-server
```

#### บน macOS

```bash
# ติดตั้ง PostgreSQL ผ่าน Homebrew
brew install postgresql@14
brew services start postgresql@14

# ติดตั้ง MySQL ผ่าน Homebrew
brew install mysql
brew services start mysql

# ติดตั้ง MongoDB ผ่าน Homebrew
brew install mongodb-community
brew services start mongodb-community

# ติดตั้ง Redis ผ่าน Homebrew
brew install redis
brew services start redis
```

#### บน Windows

```powershell
# ติดตั้ง PostgreSQL
winget install PostgreSQL.PostgreSQL

# ติดตั้ง MySQL
winget install Oracle.MySQL

# ติดตั้ง MongoDB
winget install MongoDB.Server

# ติดตั้ง Redis
winget install Redis.Redis
```

### การติดตั้ง VS Code Extensions

```bash
# ติดตั้ง extensions ที่จำเป็น
code --install-extension ms-azuretools.vscode-docker
code --install-extension Prisma.prisma
code --install-extension mtxr.sqltools
code --install-extension PKief.material-icon-theme
```

### การตั้งค่า Project

```bash
# สร้าง project structure
mkdir database-demo
cd database-demo
mkdir prisma migrations docs

# เริ่ม Git repository
git init
echo "# Database Demo" > README.md
git add .
git commit -m "Initial commit"
```

### Dependencies

- **Node.js**: Prisma, TypeORM
- **Python**: SQLAlchemy, Django ORM
- **Go**: GORM, sqlx
- **Rust**: Diesel, sqlx
