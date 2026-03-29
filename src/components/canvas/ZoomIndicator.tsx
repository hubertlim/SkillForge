import { useViewport } from '@xyflow/react';

export default function ZoomIndicator() {
  const { zoom } = useViewport();
  const pct = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-3 left-14 z-10 px-2 py-1 rounded bg-forge-surface/80 border border-forge-border text-[10px] text-forge-muted font-mono pointer-events-none">
      {pct}%
    </div>
  );
}
