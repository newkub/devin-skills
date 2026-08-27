use std::env;
use std::path::Path;

mod graph;

fn main() {
    let args: Vec<String> = env::args().collect();
    let repo_path = args.get(1).map(|s| s.as_str()).unwrap_or(".");
    let graph = graph::build(Path::new(repo_path));
    let json = serde_json::to_string_pretty(&graph).expect("serialize graph");
    println!("{}", json);
}
