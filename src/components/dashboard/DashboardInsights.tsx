import { GlassCard } from '@/components/ui/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { formatINR } from '@/lib/format'
import { ArrowUpRight, ArrowDownLeft, Flame, CalendarRange } from 'lucide-react'

interface ContactSummary {
  contactId: string
  contactName: string
  contactAvatar: string | null
  balance: number
}

interface DashboardInsightsProps {
  topDebtors: ContactSummary[]
  topCreditors: ContactSummary[]
  peakLendingMonth: { month: string; amount: number } | null
  peakBorrowingMonth: { month: string; amount: number } | null
  peakLendingDay: { date: string; amount: number } | null
  peakBorrowingDay: { date: string; amount: number } | null
  onSelectContact: (id: string) => void
}

export function DashboardInsights({
  topDebtors,
  topCreditors,
  peakLendingMonth,
  peakBorrowingMonth,
  peakLendingDay,
  peakBorrowingDay,
  onSelectContact,
}: DashboardInsightsProps) {
  const formatDateStr = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })
  }

  const formatMonthStr = (monthStr?: string) => {
    if (!monthStr) return '-'
    const [year, month] = monthStr.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Debtors & Creditors list */}
      <GlassCard className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            Ledger Standings
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Highest debtor and creditor balances
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Top Debtors */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-emerald)] flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Top Debtors
            </span>
            <div className="flex flex-col gap-1.5">
              {topDebtors.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-3">No active debtors</p>
              ) : (
                topDebtors.map((c) => (
                  <button
                    key={c.contactId}
                    onClick={() => onSelectContact(c.contactId)}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-transparent hover:border-[var(--border-glass)] hover:bg-[var(--bg-glass-hover)] transition-all text-left active:scale-[0.98]"
                  >
                    <Avatar name={c.contactName} src={c.contactAvatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-[var(--text-primary)]">
                        {c.contactName}
                      </p>
                      <p className="text-[10px] font-bold text-[var(--accent-emerald)] mt-0.5">
                        +{formatINR(c.balance)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Top Creditors */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-rose)] flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Top Creditors
            </span>
            <div className="flex flex-col gap-1.5">
              {topCreditors.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-3">No active creditors</p>
              ) : (
                topCreditors.map((c) => (
                  <button
                    key={c.contactId}
                    onClick={() => onSelectContact(c.contactId)}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-transparent hover:border-[var(--border-glass)] hover:bg-[var(--bg-glass-hover)] transition-all text-left active:scale-[0.98]"
                  >
                    <Avatar name={c.contactName} src={c.contactAvatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-[var(--text-primary)]">
                        {c.contactName}
                      </p>
                      <p className="text-[10px] font-bold text-[var(--accent-rose)] mt-0.5">
                        -{formatINR(c.balance)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Cashflow Insights / Records */}
      <GlassCard className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            Cashflow Peaks
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Lending and borrowing records summary
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* Lending peaks */}
          <div className="p-3.5 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-primary)] flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute right-2 top-2 text-[var(--accent-emerald)] opacity-10 transition-transform group-hover:scale-110">
              <Flame className="w-8 h-8 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--accent-emerald)] tracking-wider">
                Max Lending Day
              </span>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                {peakLendingDay ? formatINR(peakLendingDay.amount) : '₹0'}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                {peakLendingDay ? formatDateStr(peakLendingDay.date) : 'No transactions'}
              </p>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-2 mt-auto">
              <span className="text-[9px] uppercase font-semibold text-[var(--text-muted)] tracking-wider block">
                Peak Month
              </span>
              <p className="text-[11px] font-bold text-[var(--text-primary)] mt-0.5 truncate">
                {peakLendingMonth ? `${formatMonthStr(peakLendingMonth.month)} (${formatINR(peakLendingMonth.amount)})` : '-'}
              </p>
            </div>
          </div>

          {/* Borrowing peaks */}
          <div className="p-3.5 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-primary)] flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute right-2 top-2 text-[var(--accent-rose)] opacity-10 transition-transform group-hover:scale-110">
              <CalendarRange className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--accent-rose)] tracking-wider">
                Max Borrowing Day
              </span>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                {peakBorrowingDay ? formatINR(peakBorrowingDay.amount) : '₹0'}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                {peakBorrowingDay ? formatDateStr(peakBorrowingDay.date) : 'No transactions'}
              </p>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-2 mt-auto">
              <span className="text-[9px] uppercase font-semibold text-[var(--text-muted)] tracking-wider block">
                Peak Month
              </span>
              <p className="text-[11px] font-bold text-[var(--text-primary)] mt-0.5 truncate">
                {peakBorrowingMonth ? `${formatMonthStr(peakBorrowingMonth.month)} (${formatINR(peakBorrowingMonth.amount)})` : '-'}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
