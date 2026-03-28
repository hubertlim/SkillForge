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
}

export const useForgeStore = create<ForgeState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  skillName: 'my-skill',
  skillDescription: 'Describe when this skill should activate',
  showExport: false,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<SkillNodeData>[] }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

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

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    }),
}));
