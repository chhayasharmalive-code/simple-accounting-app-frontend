import { GlassCard } from '@/components/ui/GlassCard'
import { formatINR } from '@/lib/format'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface SummaryCardsProps {
  stats: DashboardStats
}

const cards = [
  {
    key: 'net',
    label: 'Net Balance',
    icon: Wallet,
    getValue: (s: DashboardStats) => s.netBalance,
    getColor: (s: DashboardStats) =>
      s.netBalance > 0
        ? 'var(--accent-emerald)'
        : s.netBalance < 0
          ? 'var(--accent-rose)'
          : 'var(--text-muted)',
    getBg: (s: DashboardStats) =>
      s.netBalance > 0
        ? 'var(--accent-emerald-soft)'
        : s.netBalance < 0
          ? 'var(--accent-rose-soft)'
          : 'var(--border-subtle)',
  },
  {
    key: 'given',
    label: 'You Gave',
    icon: TrendingUp,
    getValue: (s: DashboardStats) => s.totalLent,
    getColor: () => 'var(--accent-emerald)',
    getBg: () => 'var(--accent-emerald-soft)',
  },
  {
    key: 'taken',
    label: 'You Took',
    icon: TrendingDown,
    getValue: (s: DashboardStats) => s.totalBorrowed,
    getColor: () => 'var(--accent-rose)',
    getBg: () => 'var(--accent-rose-soft)',
  },
] as const

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map(({ key, label, icon: Icon, getValue, getColor, getBg }) => (
        <GlassCard key={key} className="p-4 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: getBg(stats) }}
          >
            <Icon className="w-5 h-5" style={{ color: getColor(stats) }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {label}
            </p>
            <p className="text-xl font-bold truncate" style={{ color: getColor(stats) }}>
              {formatINR(getValue(stats))}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
