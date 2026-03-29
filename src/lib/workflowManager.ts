import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

const WORKFLOWS_KEY = 'skillforge-workflows';
const MAX_WORKFLOWS = 50;

export interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  updatedAt: number;
}

function isValidWorkflow(w: unknown): w is SavedWorkflow {
  if (!w || typeof w !== 'object') return false;
  const obj = w as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.nodes) &&
    Array.isArray(obj.edges) &&
    typeof obj.updatedAt === 'number'
  );
}

export function listWorkflows(): SavedWorkflow[] {
  try {
    const raw = localStorage.getItem(WORKFLOWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidWorkflow);
  } catch {
    return [];
  }
}

export function saveWorkflow(workflow: SavedWorkflow) {
  try {
    const all = listWorkflows();
    const idx = all.findIndex((w) => w.id === workflow.id);
    if (idx >= 0) {
      all[idx] = workflow;
    } else {
      if (all.length >= MAX_WORKFLOWS) {
        // Remove oldest
        all.sort((a, b) => a.updatedAt - b.updatedAt);
        all.shift();
      }
      all.push(workflow);
    }
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.warn('SkillForge: localStorage quota exceeded when saving workflow.');
    }
  }
}

export function deleteWorkflow(id: string) {
  try {
    const all = listWorkflows().filter((w) => w.id !== id);
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function generateId(): string {
  return `wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
