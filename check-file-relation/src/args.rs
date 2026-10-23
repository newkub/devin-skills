use std::collections::HashSet;
use std::env;
use std::fs;
use std::io::Write;
use std::path::PathBuf;

use globset::{Glob, GlobSet, GlobSetBuilder};
use regex::Regex;

use crate::walk::DEFAULT_EXTS;

pub(crate) struct Opts {
    pub(crate) target: PathBuf,
    pub(crate) exts: HashSet<String>,
    pub(crate) patterns: Vec<Regex>,
    pub(crate) all: bool,
    pub(crate) from: Option<PathBuf>,
    pub(crate) json: bool,
    pub(crate) summary: bool,
    pub(crate) no_ignore: bool,
    pub(crate) order: Order,
    pub(crate) max_lines: Option<usize>,
    pub(crate) out: Option<PathBuf>,
    pub(crate) includes: GlobSet,
}

#[derive(Clone, Copy, PartialEq)]
pub(crate) enum Order {
    Alpha,
    Deps,
    Smart,
}

fn usage() -> ! {
    eprintln!(
        "check-file-relation <dir> [options]

Modes:
  (default)            relation map: file -> imports (resolved or [external])
  --all                concat every matched file: ===== <path> ===== + content
  --from <file>        concat only files reachable from <file> via imports (deps first)
  --summary            stats only: most imported internal files
  --json               machine-readable graph JSON

Options:
  --ext <csv>          extensions (default: ts,tsx,js,jsx,mts,cts,rs,go,py,java,kt,kts,cs,vue,svelte)
  --include <glob>     only files matching glob vs root-rel path (repeatable, csv ok;
                       overrides --ext so non-source files like *.json match too)
  --pattern <regex>    custom import regex, first capture group = specifier (repeatable)
  --order <mode>       concat order: alpha | deps (import topo) | smart (config->entry->deps->rest)
  --max-lines <n>      truncate each file in concat modes
  --no-ignore          also scan node_modules/.git/target/dist/...
  --out <file>         write output to file instead of stdout
  -h, --help           this help"
    );
    std::process::exit(2);
}

pub(crate) fn parse_args() -> Opts {
    let args: Vec<String> = env::args().skip(1).collect();
    let mut o = Opts {
        target: PathBuf::from("."),
        exts: DEFAULT_EXTS.iter().map(|s| s.to_string()).collect(),
        patterns: Vec::new(),
        all: false,
        from: None,
        json: false,
        summary: false,
        no_ignore: false,
        order: Order::Alpha,
        max_lines: None,
        out: None,
        includes: GlobSet::empty(),
    };
    let mut inc_builder = GlobSetBuilder::new();
    let mut order_set = false;
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-h" | "--help" => usage(),
            "--all" => o.all = true,
            "--json" => o.json = true,
            "--summary" => o.summary = true,
            "--no-ignore" => o.no_ignore = true,
            "--ext" => {
                i += 1;
                o.exts = args
                    .get(i)
                    .unwrap_or_else(|| usage())
                    .split(',')
                    .map(|e| e.trim_start_matches('.').to_lowercase())
                    .collect();
            }
            "--include" => {
                i += 1;
                for part in args.get(i).unwrap_or_else(|| usage()).split(',') {
                    match Glob::new(part.trim()) {
                        Ok(g) => {
                            inc_builder.add(g);
                        }
                        Err(e) => {
                            eprintln!("invalid --include '{}': {}", part, e);
                            std::process::exit(2);
                        }
                    }
                }
            }
            "--pattern" => {
                i += 1;
                let p = args.get(i).unwrap_or_else(|| usage());
                match Regex::new(p) {
                    Ok(r) => o.patterns.push(r),
                    Err(e) => {
                        eprintln!("invalid --pattern '{}': {}", p, e);
                        std::process::exit(2);
                    }
                }
            }
            "--from" => {
                i += 1;
                o.from = Some(PathBuf::from(args.get(i).unwrap_or_else(|| usage())));
                if !order_set {
                    o.order = Order::Deps;
                }
            }
            "--order" => {
                i += 1;
                order_set = true;
                o.order = match args.get(i).map(|s| s.as_str()) {
                    Some("alpha") => Order::Alpha,
                    Some("deps") => Order::Deps,
                    Some("smart") => Order::Smart,
                    other => {
                        eprintln!("invalid --order {:?} (alpha|deps|smart)", other);
                        std::process::exit(2);
                    }
                };
            }
            "--max-lines" => {
                i += 1;
                o.max_lines = args.get(i).and_then(|s| s.parse().ok());
            }
            "--out" => {
                i += 1;
                o.out = Some(PathBuf::from(args.get(i).unwrap_or_else(|| usage())));
            }
            a if a.starts_with("--") => {
                eprintln!("unknown flag: {}", a);
                usage();
            }
            a => o.target = PathBuf::from(a),
        }
        i += 1;
    }
    o.includes = inc_builder.build().unwrap_or_else(|_| GlobSet::empty());
    o
}

pub(crate) fn open_out(out: &Option<PathBuf>) -> Box<dyn Write> {
    match out {
        Some(p) => Box::new(std::io::BufWriter::new(fs::File::create(p).unwrap_or_else(
            |e| {
                eprintln!("cannot create {}: {}", p.display(), e);
                std::process::exit(1)
            },
        ))),
        None => Box::new(std::io::BufWriter::new(std::io::stdout())),
    }
}
