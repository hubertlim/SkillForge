import { useEffect, useRef, useState, useCallback } from 'react';
import { useForgeStore } from '../../store';
import { CheckCircle, Circle, X, ChevronRight, PartyPopper } from 'lucide-react';
import { showToast } from '../ui/Toast';

interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  hint: string;
}

const STEPS: TutorialStep[] = [
  {
    id: 'drag',
    title: 'Drag a block onto the canvas',
    instruction: 'Pick any block from the left sidebar and drag it onto the canvas.',
    hint: 'Try dragging the "Plan" block from the Planning category.',
  },
  {
    id: 'second',
    title: 'Add a second block',
    instruction: 'Drag another block onto the canvas below the first one.',
    hint: 'Try adding an "Implement" block below your first block.',
  },
  {
    id: 'connect',
    title: 'Connect the two blocks',
    instruction: 'Drag from the bottom handle of the first block to the top handle of the second.',
    hint: 'Hover over the small circle at the bottom of a block, then drag to the top circle of another.',
  },
  {
    id: 'select',
    title: 'Select a block to edit it',
    instruction: 'Click on any block to select it. The right panel will show its properties.',
    hint: 'Click directly on a block — you\'ll see its label, description, and instructions on the right.',
  },
  {
    id: 'third',
    title: 'Build a 3-step workflow',
    instruction: 'Add one more block and connect it to complete a 3-step chain.',
    hint: 'Drag a "Code Review" block and connect it after your second block.',
  },
];

function checkStep(stepId: string, nodeCount: number, edgeCount: number, hasSelection: boolean): boolean {
  switch (stepId) {
    case 'drag': return nodeCount >= 1;
    case 'second': return nodeCount >= 2;
    case 'connect': return edgeCount >= 1;
    case 'select': return hasSelection;
    case 'third': return nodeCount >= 3 && edgeCount >= 2;
    default: return false;
  }
}

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

export default function InteractiveTutorial({ onClose, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSet, setCompletedSet] = useState<boolean[]>(() => STEPS.map(() => false));
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to store changes directly
  const nodeCount = useForgeStore((s) => s.nodes.length);
  const edgeCount = useForgeStore((s) => s.edges.length);
  const hasSelection = useForgeStore((s) => s.selectedNodeId !== null);

  const advance = useCallback(() => {
    setCompletedSet((prev) => {
      const next = [...prev];
      next[currentStep] = true;
      return next;
    });
    setShowHint(false);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setFinished(true);
    }
  }, [currentStep]);

  // Check current step completion
  useEffect(() => {
    if (finished) return;
    if (completedSet[currentStep]) return;

    const step = STEPS[currentStep];
    const isComplete = checkStep(step.id, nodeCount, edgeCount, hasSelection);

    if (isComplete) {
      // Clear any pending timer
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, 400);
    }

    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [nodeCount, edgeCount, hasSelection, currentStep, finished, completedSet, advance]);

  const completedCount = completedSet.filter(Boolean).length;

  if (finished) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] animate-slide-up">
        <div className="bg-forge-surface border border-forge-accent/50 rounded-2xl shadow-2xl px-6 py-5 w-[400px] text-center">
          <PartyPopper size={32} className="text-forge-accent mx-auto mb-3" />
          <h3 className="font-bold text-base mb-1">Tutorial complete</h3>
          <p className="text-xs text-forge-muted leading-relaxed mb-4">
            You've mastered the basics. Try exporting your workflow, loading a preset, or exploring the community gallery.
          </p>
          <button
            onClick={() => { onComplete(); showToast('Tutorial completed'); }}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
          >
            Start building
          </button>
        </div>
      </div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] animate-slide-up">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[480px]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-forge-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-forge-accent">Tutorial</span>
            <span className="text-[10px] text-forge-muted">{completedCount}/{STEPS.length} tasks</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors" aria-label="Close tutorial">
            <X size={13} />
          </button>
        </div>

        <div className="h-0.5 bg-forge-bg">
          <div className="h-full bg-forge-accent transition-all duration-500" style={{ width: `${(completedCount / STEPS.length) * 100}%` }} />
        </div>

        <div className="px-4 py-3">
          <div className="space-y-1.5 mb-3">
            {STEPS.map((s, i) => {
              const done = completedSet[i];
              const active = i === currentStep;
              return (
                <div key={s.id} className={`flex items-center gap-2 text-xs ${active ? 'text-forge-text' : done ? 'text-emerald-400' : 'text-forge-muted/50'}`}>
                  {done ? (
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={14} className={`shrink-0 ${active ? 'text-forge-accent' : ''}`} />
                  )}
                  <span className={done ? 'line-through opacity-60' : ''}>{s.title}</span>
                  {active && !done && <ChevronRight size={12} className="text-forge-accent" />}
                </div>
              );
            })}
          </div>

          <div className="bg-forge-bg rounded-lg px-3 py-2.5 border border-forge-border">
            <p className="text-xs text-forge-text leading-relaxed">{step.instruction}</p>
            {showHint ? (
              <p className="text-[11px] text-forge-accent mt-1.5 leading-relaxed">{step.hint}</p>
            ) : (
              <button onClick={() => setShowHint(true)} className="text-[11px] text-forge-muted hover:text-forge-accent mt-1.5 transition-colors">
                Need a hint?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
