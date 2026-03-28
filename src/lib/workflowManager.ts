import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

const WORKFLOWS_KEY = 'skillforge-workflows';

export interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  updatedAt: number;
}

export function listWorkflows(): SavedWorkflow[] {
  try {
    const raw = localStorage.getItem(WORKFLOWS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedWorkflow[];
  } catch {
    return [];
  }
}

export function saveWorkflow(workflow: SavedWorkflow) {
  const all = listWorkflows();
  const idx = all.findIndex((w) => w.id === workflow.id);
  if (idx >= 0) {
    all[idx] = workflow;
  } else {
    all.push(workflow);
  }
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
}

export function deleteWorkflow(id: string) {
  const all = listWorkflows().filter((w) => w.id !== id);
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
}

export function generateId(): string {
  return `wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
