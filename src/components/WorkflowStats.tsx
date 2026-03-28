import { useMemo } from 'react';
import { useForgeStore } from '../store';
import { CATEGORY_COLORS, type SkillCategory } from '../types';
import { Blocks, GitFork, Layers } from 'lucide-react';

const CAT_LABELS: Record<SkillCategory, string> = {
  planning: 'Planning',
  coding: 'Coding',
  testing: 'Testing',
  review: 'Review',
  utility: 'Utility',
  custom: 'Custom',
};

export default function WorkflowStats() {
  const { nodes, edges, skillName } = useForgeStore();

  const stats = useMemo(() => {
    const catCounts: Partial<Record<SkillCategory, number>> = {};
    for (const n of nodes) {
      const cat = n.data.category as SkillCategory;
      catCounts[cat] = (catCounts[cat] ?? 0) + 1;
    }

    const connected = new Set<string>();
    for (const e of edges) {
      connected.add(e.source);
      connected.add(e.target);
    }
    const disconnected = nodes.filter((n) => !connected.has(n.id)).length;

    return { catCounts, disconnected };
  }, [nodes, edges]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs text-forge-muted uppercase tracking-wider mb-3">Workflow</h3>
        <p className="text-sm font-medium mb-3">{skillName}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Blocks size={14} className="text-forge-accent" />
            <span className="text-forge-muted">{nodes.length} block{nodes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <GitFork size={14} className="text-forge-accent" />
            <span className="text-forge-muted">{edges.length} connection{edges.length !== 1 ? 's' : ''}</span>
          </div>
          {stats.disconnected > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Layers size={14} className="text-amber-400" />
              <span className="text-amber-400">{stats.disconnected} disconnected</span>
            </div>
          )}
        </div>
      </div>

      {Object.keys(stats.catCounts).length > 0 && (
        <div>
          <h3 className="text-xs text-forge-muted uppercase tracking-wider mb-3">Categories</h3>
          <div className="space-y-1.5">
            {(Object.entries(stats.catCounts) as [SkillCategory, number][]).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
                  <span className="text-xs text-forge-muted">{CAT_LABELS[cat]}</span>
                </div>
                <span className="text-xs font-mono text-forge-text">{count}</span>
              </div>
            ))}
          </div>

          {/* Category bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden mt-3 bg-forge-bg">
            {(Object.entries(stats.catCounts) as [SkillCategory, number][]).map(([cat, count]) => (
              <div
                key={cat}
                style={{
                  background: CATEGORY_COLORS[cat],
                  width: `${(count / nodes.length) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs text-forge-muted uppercase tracking-wider mb-2">Tips</h3>
        <ul className="text-xs text-forge-muted space-y-1.5 leading-relaxed">
          <li>Right-click a node for quick actions</li>
          <li>Press ? for keyboard shortcuts</li>
          <li>Drag between handles to connect</li>
        </ul>
      </div>
    </div>
  );
}
