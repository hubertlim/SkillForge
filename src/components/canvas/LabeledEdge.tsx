import { useState, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { useForgeStore } from '../../store';

export default function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState((label as string) ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const edges = useForgeStore((s) => s.edges);

  // Sync from store
  useEffect(() => {
    const edge = edges.find((e) => e.id === id);
    setText((edge?.label as string) ?? '');
  }, [edges, id]);

  const save = () => {
    setEditing(false);
    const { edges: currentEdges } = useForgeStore.getState();
    useForgeStore.setState({
      edges: currentEdges.map((e) =>
        e.id === id ? { ...e, label: text.trim() || undefined } : e,
      ),
    });
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {editing ? (
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') { setText((label as string) ?? ''); setEditing(false); }
              }}
              placeholder="label..."
              className="bg-forge-surface border border-forge-accent rounded px-2 py-0.5 text-[10px] text-forge-text
                         focus:outline-none w-24 text-center"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded px-1.5 py-0.5 text-[10px] transition-colors hover:bg-forge-surface/80"
              style={{
                color: text ? '#e2e2f0' : '#8888a060',
                background: text ? '#1a1a24cc' : 'transparent',
                border: text ? '1px solid #2a2a3a' : '1px solid transparent',
              }}
              title="Click to add edge label"
            >
              {text || '+'}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
