import type { Idea } from '../types/idea'

export function buildImplementPrompt(idea: Idea, project: string, topic: string): string {
  const fc = idea.fileChanges.map((f, i) => `${i + 1}. [${f.action}] ${f.path} — ${f.note}`).join('\n')
  const feats = idea.features.map((f) => `- ${f}`).join('\n')
  const tests = idea.testCases.map((t) => `- ${t}`).join('\n')
  return `Implement this feature in ${project} (${topic}):

#${idea.no} ${idea.title}
kind: ${idea.kind} · category: ${idea.category} · phase: ${idea.phase}
impact: ${idea.impact} · effort: ${idea.effort} · mvpScore: ${idea.mvpScore}/10

## Description
${idea.description}

## Why
${idea.why}

## Usage
${idea.usage}

## Features
${feats}

## File changes
${fc}

## Risk
${idea.risk}

## Test cases
${tests}

Constraints: follow the project conventions (AGENTS.md), keep changes minimal, verify with typecheck + build.`
}

export function buildRegenPrompt(idea: Idea, project: string, topic: string): string {
  return `Regenerate idea #${idea.no} "${idea.title}" for ${project} (${topic}).
Keep slot no=${idea.no} and kind="${idea.kind}", but propose a DIFFERENT feature for category "${idea.category}" with equal-or-higher impact.
Output the complete idea object matching the zod schema in src/types/idea.ts (all fields: no, title, kind, category, tags, phase, impact, effort, risk, mvpScore, features, description, why, usage, ansi, fileChanges, testCases).`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}
