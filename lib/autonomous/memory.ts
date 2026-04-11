import { promises as fs } from 'fs';
import path from 'path';
import type { PropertyKnowledge } from './types';

const PROPERTY_LOG_PATH = path.join(process.cwd(), 'PROPERTY_LOG.md');

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function toMarkdown(entries: PropertyKnowledge[]) {
  const rows = entries
    .map(
      (entry) =>
        `| ${entry.question.replace(/\|/g, '\\|')} | ${entry.answer.replace(/\|/g, '\\|')} | ${entry.updatedAt} |`
    )
    .join('\n');

  return `# PROPERTY_LOG\n\nAutoDream memory store for host-approved answers.\n\n| Question | Answer | Updated |
| --- | --- | --- |
${rows || '| _No entries yet_ | _Pending host answers_ | - |'}\n`;
}

function parseMarkdown(content: string): PropertyKnowledge[] {
  const lines = content.split('\n').filter((line) => line.startsWith('| '));
  return lines
    .slice(1)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 5 && parts[1] && parts[2] && parts[3] && !parts[1].startsWith('_'))
    .map((parts) => ({
      question: parts[1].replace(/\\\|/g, '|'),
      answer: parts[2].replace(/\\\|/g, '|'),
      updatedAt: parts[3],
      source: 'host' as const
    }));
}

export async function ensurePropertyLog() {
  try {
    await fs.access(PROPERTY_LOG_PATH);
  } catch {
    await fs.writeFile(PROPERTY_LOG_PATH, toMarkdown([]), 'utf8');
  }
}

export async function getKnowledge(): Promise<PropertyKnowledge[]> {
  await ensurePropertyLog();
  const content = await fs.readFile(PROPERTY_LOG_PATH, 'utf8');
  return parseMarkdown(content);
}

export async function findAnswer(question: string): Promise<string | undefined> {
  const target = normalize(question);
  const knowledge = await getKnowledge();
  return knowledge.find((entry) => normalize(entry.question) === target)?.answer;
}

export async function digestHostAnswer(question: string, answer: string) {
  const knowledge = await getKnowledge();
  const target = normalize(question);
  const existing = knowledge.find((entry) => normalize(entry.question) === target);
  const updatedAt = new Date().toISOString();

  if (existing) {
    existing.answer = answer;
    existing.updatedAt = updatedAt;
  } else {
    knowledge.push({ question, answer, source: 'host', updatedAt });
  }

  await fs.writeFile(PROPERTY_LOG_PATH, toMarkdown(knowledge), 'utf8');
}
