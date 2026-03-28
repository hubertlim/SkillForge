import { useEffect, useState } from 'react';
import { useForgeStore } from '../store';
import { CheckCircle, Circle, X, ChevronRight, PartyPopper } from 'lucide-react';
import { showToast } from './Toast';

interface TutorialTask {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  check: () => boolean;
}

function useTutorialTasks(): TutorialTask[] {
  const { nodes, edges, selectedNodeId } = useForgeStore();

  return [
    {
      id: 'drag',
      title: 'Drag a block onto the canvas',
      instruction: 'Pick any block from the left sidebar and drag it onto the canvas.',
      hint: 'Try dragging the "Plan" block from the Planning category.',
      check: () => nodes.length >= 1,
    },
    {
      id: 'second',
      title: 'Add a second block',
      instruction: 'Drag another block onto the canvas below the first one.',
      hint: 'Try adding an "Implement" block below your first block.',
      check: () => nodes.length >= 2,
    },
    {
      id: 'connect',
      title: 'Connect the two blocks',
      instruction: 'Drag from the bottom handle of the first block to the top handle of the second.',
      hint: 'Hover over the small circle at the bottom of a block, then drag to the top circle of another.',
      check: () => edges.length >= 1,
    },
    {
      id: 'select',
      title: 'Select a block to edit it',
      instruction: 'Click on any block to select it. The right panel will show its properties.',
      hint: 'Click directly on a block — you\'ll see its label, description, and instructions on the right.',
      check: () => selectedNodeId !== null,
    },
    {
      id: 'third',
      title: 'Build a 3-step workflow',
      instruction: 'Add one more block and connect it to complete a 3-step chain.',
      hint: 'Drag a "Code Review" block and connect it after your second block.',
      check: () => nodes.length >= 3 && edges.length >= 2,
    },
  ];
}

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

export default function InteractiveTutorial({ onClose, onComplete }: Props) {
  const tasks = useTutorialTasks();
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const task = tasks[currentTask];
  const isComplete = task ? task.check() : false;

  // Auto-advance when task is completed
  useEffect(() => {
    if (!task || !isComplete || completedTasks.has(task.id)) return;

    const newCompleted = new Set(completedTasks);
    newCompleted.add(task.id);
    setCompletedTasks(newCompleted);
    setShowHint(false);

    if (currentTask < tasks.length - 1) {
      // Small delay before advancing to next task
      const timer = setTimeout(() => setCurrentTask(currentTask + 1), 600);
      return () => clearTimeout(timer);
    } else {
      // All tasks done
      const timer = setTimeout(() => setFinished(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete, task, currentTask, completedTasks, tasks]);

  if (finished) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] animate-slide-up">
        <div className="bg-forge-surface border border-forge-accent/50 rounded-2xl shadow-2xl px-6 py-5 w-[400px] text-center">
          <PartyPopper size={32} className="text-forge-accent mx-auto mb-3" />
          <h3 className="font-bold text-base mb-1">Tutorial complete</h3>
          <p className="text-xs text-forge-muted leading-relaxed mb-4">
            You've mastered the basics. Try exporting your workflow, loading a preset, or exploring the community gallery.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => { onComplete(); showToast('Tutorial completed'); }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
            >
              Start building
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] animate-slide-up">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-forge-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-forge-accent">Tutorial</span>
            <span className="text-[10px] text-forge-muted">
              {completedTasks.size}/{tasks.length} tasks
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors" aria-label="Close tutorial">
            <X size={13} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-forge-bg">
          <div
            className="h-full bg-forge-accent transition-all duration-500"
            style={{ width: `${(completedTasks.size / tasks.length) * 100}%` }}
          />
        </div>

        {/* Task list */}
        <div className="px-4 py-3">
          <div className="space-y-1.5 mb-3">
            {tasks.map((t, i) => {
              const done = completedTasks.has(t.id);
              const active = i === currentTask;
              return (
                <div key={t.id} className={`flex items-center gap-2 text-xs ${active ? 'text-forge-text' : done ? 'text-forge-accent' : 'text-forge-muted/50'}`}>
                  {done ? (
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={14} className={`shrink-0 ${active ? 'text-forge-accent' : ''}`} />
                  )}
                  <span className={done ? 'line-through opacity-60' : ''}>{t.title}</span>
                  {active && !done && <ChevronRight size={12} className="text-forge-accent" />}
                </div>
              );
            })}
          </div>

          {/* Current task detail */}
          <div className="bg-forge-bg rounded-lg px-3 py-2.5 border border-forge-border">
            <p className="text-xs text-forge-text leading-relaxed">{task.instruction}</p>
            {showHint ? (
              <p className="text-[11px] text-forge-accent mt-1.5 leading-relaxed">{task.hint}</p>
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
