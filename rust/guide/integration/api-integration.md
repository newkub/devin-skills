# API Integration (HTTP Client)

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

```rust
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct ApiResponse {
    data: String,
}

async fn fetch_data() -> Result<(), reqwest::Error> {
    let client = Client::new();
    
    let response = client
        .get("https://api.example.com/data")
        .header("Authorization", "Bearer token")
        .send()
        .await?;
    
    let data: ApiResponse = response.json().await?;
    println!("{}", data.data);
    
    Ok(())
}
```
