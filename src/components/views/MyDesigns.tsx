import { Plus, Clock, GitBranch, Boxes, ArrowRight, MoreHorizontal } from 'lucide-react';
import { RECENT_DESIGNS } from '@/lib/mock-data';
import type { ViewKey } from '@/lib/types';
import { cx } from '@/lib/helpers';

interface MyDesignsProps {
  onNavigate: (v: ViewKey) => void;
  onNewDesign: () => void;
}

export function MyDesigns({ onNavigate, onNewDesign }: MyDesignsProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">MY DESIGNS</span>
              <span className="h-px w-16 bg-[var(--border-subtle)]" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">All System Designs</h1>
            <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{RECENT_DESIGNS.length} designs</p>
          </div>
          <button
            onClick={onNewDesign}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--accent-primary)] text-white font-medium text-[12px] hover:brightness-110 transition-all"
          >
            <Plus size={15} strokeWidth={2} />
            <span className="hidden sm:inline">New Design</span>
          </button>
        </div>

        {/* Table header */}
        <div className="flex items-center gap-4 px-3 py-2 border-t border-b border-[var(--border-subtle)]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] flex-1">Name</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] w-24 hidden sm:inline">Scale</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] w-24 hidden md:inline">Updated</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] w-16">Version</span>
          <span className="w-8 shrink-0" />
        </div>

        {/* Designs */}
        {RECENT_DESIGNS.map((design, i) => (
          <div
            key={design.id}
            onClick={() => onNavigate('architecture')}
            className={cx(
              'group flex items-center gap-4 px-3 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]',
              i > 0 && 'border-t border-[var(--border-subtle)]'
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center shrink-0">
                <Boxes size={14} className="text-[var(--text-secondary)]" strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-medium text-[var(--text-primary)] truncate block">{design.name}</span>
                <span className="font-mono text-[10px] text-[var(--text-muted)] sm:hidden">{design.users} · {design.updated}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-secondary)] w-24 hidden sm:inline">{design.users}</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] w-24 hidden md:inline">
              <Clock size={10} /> {design.updated}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] w-16">
              <GitBranch size={10} /> v{design.version}
            </span>
            <div className="w-8 flex items-center justify-end shrink-0">
              <ArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}

        {/* Empty state hint */}
        <div className="mt-6 border border-dashed border-[var(--border-default)] p-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">NO MORE DESIGNS</span>
          <p className="text-[12px] text-[var(--text-secondary)] mb-4">
            Start with a product requirement and let Architect AI turn it into an engineering blueprint.
          </p>
          <button
            onClick={onNewDesign}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] text-[12px] font-medium hover:bg-[var(--accent-glow)] transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            New System Design
          </button>
        </div>
      </div>
    </div>
  );
}
