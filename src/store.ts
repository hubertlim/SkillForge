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

interface ForgeState {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  skillName: string;
  skillDescription: string;
  showExport: boolean;

  // History for undo
  history: { nodes: Node<SkillNodeData>[]; edges: Edge[] }[];
  historyIndex: number;

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
  clearCanvas: () => void;
}

export const useForgeStore = create<ForgeState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  skillName: 'my-skill',
  skillDescription: 'Describe when this skill should activate',
  showExport: false,
  history: [],
  historyIndex: -1,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<SkillNodeData>[] }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
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
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    // Keep max 30 history entries
    if (newHistory.length > 30) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < 0) return;
    const entry = history[historyIndex];
    set({
      nodes: entry.nodes,
      edges: entry.edges,
      historyIndex: historyIndex - 1,
    });
  },

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
}));
