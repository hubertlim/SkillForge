import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useForgeStore } from '../../store';
import SkillNode from './SkillNode';
import LabeledEdge from './LabeledEdge';
import EmptyState from './EmptyState';
import NodeContextMenu from './NodeContextMenu';
import EdgeContextMenu from './EdgeContextMenu';
import MultiSelectToolbar from './MultiSelectToolbar';
import ZoomIndicator from './ZoomIndicator';
import { SKILL_BLOCKS } from '../../lib/skillBlocks';
import { CATEGORY_COLORS, type SkillNodeData, type SkillCategory } from '../../types';

const nodeTypes = { skill: SkillNode };
const edgeTypes = { labeled: LabeledEdge };

let nodeId = Date.now();
const nextId = () => `skill-${++nodeId}`;

const AUTO_CONNECT_DISTANCE = 120;

interface Props {
  onOpenPresets: () => void;
  onOpenImport: () => void;
}

export default function Canvas({ onOpenPresets, onOpenImport }: Props) {
  const store = useForgeStore();
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, selectNode, deleteNode, deleteSelectedNodes, selectAllNodes,
    selectedNodeId, undo, redo, setShowExport, setFitViewFn,
  } = store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfRef = useRef<any>(null);
  const [contextMenu, setContextMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);
  const [edgeMenu, setEdgeMenu] = useState<{ edgeId: string; sourceLabel: string; targetLabel: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      // Delete: remove selected nodes (single or multi)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const multiSelected = nodes.filter((n) => n.selected);
        if (multiSelected.length > 1) {
          deleteSelectedNodes();
        } else if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }
      // Ctrl+A: select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAllNodes();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (nodes.length > 0) setShowExport(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, deleteNode, deleteSelectedNodes, selectAllNodes, undo, redo, setShowExport, nodes]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const blockId = e.dataTransfer.getData('application/skillforge-block');
      const template = SKILL_BLOCKS.find((b) => b.id === blockId);
      if (!template || !rfRef.current) return;

      const position = rfRef.current.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      position.x = Math.round(position.x / 20) * 20;
      position.y = Math.round(position.y / 20) * 20;

      const newId = nextId();
      const newNode = {
        id: newId,
        type: 'skill' as const,
        position,
        data: {
          label: template.label,
          category: template.category,
          description: template.description,
          icon: template.icon,
          instructions: template.defaultInstructions,
        } satisfies SkillNodeData,
      };

      addNode(newNode);

      const currentNodes = store.nodes;
      const currentEdges = store.edges;
      let closestAbove: { id: string; dist: number } | null = null;

      for (const n of currentNodes) {
        const dy = position.y - n.position.y;
        const dx = Math.abs(position.x - n.position.x);
        if (dy > 20 && dy < AUTO_CONNECT_DISTANCE * 2 && dx < AUTO_CONNECT_DISTANCE) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (!closestAbove || dist < closestAbove.dist) {
            closestAbove = { id: n.id, dist };
          }
        }
      }

      if (closestAbove) {
        const alreadyConnected = currentEdges.some(
          (edge) => edge.source === closestAbove!.id && edge.target === newId,
        );
        if (!alreadyConnected) {
          const newEdges = addEdge(
            { id: `auto-${Date.now()}`, source: closestAbove.id, target: newId, animated: true },
            currentEdges,
          );
          useForgeStore.setState({ edges: newEdges });
        }
      }
    },
    [addNode, store],
  );

  const minimapNodeColor = useCallback((node: { data: Record<string, unknown> }) => {
    const cat = (node.data as SkillNodeData).category as SkillCategory;
    return CATEGORY_COLORS[cat] ?? '#7c5cfc';
  }, []);

  const styledEdges = edges.map((e) => ({ ...e, type: 'labeled' as const }));

  return (
    <div className="flex-1 h-full relative">
      {nodes.length === 0 && (
        <EmptyState onOpenPresets={onOpenPresets} onOpenImport={onOpenImport} />
      )}
      <MultiSelectToolbar />
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          rfRef.current = instance;
          setFitViewFn(() => instance.fitView({ padding: 0.2, duration: 300 }));
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={() => { selectNode(null); setContextMenu(null); setEdgeMenu(null); }}
        onNodeContextMenu={(e, node) => {
          e.preventDefault();
          setEdgeMenu(null);
          setContextMenu({ nodeId: node.id, x: e.clientX, y: e.clientY });
        }}
        onEdgeContextMenu={(e, edge) => {
          e.preventDefault();
          setContextMenu(null);
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          setEdgeMenu({
            edgeId: edge.id,
            sourceLabel: sourceNode ? `${sourceNode.data.icon} ${sourceNode.data.label}` : edge.source,
            targetLabel: targetNode ? `${targetNode.data.icon} ${targetNode.data.label}` : edge.target,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnDrag={[1, 2]}
        snapToGrid
        snapGrid={[20, 20]}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ animated: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a3a" />
        <Controls />
        <MiniMap nodeColor={minimapNodeColor} maskColor="rgba(0,0,0,0.6)" />
        <ZoomIndicator />
      </ReactFlow>
      {contextMenu && (
        <NodeContextMenu
          nodeId={contextMenu.nodeId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
      {edgeMenu && (
        <EdgeContextMenu
          edgeId={edgeMenu.edgeId}
          sourceLabel={edgeMenu.sourceLabel}
          targetLabel={edgeMenu.targetLabel}
          x={edgeMenu.x}
          y={edgeMenu.y}
          onClose={() => setEdgeMenu(null)}
        />
      )}
    </div>
  );
}
