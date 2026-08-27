use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;

use ignore::WalkBuilder;

const DEFAULT_THRESHOLD: usize = 250;
const EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx"];

fn main() {
    let args: Vec<String> = env::args().collect();
    let threshold: usize = args
        .get(1)
        .and_then(|s| s.parse().ok())
        .unwrap_or(DEFAULT_THRESHOLD);

    let mut results: Vec<(String, usize)> = Vec::new();

    for result in WalkBuilder::new(".").require_git(false).build() {
        let entry = match result {
            Ok(e) => e,
            Err(err) => {
                eprintln!("Warning: {}", err);
                continue;
            }
        };

        if !entry.file_type().is_some_and(|ft| ft.is_file()) {
            continue;
        }

        let path = entry.path();
        if !is_source_file(path) {
            continue;
        }

        match count_lines(path) {
            Ok(lines) => {
                if lines > threshold {
                    let display = path.to_string_lossy().into_owned().replace('\\', "/");
                    results.push((display, lines));
                }
            }
            Err(err) => {
                if err.kind() != std::io::ErrorKind::NotFound {
                    eprintln!("Warning: could not count {}: {}", path.display(), err);
                }
            }
        }
    }

    results.sort_by_key(|a| std::cmp::Reverse(a.1));

    if results.is_empty() {
        println!("No files exceeding {} lines found.", threshold);
    } else {
        for (path, lines) in &results {
            println!("{:>8}  {}", lines, path);
        }
        println!(
            "\nTotal files exceeding {} lines: {}",
            threshold,
            results.len()
        );
    }
}

fn is_source_file(path: &Path) -> bool {
    path.extension()
        .and_then(|s| s.to_str())
        .is_some_and(|ext| EXTENSIONS.contains(&ext))
}

fn count_lines(path: &Path) -> std::io::Result<usize> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    Ok(reader.lines().count())
}
