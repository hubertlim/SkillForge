import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

const STORAGE_KEY = 'skillforge-state';

interface PersistedState {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  skillName: string;
  skillDescription: string;
}

export function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.nodes)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
