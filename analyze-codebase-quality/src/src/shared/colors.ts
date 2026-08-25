import type { Severity } from "./types.js";

export const COLORS: Record<string, string> = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
	brightRed: "\x1b[91m",
	brightGreen: "\x1b[92m",
	brightYellow: "\x1b[93m",
	brightBlue: "\x1b[94m",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
	critical: COLORS.brightRed,
	high: COLORS.red,
	medium: COLORS.yellow,
	low: COLORS.blue,
};

export const SEVERITY_ICONS: Record<Severity, string> = {
	critical: "🔴",
	high: "🟠",
	medium: "🟡",
	low: "🔵",
};

export function colorize(text: string, color: string): string {
	return `${color}${text}${COLORS.reset}`;
}

export function bold(text: string): string {
	return colorize(text, COLORS.bold);
}

export function dim(text: string): string {
	return colorize(text, COLORS.dim);
}
