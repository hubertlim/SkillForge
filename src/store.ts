import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type { SkillNodeData } from './types';
import { saveState, loadState, clearState } from './lib/persistence';

const persisted = loadState();

/** Check if adding an edge from source to target would create a cycle */
function wouldCreateCycle(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  source: string,
  target: string,
): boolean {
  // BFS from target — if we can reach source, adding source->target creates a cycle
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) adj.get(e.source)?.push(e.target);

  const visited = new Set<string>();
  const queue = [target];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === source) return true;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const next of adj.get(cur) ?? []) queue.push(next);
  }
  return false;
}

interface ForgeState {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  skillName: string;
  skillDescription: string;
  showExport: boolean;

  // History for undo/redo
  history: { nodes: Node<SkillNodeData>[]; edges: Edge[] }[];
  historyIndex: number;
  redoStack: { nodes: Node<SkillNodeData>[]; edges: Edge[] }[];

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<SkillNodeData>) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<SkillNodeData>) => void;
  setSkillName: (name: string) => void;
  setSkillDescription: (desc: string) => void;
  setShowExport: (show: boolean) => void;
  deleteNode: (id: string) => void;
  loadWorkflow: (
    nodes: Node<SkillNodeData>[],
    edges: Edge[],
    skillName: string,
    skillDescription: string,
  ) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  duplicateNode: (id: string) => void;
  autoLayout: () => void;
  setFitViewFn: (fn: (() => void) | null) => void;
  fitView: () => void;
  _fitViewFn: (() => void) | null;
  getSelectedNodeIds: () => string[];
  deleteSelectedNodes: () => void;
  duplicateSelectedNodes: () => void;
  selectAllNodes: () => void;
}

export const useForgeStore = create<ForgeState>((set, get) => ({
  nodes: persisted?.nodes ?? [],
  edges: persisted?.edges ?? [],
  selectedNodeId: null,
  skillName: persisted?.skillName ?? 'my-skill',
  skillDescription: persisted?.skillDescription ?? 'Describe when this skill should activate',
  showExport: false,
  history: [],
  historyIndex: -1,
  redoStack: [],

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<SkillNodeData>[] }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) return;
    // Prevent duplicate edges
    const exists = get().edges.some(
      (e) => e.source === connection.source && e.target === connection.target,
    );
    if (exists) return;
    // Prevent cycles
    if (wouldCreateCycle(get().nodes, get().edges, connection.source!, connection.target!)) return;

    get().pushHistory();
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },

  addNode: (node) => {
    get().pushHistory();
    set({ nodes: [...get().nodes, node] });
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, partial) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...partial } } : n,
      ),
    }),

  setSkillName: (skillName) => set({ skillName }),
  setSkillDescription: (skillDescription) => set({ skillDescription }),
  setShowExport: (showExport) => set({ showExport }),

  deleteNode: (id) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  loadWorkflow: (nodes, edges, skillName, skillDescription) => {
    get().pushHistory();
    set({ nodes, edges, skillName, skillDescription, selectedNodeId: null });
  },

  pushHistory: () => {
    const { nodes, edges, history } = get();
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const newHistory = [...history, snapshot];
    if (newHistory.length > 30) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1, redoStack: [] });
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const currentSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      history: history.slice(0, -1),
      redoStack: [...get().redoStack, currentSnapshot],
    });
  },

  redo: () => {
    const { redoStack, nodes, edges, history } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const currentSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      nodes: next.nodes,
      edges: next.edges,
      history: [...history, currentSnapshot],
      redoStack: redoStack.slice(0, -1),
    });
  },

  clearCanvas: () => {
    get().pushHistory();
    clearState();
    set({ nodes: [], edges: [], selectedNodeId: null });
  },

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    get().pushHistory();
    const newId = `skill-${Date.now()}`;
    const newNode: Node<SkillNodeData> = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
      data: { ...node.data },
    };
    set({ nodes: [...get().nodes, newNode], selectedNodeId: newId });
  },

  autoLayout: () => {
    const { nodes, edges } = get();
    if (nodes.length === 0) return;
    get().pushHistory();

    // Topological sort
    const adj = new Map<string, string[]>();
    const inDeg = new Map<string, number>();
    for (const n of nodes) {
      adj.set(n.id, []);
      inDeg.set(n.id, 0);
    }
    for (const e of edges) {
      adj.get(e.source)?.push(e.target);
      inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
    }
    const queue = nodes.filter((n) => (inDeg.get(n.id) ?? 0) === 0).map((n) => n.id);
    const sorted: string[] = [];
    while (queue.length) {
      const cur = queue.shift()!;
      sorted.push(cur);
      for (const next of adj.get(cur) ?? []) {
        const deg = (inDeg.get(next) ?? 1) - 1;
        inDeg.set(next, deg);
        if (deg === 0) queue.push(next);
      }
    }
    // Add any remaining (disconnected) nodes
    for (const n of nodes) {
      if (!sorted.includes(n.id)) sorted.push(n.id);
    }

    const X = 300;
    const Y_START = 60;
    const GAP = 140;
    const updated = nodes.map((n) => {
      const idx = sorted.indexOf(n.id);
      return { ...n, position: { x: X, y: Y_START + idx * GAP } };
    });
    set({ nodes: updated });
  },

  _fitViewFn: null,
  setFitViewFn: (fn) => set({ _fitViewFn: fn } as Partial<ForgeState>),
  fitView: () => {
    const fn = (get() as ForgeState & { _fitViewFn: (() => void) | null })._fitViewFn;
    fn?.();
  },

  getSelectedNodeIds: () => get().nodes.filter((n) => n.selected).map((n) => n.id),

  deleteSelectedNodes: () => {
    const ids = get().nodes.filter((n) => n.selected).map((n) => n.id);
    if (ids.length === 0) return;
    get().pushHistory();
    const idSet = new Set(ids);
    set({
      nodes: get().nodes.filter((n) => !idSet.has(n.id)),
      edges: get().edges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target)),
      selectedNodeId: null,
    });
  },

  duplicateSelectedNodes: () => {
    const selected = get().nodes.filter((n) => n.selected);
    if (selected.length === 0) return;
    get().pushHistory();
    const newNodes = selected.map((n) => ({
      ...n,
      id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      position: { x: n.position.x + 40, y: n.position.y + 40 },
      selected: false,
      data: { ...n.data },
    }));
    set({ nodes: [...get().nodes, ...newNodes] });
  },

  selectAllNodes: () => {
    set({
      nodes: get().nodes.map((n) => ({ ...n, selected: true })),
    });
  },
}));

// Auto-persist to localStorage on every state change
useForgeStore.subscribe((state) => {
  saveState({
    nodes: state.nodes,
    edges: state.edges,
    skillName: state.skillName,
    skillDescription: state.skillDescription,
  });
});
