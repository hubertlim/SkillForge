import { useState } from 'react';
import { Search } from 'lucide-react';
import { SKILL_BLOCKS } from '../lib/skillBlocks';
import { CATEGORY_COLORS, type SkillCategory } from '../types';

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

  return (
    <aside className="w-60 shrink-0 bg-forge-surface border-r border-forge-border flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-forge-border">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span>⚒️</span> SkillForge
        </h1>
        <p className="text-xs text-forge-muted mt-1">Drag blocks onto the canvas</p>
      </div>

      {/* Search */}
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
    </aside>
  );
}
