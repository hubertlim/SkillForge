import { useState } from 'react';
import { Search, PanelLeftClose, PanelLeftOpen, Star, Github } from 'lucide-react';
import { SKILL_BLOCKS } from '../../lib/skillBlocks';
import { CATEGORY_COLORS, type SkillCategory } from '../../types';

const REPO_URL = 'https://github.com/hubertlim/SkillForge';

const CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: 'planning', label: 'Planning' },
  { key: 'coding', label: 'Coding' },
  { key: 'testing', label: 'Testing' },
  { key: 'review', label: 'Review' },
  { key: 'utility', label: 'Utility' },
  { key: 'custom', label: 'Custom' },
];

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const onDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('application/skillforge-block', blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const filtered = search.trim()
    ? SKILL_BLOCKS.filter(
        (b) =>
          b.label.toLowerCase().includes(search.toLowerCase()) ||
          b.description.toLowerCase().includes(search.toLowerCase()),
      )
    : SKILL_BLOCKS;

  if (collapsed) {
    return (
      <aside className="w-10 shrink-0 bg-forge-surface border-r border-forge-border flex flex-col items-center py-3 justify-between">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen size={16} />
        </button>
        <a href={REPO_URL} target="_blank" rel="noopener" className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-accent transition-colors" title="GitHub">
          <Github size={14} />
        </a>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 bg-forge-surface border-r border-forge-border flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-forge-border flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span>&#x2692;&#xFE0F;</span> SkillForge
          </h1>
          <p className="text-xs text-forge-muted mt-1">Drag blocks onto the canvas</p>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={14} />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-forge-border">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-forge-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full bg-forge-bg border border-forge-border rounded-lg pl-8 pr-3 py-1.5 text-xs
                       focus:outline-none focus:border-forge-accent placeholder:text-forge-muted/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {CATEGORIES.map((cat) => {
          const blocks = filtered.filter((b) => b.category === cat.key);
          if (!blocks.length) return null;
          return (
            <div key={cat.key}>
              <h2
                className="text-[10px] uppercase tracking-widest font-semibold mb-2 px-1"
                style={{ color: CATEGORY_COLORS[cat.key] }}
              >
                {cat.label}
              </h2>
              <div className="space-y-1.5">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, block.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
                               bg-forge-bg border border-forge-border hover:border-forge-accent transition-colors"
                    title={block.description}
                  >
                    <span>{block.icon}</span>
                    <span className="text-sm">{block.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-forge-muted text-center py-4">No blocks match "{search}"</p>
        )}
      </div>

      {/* Footer with GitHub CTA */}
      <div className="px-3 py-2.5 border-t border-forge-border space-y-1.5">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                     bg-forge-bg border border-forge-border hover:border-amber-500/50
                     text-forge-muted hover:text-amber-400 transition-colors w-full"
        >
          <Star size={13} className="shrink-0" />
          <span>Star on GitHub</span>
        </a>
        <div className="flex gap-1.5">
          <a
            href={`${REPO_URL}/issues/new?template=bug_report.yml`}
            target="_blank"
            rel="noopener"
            className="flex-1 text-center px-2 py-1.5 rounded-lg text-[10px] text-forge-muted hover:text-forge-text
                       bg-forge-bg border border-forge-border hover:border-forge-accent/50 transition-colors"
          >
            Report bug
          </a>
          <a
            href={`${REPO_URL}/issues/new?template=feature_request.yml`}
            target="_blank"
            rel="noopener"
            className="flex-1 text-center px-2 py-1.5 rounded-lg text-[10px] text-forge-muted hover:text-forge-text
                       bg-forge-bg border border-forge-border hover:border-forge-accent/50 transition-colors"
          >
            Request feature
          </a>
        </div>
      </div>
    </aside>
  );
}
