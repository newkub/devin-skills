#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum Decision {
    #[default]
    Skip,
    Update,
    Create,
}

impl std::fmt::Display for Decision {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Decision::Skip => write!(f, "skip"),
            Decision::Update => write!(f, "update"),
            Decision::Create => write!(f, "create"),
        }
    }
}
