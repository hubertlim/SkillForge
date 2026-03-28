import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useForgeStore } from '../store';
import SkillNode from './SkillNode';
import { SKILL_BLOCKS } from '../lib/skillBlocks';
import type { SkillNodeData } from '../types';

const nodeTypes = { skill: SkillNode };

let nodeId = 0;
const nextId = () => `skill-${++nodeId}`;

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } =
    useForgeStore();
  const rfRef = useRef<ReactFlowInstance | null>(null);

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
    <div className="flex-1 h-full">
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
