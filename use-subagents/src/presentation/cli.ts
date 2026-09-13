#!/usr/bin/env bun
import { killTask, runTask } from "../application/runner";
import {
	getTask,
	newId,
	prune,
	removeTask,
	upsertTask,
} from "../data/store";
import type { AgentTask, Priority, TaskStatus } from "../domain/types";
import { printLog, printTable, watchDashboard } from "./dashboard";

const USAGE = `subagents — mission control for spawned agent tasks

  spawn:
    add <name> [--role r] [--pri p] [--dep id,...] [--parent id] -- <cmd...>
                                                             queue a task
    run <name> [--role r] [--pri p] [--dep ...] [--note t] -- <cmd...>
                                                             queue + spawn
    start <id>                                               run a queued task
    pump                                                     start all queued tasks with deps done
  external (Devin subagents, other sessions):
    register <name> [--role r] [--id devin-agent-id] [--note t]  track an external agent
    mark <id> <done|failed|killed|running> [--note t]            update its status
  manage:
    list [--status s] [--role r] [--q text]    table (ClickUp-style)
    watch                                      live TUI dashboard
    logs <id>                                  print task log
    note <id> <text>                           attach a note/result
    retry <id>                                 re-run failed/killed task
    kill <id>                                  terminate running task
    rm <id>                                    remove task record
    prune                                      drop all finished tasks

state: ~/.config/devin/subagents/tasks.json + logs/<id>.log`;

interface Parsed {
	name?: string;
	role: string;
	pri: Priority;
	note?: string;
	id?: string;
	deps?: string[];
	parent?: string;
	cmd: string;
}

function flag(argv: string[], name: string): string | undefined {
	const i = argv.indexOf(name);
	return i >= 0 ? argv[i + 1] : undefined;
}

function parseArgs(argv: string[]): Parsed {
	const i = argv.indexOf("--");
	const flags = argv.slice(0, i < 0 ? argv.length : i);
	const cmd = (i < 0 ? [] : argv.slice(i + 1))
		.filter((a) => a !== "--")
		.join(" ");
	const consumed = new Set<number>();
	for (const f of ["--role", "--pri", "--note", "--id", "--dep", "--parent"]) {
		const j = flags.indexOf(f);
		if (j >= 0) {
			consumed.add(j);
			consumed.add(j + 1);
		}
	}
	const name = flags.find((f, j) => !f.startsWith("--") && !consumed.has(j));
	return {
		name,
		role: flag(argv, "--role") ?? "general",
		pri: (flag(argv, "--pri") as Priority) ?? "med",
		note: flag(argv, "--note"),
		id: flag(argv, "--id"),
		deps: flag(argv, "--dep")?.split(",").filter(Boolean),
		parent: flag(argv, "--parent"),
		cmd,
	};
}

function newTask(p: Parsed, source: AgentTask["source"]): AgentTask {
	return {
		id: p.id ?? newId(),
		name: p.name ?? "unnamed",
		role: p.role,
		cmd: p.cmd,
		status: source === "devin" ? "running" : "queued",
		source,
		priority: p.pri,
		note: p.note,
		deps: p.deps?.map((d) => getTask(d)?.id ?? d),
		parent: p.parent ? (getTask(p.parent)?.id ?? p.parent) : undefined,
		createdAt: Date.now(),
		startedAt: source === "devin" ? Date.now() : undefined,
	};
}

const [op, ...rest] = process.argv.slice(2);

switch (op) {
	case "add":
	case "run": {
		const p = parseArgs(rest);
		if (!p.name || !p.cmd) {
			console.error("usage: subagents add|run <name> [--role r] -- <cmd...>");
			process.exit(1);
		}
		const task = newTask(p, "shell");
		if (op === "run") {
			runTask(task);
			console.log(`▶ ${task.id} running: ${task.name} (pid ${task.pid})`);
		} else {
			upsertTask(task);
			console.log(`… ${task.id} queued: ${task.name}`);
		}
		break;
	}
	case "start": {
		const t = rest[0] && getTask(rest[0]);
		if (!t) {
			console.error("task not found");
			process.exit(1);
		}
		runTask(t);
		console.log(`▶ ${t.id} ${t.status} ${t.status === "blocked" ? "(deps pending)" : `pid ${t.pid}`}`);
		break;
	}
	case "pump": {
		const { pump } = await import("../application/runner");
		const started = pump();
		console.log(
			started.length
				? `▶ pumped ${started.length}: ${started.map((t) => t.id.slice(0, 8)).join(", ")}`
				: "nothing ready",
		);
		break;
	}
	case "register": {
		const p = parseArgs(rest);
		if (!p.name) {
			console.error("usage: subagents register <name> [--role r] [--id x] [--note t]");
			process.exit(1);
		}
		const task = newTask(p, "devin");
		upsertTask(task);
		console.log(`◆ ${task.id} registered (devin): ${task.name}`);
		break;
	}
	case "mark": {
		const t = rest[0] && getTask(rest[0]);
		const status = rest[1] as TaskStatus;
		if (
			!t ||
			!["done", "failed", "killed", "running", "queued", "blocked"].includes(
				status,
			)
		) {
			console.error("usage: subagents mark <id> <status> [--note t]");
			process.exit(1);
		}
		t.status = status;
		t.note = flag(rest, "--note") ?? t.note;
		if (!["running", "queued", "blocked"].includes(status))
			t.finishedAt = Date.now();
		upsertTask(t);
		console.log(`${t.id} → ${status}`);
		break;
	}
	case "note": {
		const t = rest[0] && getTask(rest[0]);
		if (!t || !rest[1]) {
			console.error("usage: subagents note <id> <text>");
			process.exit(1);
		}
		t.note = rest.slice(1).join(" ");
		upsertTask(t);
		console.log(`noted ${t.id}`);
		break;
	}
	case "retry": {
		const t = rest[0] && getTask(rest[0]);
		if (!t) {
			console.error("task not found");
			process.exit(1);
		}
		runTask({ ...t, status: "queued", finishedAt: undefined });
		console.log(`↻ ${t.id} retrying`);
		break;
	}
	case "list":
	case "ls":
		printTable({
			status: flag(rest, "--status"),
			role: flag(rest, "--role"),
			q: flag(rest, "--q"),
		});
		break;
	case "watch":
		await watchDashboard();
		break;
	case "logs":
		if (!rest[0]) {
			console.error("usage: subagents logs <id>");
			process.exit(1);
		}
		printLog(getTask(rest[0])?.id ?? rest[0]);
		break;
	case "kill": {
		const t = rest[0] && getTask(rest[0]);
		console.log(t && killTask(t) ? `■ killed ${t.id}` : "not running/found");
		break;
	}
	case "rm":
		console.log(
			rest[0] && removeTask(rest[0]) ? `removed ${rest[0]}` : "not found",
		);
		break;
	case "prune":
		console.log(`pruned ${prune()} finished tasks`);
		break;
	default:
		console.log(USAGE);
}
