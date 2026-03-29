import { Monitor } from 'lucide-react';

export default function MobileWarning() {
  return (
    <div className="h-screen w-screen bg-forge-bg flex items-center justify-center p-8 md:hidden">
      <div className="text-center max-w-xs">
        <Monitor size={48} className="text-forge-accent mx-auto mb-4" />
        <h1 className="text-lg font-bold mb-2">Desktop recommended</h1>
        <p className="text-sm text-forge-muted leading-relaxed">
          SkillForge is a visual canvas editor designed for desktop browsers.
          Please open it on a larger screen for the best experience.
        </p>
        <a
          href="https://github.com/hubertlim/SkillForge"
          className="inline-block mt-4 px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent-hover transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
