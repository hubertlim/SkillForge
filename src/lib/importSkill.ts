import type { Node } from '@xyflow/react';
import type { SkillNodeData, SkillCategory } from '../types';

interface ParsedSkill {
  skillName: string;
  skillDescription: string;
  steps: SkillNodeData[];
}

const CATEGORY_KEYWORDS: Record<SkillCategory, string[]> = {
  planning: ['brainstorm', 'plan', 'design', 'architect', 'requirements', 'scope'],
  coding: ['implement', 'code', 'build', 'develop', 'refactor', 'write code'],
  testing: ['test', 'tdd', 'coverage', 'spec', 'assert', 'verify'],
  review: ['review', 'document', 'docs', 'audit', 'check quality'],
  utility: ['debug', 'deploy', 'migrate', 'setup', 'configure', 'monitor'],
  custom: [],
};

const CATEGORY_ICONS: Record<SkillCategory, string> = {
  planning: '📋',
  coding: '⚡',
  testing: '🧪',
  review: '🔍',
  utility: '🔧',
  custom: '⚙️',
};

function guessCategory(label: string, instructions: string): SkillCategory {
  const text = `${label} ${instructions}`.toLowerCase();
  let best: SkillCategory = 'custom';
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [SkillCategory, string[]][]) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

function guessIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('brainstorm')) return '💡';
  if (l.includes('plan')) return '📋';
  if (l.includes('implement') || l.includes('code') || l.includes('build')) return '⚡';
  if (l.includes('refactor')) return '🔧';
  if (l.includes('test')) return '🧪';
  if (l.includes('review')) return '🔍';
  if (l.includes('document') || l.includes('doc')) return '📝';
  if (l.includes('debug')) return '🐛';
  if (l.includes('deploy')) return '🚀';
  return '⚙️';
}

export function parseSkillMd(content: string): ParsedSkill | null {
  try {
    let skillName = 'imported-skill';
    let skillDescription = '';

    // Parse YAML frontmatter
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      const nameMatch = fm.match(/name:\s*"?([^"\n]+)"?/);
      const descMatch = fm.match(/description:\s*"?([^"\n]+)"?/);
      if (nameMatch) skillName = nameMatch[1].trim();
      if (descMatch) skillDescription = descMatch[1].trim();
    }

    // Parse steps (## headings)
    const stepRegex = /^##\s+(.+)$/gm;
    const steps: SkillNodeData[] = [];
    const matches: { index: number; label: string }[] = [];

    let match;
    while ((match = stepRegex.exec(content)) !== null) {
      matches.push({ index: match.index + match[0].length, label: match[1] });
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? content.lastIndexOf('\n##', matches[i + 1].index) : content.length;
      const body = content.slice(start, end).trim();

      // Extract description from blockquote
      const descMatch = body.match(/^>\s*(.+)$/m);
      const description = descMatch ? descMatch[1].trim() : '';

      // Instructions = everything after the blockquote (or the whole body if no blockquote)
      let instructions = body;
      if (descMatch) {
        instructions = body.slice(body.indexOf(descMatch[0]) + descMatch[0].length).trim();
      }

      // Clean label: remove "Step N:" prefix and emoji
      let label = matches[i].label
        .replace(/^Step\s+\d+:\s*/i, '')
        .replace(/^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Component}\s]+/u, '')
        .trim();

      if (!label) label = `Step ${i + 1}`;

      const icon = guessIcon(label);
      const category = guessCategory(label, instructions);

      steps.push({ label, category, description, icon, instructions });
    }

    if (steps.length === 0) return null;

    return { skillName, skillDescription, steps };
  } catch {
    return null;
  }
}

export function parsedSkillToNodes(parsed: ParsedSkill): {
  nodes: Node<SkillNodeData>[];
  edges: { id: string; source: string; target: string; animated: boolean }[];
  skillName: string;
  skillDescription: string;
} {
  const VERTICAL_GAP = 140;
  const START_X = 300;
  const START_Y = 60;

  const nodes: Node<SkillNodeData>[] = parsed.steps.map((step, i) => ({
    id: `imported-${i}`,
    type: 'skill' as const,
    position: { x: START_X, y: START_Y + i * VERTICAL_GAP },
    data: step,
  }));

  const edges = parsed.steps.slice(0, -1).map((_, i) => ({
    id: `ie-${i}`,
    source: `imported-${i}`,
    target: `imported-${i + 1}`,
    animated: true,
  }));

  return { nodes, edges, skillName: parsed.skillName, skillDescription: parsed.skillDescription };
}
