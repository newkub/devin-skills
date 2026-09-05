use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Node {
    pub id: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub label: String,
    pub metadata: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Edge {
    pub source: String,
    pub target: String,
    #[serde(rename = "type")]
    pub kind: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RepoGraph {
    pub nodes: Vec<Node>,
    pub edges: Vec<Edge>,
}

fn manifest_type(name: &str) -> Option<&str> {
    match name {
        "package.json" => Some("node"),
        "Cargo.toml" => Some("rust"),
        "go.mod" => Some("go"),
        "pyproject.toml" | "requirements.txt" => Some("python"),
        _ => None,
    }
}

fn file_type(path: &Path) -> &str {
    if path.is_dir() {
        "directory"
    } else {
        "file"
    }
}

fn relative_id(base: &Path, path: &Path) -> String {
    path.strip_prefix(base)
        .unwrap_or(path)
        .to_string_lossy()
        .replace('\\', "/")
}

pub fn build(repo: &Path) -> RepoGraph {
    let mut nodes = Vec::new();
    let mut edges = Vec::new();
    let mut seen = HashMap::new();

    for entry in WalkDir::new(repo)
        .max_depth(3)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path = entry.path();
        let rel = relative_id(repo, path);
        let id = format!("node:{}", rel);
        let kind = file_type(path);

        let mut metadata = HashMap::new();
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if let Some(tech) = manifest_type(name) {
                metadata.insert("tech".to_string(), tech.to_string());
            }
        }

        nodes.push(Node {
            id: id.clone(),
            kind: kind.to_string(),
            label: rel.clone(),
            metadata,
        });
        seen.insert(path.to_path_buf(), id.clone());

        if let Some(parent) = path.parent() {
            if let Some(parent_id) = seen.get(&parent.to_path_buf()) {
                edges.push(Edge {
                    source: parent_id.clone(),
                    target: id,
                    kind: "contains".to_string(),
                });
            }
        }
    }

    RepoGraph { nodes, edges }
}
