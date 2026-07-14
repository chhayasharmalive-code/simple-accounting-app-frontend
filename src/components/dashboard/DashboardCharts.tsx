import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { formatINR } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TrendItem {
  label: string
  lent: number
  borrowed: number
}

interface DashboardChartsProps {
  dailyTrends: Array<{ date: string; lent: number; borrowed: number }>
  monthlyTrends: Array<{ month: string; lent: number; borrowed: number }>
  distribution: {
    totalLentEver: number
    totalBorrowedEver: number
  }
}

export function DashboardCharts({ dailyTrends, monthlyTrends, distribution }: DashboardChartsProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily')
  const { theme } = useTheme()

  // Transform data to a unified format
  const activeTrends: TrendItem[] = timeframe === 'daily'
    ? dailyTrends.map((d) => ({
        label: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        lent: d.lent,
        borrowed: d.borrowed,
      }))
    : monthlyTrends.map((m) => {
        const [year, month] = m.month.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1, 1)
        return {
          label: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          lent: m.lent,
          borrowed: m.borrowed,
        }
      })

  // Find max value to scale the chart
  const maxVal = Math.max(
    ...activeTrends.flatMap((t) => [t.lent, t.borrowed]),
    100 // Fallback minimum scale
  )

  // Calculate distribution percentages
  const totalEver = distribution.totalLentEver + distribution.totalBorrowedEver
  const lentPct = totalEver > 0 ? (distribution.totalLentEver / totalEver) * 100 : 50
  const borrowedPct = totalEver > 0 ? (distribution.totalBorrowedEver / totalEver) * 100 : 50

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trends Graph */}
      <GlassCard className="p-5 lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
              Cashflow Trends
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Lent vs borrowed activity comparison
            </p>
          </div>

          {/* Segmented Timeframe Selector */}
          <div className="flex p-0.5 rounded-lg border border-[var(--border-glass)] bg-[var(--bg-primary)]">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                timeframe === 'daily'
                  ? `${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-[var(--accent-primary)]'} shadow-sm`
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                timeframe === 'monthly'
                  ? `${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-[var(--accent-primary)]'} shadow-sm`
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Bar Chart View */}
        <div className="h-[200px] flex items-end gap-2 sm:gap-4 pt-4 px-2 w-full select-none">
          {activeTrends.map((t, idx) => {
            const lentHeight = `${(t.lent / maxVal) * 100}%`
            const borrowedHeight = `${(t.borrowed / maxVal) * 100}%`

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full gap-2 group min-w-0">
                {/* Visualizer column */}
                <div className="flex-1 w-full flex items-end justify-center gap-1 relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-black/95 text-white text-[9px] p-2 rounded-lg pointer-events-none shadow-xl z-20 min-w-[90px] border border-white/10">
                    <p className="font-semibold border-b border-white/10 pb-0.5 mb-1 text-center w-full">{t.label}</p>
                    <p className="flex items-center justify-between w-full text-[var(--accent-emerald)]">
                      <span>Lent:</span>
                      <span className="font-bold">₹{t.lent}</span>
                    </p>
                    <p className="flex items-center justify-between w-full text-[var(--accent-rose)]">
                      <span>Borrowed:</span>
                      <span className="font-bold">₹{t.borrowed}</span>
                    </p>
                  </div>

                  {/* Lent bar */}
                  <div
                    className="w-1.5 sm:w-3.5 rounded-t-full transition-all duration-500 relative"
                    style={{
                      height: lentHeight,
                      background: 'linear-gradient(to top, var(--accent-emerald-soft), var(--accent-emerald))',
                      boxShadow: t.lent > 0 ? '0 0 10px rgba(16, 185, 129, 0.15)' : 'none',
                    }}
                  />
                  {/* Borrowed bar */}
                  <div
                    className="w-1.5 sm:w-3.5 rounded-t-full transition-all duration-500 relative"
                    style={{
                      height: borrowedHeight,
                      background: 'linear-gradient(to top, var(--accent-rose-soft), var(--accent-rose))',
                      boxShadow: t.borrowed > 0 ? '0 0 10px rgba(244, 63, 94, 0.15)' : 'none',
                    }}
                  />
                </div>

                {/* X-Axis Label */}
                <span className="text-[9px] truncate font-medium text-[var(--text-muted)] max-w-full">
                  {t.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 items-center justify-center border-t border-[var(--border-subtle)] pt-3 text-[10px] font-semibold tracking-wider text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent-emerald)' }} />
            LENT
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent-rose)' }} />
            BORROWED
          </div>
        </div>
      </GlassCard>

      {/* Cashflow Distribution */}
      <GlassCard className="p-5 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            Lending Share
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            All-time balance distribution ratio
          </p>
        </div>

        <div className="flex flex-col gap-4 my-auto">
          {/* Circular/Linear progress representation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1" style={{ color: 'var(--accent-emerald)' }}>
                <TrendingUp className="w-3.5 h-3.5" />
                Lent (Debtors)
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{lentPct.toFixed(0)}%</span>
            </div>

            <div className="h-3 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-[var(--accent-emerald)] transition-all duration-700"
                style={{ width: `${lentPct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-[var(--accent-rose)] transition-all duration-700"
                style={{ width: `${borrowedPct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-semibold mt-1">
              <span className="flex items-center gap-1" style={{ color: 'var(--accent-rose)' }}>
                <TrendingDown className="w-3.5 h-3.5" />
                Borrowed (Creditors)
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{borrowedPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-3">
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Total Lent Ever:</span>
            <span className="font-bold" style={{ color: 'var(--accent-emerald)' }}>
              {formatINR(distribution.totalLentEver)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Total Borrowed Ever:</span>
            <span className="font-bold" style={{ color: 'var(--accent-rose)' }}>
              {formatINR(distribution.totalBorrowedEver)}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
