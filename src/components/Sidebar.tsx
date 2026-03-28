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
  const onDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('application/skillforge-block', blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-60 shrink-0 bg-forge-surface border-r border-forge-border flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-forge-border">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span>⚒️</span> SkillForge
        </h1>
        <p className="text-xs text-forge-muted mt-1">Drag blocks onto the canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {CATEGORIES.map((cat) => {
          const blocks = SKILL_BLOCKS.filter((b) => b.category === cat.key);
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
                  >
                    <span>{block.icon}</span>
                    <span className="text-sm">{block.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
