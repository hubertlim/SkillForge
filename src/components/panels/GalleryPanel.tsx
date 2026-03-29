import { useState } from 'react';
import { X, Search, Download } from 'lucide-react';
import { COMMUNITY_SKILLS } from '../../lib/communitySkills';
import { parseSkillMd, parsedSkillToNodes } from '../../lib/importSkill';
import { useForgeStore } from '../../store';
import { showToast } from '../ui/Toast';

interface Props {
  onClose: () => void;
}

export default function GalleryPanel({ onClose }: Props) {
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const store = useForgeStore();

  const filtered = search.trim()
    ? COMMUNITY_SKILLS.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      )
    : COMMUNITY_SKILLS;

  const handleLoad = (content: string, name: string) => {
    const parsed = parseSkillMd(content);
    if (!parsed) {
      showToast('Failed to parse skill', 'error');
      return;
    }
    const { nodes, edges, skillName, skillDescription } = parsedSkillToNodes(parsed);
    store.loadWorkflow(nodes, edges, skillName, skillDescription);
    showToast(`Loaded "${name}" with ${nodes.length} steps`);
    onClose();
  };

  const previewSkill = COMMUNITY_SKILLS.find((s) => s.id === preview);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Community Skills</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-forge-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills by name, description, or tag..."
              className="w-full bg-forge-bg border border-forge-border rounded-lg pl-9 pr-3 py-2 text-sm
                         focus:outline-none focus:border-forge-accent placeholder:text-forge-muted/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {preview && previewSkill ? (
            <div className="px-5 py-4">
              <button
                onClick={() => setPreview(null)}
                className="text-xs text-forge-accent hover:underline mb-3"
              >
                &larr; Back to list
              </button>
              <h3 className="font-semibold text-sm mb-1">{previewSkill.name}</h3>
              <p className="text-xs text-forge-muted mb-3">{previewSkill.description}</p>
              <pre className="bg-forge-bg border border-forge-border rounded-lg p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-forge-text max-h-[40vh] overflow-y-auto">
                {previewSkill.content}
              </pre>
              <button
                onClick={() => handleLoad(previewSkill.content, previewSkill.name)}
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
              >
                <Download size={14} />
                Load onto canvas
              </button>
            </div>
          ) : (
            <div className="px-5 py-3 space-y-2">
              {filtered.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-forge-border
                             hover:border-forge-accent/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{skill.name}</span>
                      <span className="text-[10px] text-forge-muted">by {skill.author}</span>
                    </div>
                    <p className="text-xs text-forge-muted truncate">{skill.description}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {skill.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-forge-bg border border-forge-border text-forge-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    <button
                      onClick={() => setPreview(skill.id)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-forge-border
                                 hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleLoad(skill.content, skill.name)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-forge-muted text-center py-8">No skills match your search</p>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-forge-border">
          <p className="text-[11px] text-forge-muted text-center">
            Want to add your skill? <a href="https://github.com/hubertlim/SkillForge/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" className="text-forge-accent hover:underline">Submit a PR</a>
          </p>
        </div>
      </div>
    </div>
  );
}
