import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

const STORAGE_KEY = 'skillforge-state';
const MAX_STORAGE_SIZE = 5_000_000; // 5MB safety limit

interface PersistedState {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  skillName: string;
  skillDescription: string;
}

export function saveState(state: PersistedState) {
  try {
    const json = JSON.stringify(state);
    if (json.length > MAX_STORAGE_SIZE) {
      console.warn('SkillForge: State too large to persist, skipping save.');
      return;
    }
    localStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.warn('SkillForge: localStorage quota exceeded.');
    }
  }
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.nodes)) return null;
    if (!Array.isArray(parsed.edges)) return null;
    if (typeof parsed.skillName !== 'string') return null;
    if (typeof parsed.skillDescription !== 'string') return null;

    return parsed as PersistedState;
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
