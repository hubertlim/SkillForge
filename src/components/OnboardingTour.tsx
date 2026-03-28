import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

const TOUR_KEY = 'skillforge-tour-seen';

const STEPS = [
  {
    title: 'Welcome to SkillForge',
    body: 'Build AI agent skill workflows visually. Drag blocks, wire them together, and export to SKILL.md, Kiro steering, or JSON.',
  },
  {
    title: 'Drag blocks from the sidebar',
    body: 'The left panel has 15 blocks across 6 categories: Planning, Coding, Testing, Review, Utility, and Custom. Drag any block onto the canvas.',
  },
  {
    title: 'Connect and edit',
    body: 'Drag from a bottom handle to a top handle to connect blocks. Click any block to edit its label, description, and instructions in the right panel.',
  },
  {
    title: 'Export and share',
    body: 'Hit Export to download your workflow as SKILL.md, Kiro steering, or JSON. Click Share to copy a URL anyone can open. Use the camera icon for a PNG screenshot.',
  },
  {
    title: 'You\'re all set',
    body: 'Press ? anytime for keyboard shortcuts. Right-click nodes for quick actions. Check out the Gallery for community skills. Happy building!',
  },
];

export function shouldShowTour(): boolean {
  try {
    return !localStorage.getItem(TOUR_KEY);
  } catch {
    return false;
  }
}

export function dismissTour() {
  try {
    localStorage.setItem(TOUR_KEY, '1');
  } catch {
    // ignore
  }
}

interface Props {
  onClose: () => void;
}

export default function OnboardingTour({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      dismissTour();
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    dismissTour();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[440px] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">&#x2692;&#xFE0F;</span>
            <h2 className="font-bold text-sm">{current.title}</h2>
          </div>
          <button onClick={handleSkip} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Skip tour">
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm text-forge-muted leading-relaxed">{current.body}</p>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-forge-border">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i === step ? '#7c5cfc' : '#2a2a3a' }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isLast && (
              <button onClick={handleSkip} className="px-3 py-1.5 rounded-lg text-xs text-forge-muted hover:text-forge-text transition-colors">
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
            >
              {isLast ? 'Get started' : 'Next'}
              {!isLast && <ChevronRight size={12} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
