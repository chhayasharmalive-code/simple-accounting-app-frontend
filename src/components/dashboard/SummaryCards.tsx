import { GlassCard } from '@/components/ui/GlassCard'
import { formatINR } from '@/lib/format'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface SummaryCardsProps {
  stats: {
    netBalance: number
    totalReceivable: number
    totalPayable: number
  }
}

const cards = [
  {
    key: 'net',
    label: 'Net Balance',
    icon: Wallet,
    getValue: (s: SummaryCardsProps['stats']) => s.netBalance,
    getColor: (s: SummaryCardsProps['stats']) =>
      s.netBalance > 0
        ? 'var(--accent-emerald)'
        : s.netBalance < 0
          ? 'var(--accent-rose)'
          : 'var(--text-muted)',
    getBg: (s: SummaryCardsProps['stats']) =>
      s.netBalance > 0
        ? 'var(--accent-emerald-soft)'
        : s.netBalance < 0
          ? 'var(--accent-rose-soft)'
          : 'var(--border-subtle)',
  },
  {
    key: 'given',
    label: 'Receivable (You Get)',
    icon: TrendingUp,
    getValue: (s: SummaryCardsProps['stats']) => s.totalReceivable,
    getColor: () => 'var(--accent-emerald)',
    getBg: () => 'var(--accent-emerald-soft)',
  },
  {
    key: 'taken',
    label: 'Payable (You Give)',
    icon: TrendingDown,
    getValue: (s: SummaryCardsProps['stats']) => s.totalPayable,
    getColor: () => 'var(--accent-rose)',
    getBg: () => 'var(--accent-rose-soft)',
  },
] as const

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map(({ key, label, icon: Icon, getValue, getColor, getBg }) => (
        <GlassCard key={key} className={`p-4 flex items-center gap-4 ${key === 'net' ? 'col-span-2 sm:col-span-1' : ''}`}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: getBg(stats) }}
          >
            <Icon className="w-5 h-5" style={{ color: getColor(stats) }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide leading-tight" style={{ color: 'var(--text-muted)' }}>
              {label}
            </p>
            <p className="text-lg sm:text-xl font-bold truncate" style={{ color: getColor(stats) }}>
              {formatINR(getValue(stats))}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
