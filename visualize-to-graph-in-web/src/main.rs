use std::io::{self, Read};
use std::path::PathBuf;
use std::process::ExitCode;

use anyhow::{Context, Result};
use clap::Parser;

use visualize_to_graph_in_web::{generate_html, layout, Graph};

#[derive(Parser, Debug)]
#[command(
    name = "visualize-to-graph-in-web",
    version,
    about = "สร้าง web graph visualizer ด้วย Rust CLI และ Solid frontend"
)]
struct Args {
    /// ไฟล์ JSON ที่มี nodes/edges (ถ้าไม่ระบุ อ่านจาก stdin)
    #[arg(value_name = "INPUT")]
    input: Option<PathBuf>,

    /// path ของ output HTML (หรือ directory ที่จะเขียน index.html)
    #[arg(short, long, default_value = "index.html", value_name = "OUTPUT")]
    output: PathBuf,

    /// ความกว้างของ viewBox
    #[arg(long, default_value_t = 1000.0)]
    width: f64,

    /// ความสูงของ viewBox
    #[arg(long, default_value_t = 800.0)]
    height: f64,

    /// จำนวนรอบ force-directed layout
    #[arg(long, default_value_t = 300)]
    iterations: usize,
}

fn main() -> ExitCode {
    let args = Args::parse();
    match run(&args) {
        Ok(path) => {
            println!("{}", path.display());
            ExitCode::SUCCESS
        }
        Err(err) => {
            eprintln!("ERROR: {}", err);
            ExitCode::FAILURE
        }
    }
}

fn run(args: &Args) -> Result<PathBuf> {
    let json = read_input(args.input.as_deref())?;
    let mut graph: Graph = serde_json::from_str(&json).context("invalid input JSON")?;

    layout::compute(&mut graph, args.width, args.height, args.iterations);

    let html = generate_html(&graph)?;

    let output = if args.output.is_dir() {
        args.output.join("index.html")
    } else {
        args.output.clone()
    };

    std::fs::write(&output, html).context("failed to write output HTML")?;
    Ok(output)
}

fn read_input(path: Option<&std::path::Path>) -> Result<String> {
    match path {
        Some(p) => std::fs::read_to_string(p).context("failed to read input file"),
        None => {
            let mut buf = String::new();
            io::stdin()
                .read_to_string(&mut buf)
                .context("failed to read stdin")?;
            Ok(buf)
        }
    }
}
