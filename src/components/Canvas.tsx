import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
  type Node as RFNode,
  type Edge as RFEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useForgeStore } from '../store';
import SkillNode from './SkillNode';
import EmptyState from './EmptyState';
import { SKILL_BLOCKS } from '../lib/skillBlocks';
import type { SkillNodeData } from '../types';

const nodeTypes = { skill: SkillNode };

let nodeId = Date.now();
const nextId = () => `skill-${++nodeId}`;

interface Props {
  onOpenPresets: () => void;
  onOpenImport: () => void;
}

export default function Canvas({ onOpenPresets, onOpenImport }: Props) {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, selectNode, deleteNode, selectedNodeId, undo, setShowExport,
  } = useForgeStore();
  const rfRef = useRef<ReactFlowInstance<RFNode<SkillNodeData>, RFEdge> | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        deleteNode(selectedNodeId);
      }
      // Ctrl+Z undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Ctrl+S export
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (nodes.length > 0) setShowExport(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, deleteNode, undo, setShowExport, nodes.length]);

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

      const position = rfRef.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode = {
        id: nextId(),
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
    },
    [addNode],
  );

  return (
    <div className="flex-1 h-full relative">
      {nodes.length === 0 && (
        <EmptyState onOpenPresets={onOpenPresets} onOpenImport={onOpenImport} />
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          rfRef.current = instance;
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={() => selectNode(null)}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ animated: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a3a" />
        <Controls />
        <MiniMap
          nodeColor={() => '#7c5cfc'}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  );
}
