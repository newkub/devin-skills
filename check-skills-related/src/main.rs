mod graph;
mod output;
mod parser;

use std::env;
use std::path::PathBuf;

#[derive(Debug, Default)]
pub struct Args {
    pub root: PathBuf,
    pub skill: String,
    pub tree_depth: usize,
    pub mode: String,
    pub include_transitive: bool,
    pub first_cycle: bool,
    positional: Option<String>,
}

impl Args {
    pub fn parse() -> Self {
        let mut a = Args {
            root: default_root(),
            tree_depth: 3,
            mode: "Summary".to_string(),
            ..Default::default()
        };
        let mut raw = env::args().skip(1);
        while let Some(arg) = raw.next() {
            match arg.as_str() {
                "-Root" => a.root = PathBuf::from(raw.next().unwrap_or_default()),
                "-Skill" => a.skill = raw.next().unwrap_or_default(),
                "-TreeDepth" => a.tree_depth = raw.next().unwrap_or_default().parse().unwrap_or(3),
                "-Mode" => a.mode = raw.next().unwrap_or_else(|| "Summary".to_string()),
                "-IncludeTransitive" => a.include_transitive = true,
                "-FirstCycle" => a.first_cycle = true,
                _ => {
                    if a.positional.is_none() {
                        a.positional = Some(arg);
                    }
                }
            }
        }
        if let Some(ref p) = a.positional {
            if a.skill.is_empty() {
                if std::path::Path::new(p).is_dir() {
                    a.root = PathBuf::from(p);
                } else {
                    a.skill = p.clone();
                }
            }
        }
        if !a.skill.is_empty() && a.mode == "Summary" {
            a.mode = "Tree".to_string();
        }
        a
    }
}

fn default_root() -> PathBuf {
    let mut p = PathBuf::from(env::var("APPDATA").unwrap_or_default());
    p.push("devin");
    p.push("skills");
    p
}

fn main() {
    let args = Args::parse();
    if !args.root.is_dir() {
        eprintln!("ERROR: Target directory not found: {}", args.root.display());
        std::process::exit(1);
    }
    let (graph, unknown) = parser::load_graph(&args.root);
    if graph.is_empty() {
        println!("No skills found in {}", args.root.display());
        std::process::exit(0);
    }
    match args.mode.as_str() {
        "Summary" => output::run_summary(&graph, &unknown),
        "Tree" => output::run_tree(
            &graph,
            &args.skill,
            args.tree_depth,
            args.include_transitive,
        ),
        "Cycles" => output::run_cycles(&graph, args.first_cycle),
        "Orphans" => output::run_orphans(&graph),
        "Verify" => std::process::exit(output::run_verify(&graph)),
        "Full" => output::run_full(&graph, args.include_transitive),
        _ => {
            eprintln!("ERROR: Unknown mode: {}", args.mode);
            std::process::exit(1);
        }
    }
}
