import { Plus, ArrowUpRight, Clock, GitBranch, TrendingUp, Zap, Activity, Boxes } from 'lucide-react';
import { RECENT_DESIGNS } from '@/lib/mock-data';
import type { ViewKey } from '@/lib/types';
import { cx } from '@/lib/helpers';

interface OverviewProps {
  onNavigate: (v: ViewKey) => void;
  onNewDesign: () => void;
}

export function Overview({ onNavigate, onNewDesign }: OverviewProps) {
  const stats = [
    { label: 'Designs', value: '4', icon: Boxes, trend: '+2 this week' },
    { label: 'Components', value: '47', icon: GitBranch, trend: 'across all designs' },
    { label: 'Simulations Run', value: '12', icon: Activity, trend: '3 failures detected' },
    { label: 'Avg Latency', value: '<100ms', icon: Zap, trend: 'p99 target met' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">DASHBOARD</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-2">
            SYSTEM DESIGN WORKSPACE
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)]">
            Turn ideas into production-ready architectures.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onNewDesign}
          className="group flex items-center gap-3 px-5 py-3.5 bg-[var(--accent-primary)] text-white font-medium text-[13px] transition-all hover:brightness-110 mb-10"
        >
          <Plus size={16} strokeWidth={2} />
          <span>New System Design</span>
          <ArrowUpRight size={15} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-subtle)] mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--bg-base)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={13} className="text-[var(--text-muted)]" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{s.label}</span>
              </div>
              <div className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">{s.value}</div>
              <div className="font-mono text-[10px] text-[var(--text-muted)] mt-1">{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Recent designs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Recent Designs</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <button onClick={() => onNavigate('my-designs')} className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
              View All →
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)]">
          {RECENT_DESIGNS.map((design, i) => (
            <div
              key={design.id}
              onClick={() => onNavigate('architecture')}
              className={cx(
                'group flex items-center gap-4 px-3 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]',
                i > 0 && 'border-t border-[var(--border-subtle)]'
              )}
            >
              <div className="w-8 h-8 border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center shrink-0">
                <Boxes size={15} className="text-[var(--text-secondary)]" strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">{design.name}</span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 border border-[var(--border-default)]">{design.users}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                    <Clock size={10} /> {design.updated}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">Architecture · v{design.version}</span>
                </div>
              </div>
              <ArrowUpRight size={15} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          ))}
        </div>

        {/* What If section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Quick Simulate</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <div className="border border-dashed border-[var(--border-default)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">WHAT IF?</span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] mb-4">
              Test your architecture against real-world scenarios before production.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'What if traffic increases 10×?',
                'What if PostgreSQL goes down?',
                'What if Kafka becomes unavailable?',
                'What if latency requirement becomes 50ms?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => onNavigate('simulations')}
                  className="text-left px-3 py-2 border border-[var(--border-default)] text-[12px] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
