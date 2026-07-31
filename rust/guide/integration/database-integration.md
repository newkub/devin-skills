# Database Integration

### SQLx

```toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres", "macros"] }
```

```rust
use sqlx::PgPool;

#[derive(sqlx::FromRow)]
struct User {
    id: i32,
    name: String,
    email: String,
}

async fn get_user(pool: &PgPool, id: i32) -> Result<User, sqlx::Error> {
    sqlx::query_as!(
        User,
        "SELECT id, name, email FROM users WHERE id = $1",
        id
    )
    .fetch_one(pool)
    .await
}
```

### rusqlite

```toml
[dependencies]
rusqlite = { version = "0.31", features = ["bundled"] }
```

```rust
use rusqlite::{Connection, Result};

fn main() -> Result<()> {
    let conn = Connection::open("test.db")?;
    
    conn.execute(
        "CREATE TABLE person (id INTEGER PRIMARY KEY, name TEXT)",
        [],
    )?;
    
    conn.execute(
        "INSERT INTO person (name) VALUES (?1)",
        ["Alice"],
    )?;
    
    let mut stmt = conn.prepare("SELECT id, name FROM person")?;
    let persons = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?))
    })?;
    
    for person in persons {
        println!("{:?}", person);
    }
    Ok(())
}
```
