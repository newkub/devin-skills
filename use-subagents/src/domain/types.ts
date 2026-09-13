export type TaskStatus =
	| "queued"
	| "blocked"
	| "running"
	| "done"
	| "failed"
	| "killed";

/** Where the task was spawned — `devin` = registered by an agent session. */
export type TaskSource = "shell" | "devin";

export type Priority = "low" | "med" | "high";

export interface AgentTask {
	id: string;
	name: string;
	role: string;
	cmd: string;
	status: TaskStatus;
	source: TaskSource;
	priority: Priority;
	note?: string;
	pid?: number;
	exitCode?: number;
	/** Task ids that must reach `done` before this may run. */
	deps?: string[];
	/** Parent task id — renders nested under it; parent rolls up progress. */
	parent?: string;
	createdAt: number;
	startedAt?: number;
	finishedAt?: number;
}

export const STATUS_ICON: Record<TaskStatus, string> = {
	queued: "…",
	blocked: "⊘",
	running: "▶",
	done: "✓",
	failed: "✗",
	killed: "■",
};

export const STATUS_COLOR: Record<TaskStatus, string> = {
	queued: "\x1b[90m",
	blocked: "\x1b[35m",
	running: "\x1b[36m",
	done: "\x1b[32m",
	failed: "\x1b[31m",
	killed: "\x1b[33m",
};

export const PRIORITY_ICON: Record<Priority, string> = {
	high: "↑",
	med: "-",
	low: "↓",
};

export const PRIORITY_COLOR: Record<Priority, string> = {
	high: "\x1b[31m",
	med: "\x1b[90m",
	low: "\x1b[34m",
};
