import { GraduationCap, BookText, X } from 'lucide-react';

interface Props {
  onStartTutorial: () => void;
  onOpenDocs: () => void;
  onSkip: () => void;
}

export default function WelcomeScreen({ onStartTutorial, onOpenDocs, onSkip }: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[520px] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-forge-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x2692;&#xFE0F;</span>
            <div>
              <h1 className="font-bold text-base">Welcome to SkillForge</h1>
              <p className="text-xs text-forge-muted mt-0.5">Visual builder for AI agent skills</p>
            </div>
          </div>
          <button onClick={onSkip} className="p-1.5 rounded hover:bg-forge-border transition-colors text-forge-muted" aria-label="Skip">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-forge-muted leading-relaxed mb-5">
            SkillForge lets you build AI agent skill workflows visually. Drag blocks, wire them together, and export to SKILL.md, Kiro steering, or JSON.
          </p>
          <p className="text-xs text-forge-muted mb-4">How would you like to get started?</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onStartTutorial}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-forge-border
                         hover:border-forge-accent hover:bg-forge-accent/5 transition-all group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-forge-accent/10 flex items-center justify-center group-hover:bg-forge-accent/20 transition-colors">
                <GraduationCap size={24} className="text-forge-accent" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">Interactive Tutorial</div>
                <p className="text-[11px] text-forge-muted leading-snug">
                  Learn by doing. Complete 5 simple tasks to master the basics.
                </p>
              </div>
              <span className="text-[10px] text-forge-accent font-medium">~2 minutes</span>
            </button>

            <button
              onClick={onOpenDocs}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-forge-border
                         hover:border-forge-accent hover:bg-forge-accent/5 transition-all group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-forge-accent/10 flex items-center justify-center group-hover:bg-forge-accent/20 transition-colors">
                <BookText size={24} className="text-forge-accent" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">Read Documentation</div>
                <p className="text-[11px] text-forge-muted leading-snug">
                  Browse all features and capabilities at your own pace.
                </p>
              </div>
              <span className="text-[10px] text-forge-accent font-medium">Reference guide</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-forge-border">
          <button onClick={onSkip} className="text-xs text-forge-muted hover:text-forge-text transition-colors">
            Skip for now — I'll explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
