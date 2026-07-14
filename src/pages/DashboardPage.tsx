import { useData } from '@/context/DataContext'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardInsights } from '@/components/dashboard/DashboardInsights'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import { Receipt, ArrowRight, Sparkles } from 'lucide-react'

export function DashboardPage() {
  const {
    dashboardData,
    dashboardLoading,
    setSelectedContactId,
    setAddTransactionOpen,
    setAddContactOpen,
  } = useData()

  const navigate = useNavigate()

  // Handle drill-down into specific contact detail statement
  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId)
    navigate('/contacts')
  }

  // Loading Skeleton State
  if (dashboardLoading || !dashboardData) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6 animate-pulse select-none">
        {/* Header Summary */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-48" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-64" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-24" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-24" />
          </div>
        </div>

        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[280px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-[280px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>

        {/* Insights skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[200px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-[200px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    )
  }

  const { kpis, charts, insights, recentActivities } = dashboardData

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Financial Overview
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time balance check, transaction graphs, and ledger insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setAddContactOpen(true)} className="flex-1 sm:flex-initial">
            Add Contact
          </Button>
          <Button onClick={() => setAddTransactionOpen(true)} className="flex-1 sm:flex-initial">
            Record Tx
          </Button>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <SummaryCards stats={kpis} />

      {/* KPI Details Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-glass-hover)] border border-[var(--border-glass)] p-3 rounded-2xl text-center">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Debtors</span>
          <span className="text-sm font-bold text-[var(--text-primary)] mt-1">{kpis.activeDebtors}</span>
        </div>
        <div className="flex flex-col border-l border-[var(--border-subtle)]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Creditors</span>
          <span className="text-sm font-bold text-[var(--text-primary)] mt-1">{kpis.activeCreditors}</span>
        </div>
        <div className="flex flex-col border-l border-[var(--border-subtle)]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Contacts</span>
          <span className="text-sm font-bold text-[var(--text-primary)] mt-1">{kpis.totalContacts}</span>
        </div>
        <div className="flex flex-col border-l border-[var(--border-subtle)]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Logged Txs</span>
          <span className="text-sm font-bold text-[var(--text-primary)] mt-1">{kpis.totalTransactionsCount}</span>
        </div>
      </div>

      {/* Cashflow Charts View */}
      <DashboardCharts
        dailyTrends={charts.dailyTrends}
        monthlyTrends={charts.monthlyTrends}
        distribution={charts.distribution}
      />

      {/* Debt Standings & Peak Insights */}
      <DashboardInsights
        topDebtors={insights.topDebtors}
        topCreditors={insights.topCreditors}
        peakLendingDay={insights.peakLendingDay}
        peakBorrowingDay={insights.peakBorrowingDay}
        peakLendingMonth={insights.peakLendingMonth}
        peakBorrowingMonth={insights.peakBorrowingMonth}
        onSelectContact={handleSelectContact}
      />

      {/* Recent Activities & Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Activities */}
        <GlassCard className="p-5 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
              <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
                Recent Activities
              </h3>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:opacity-85"
              style={{ color: 'var(--accent-primary)' }}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-center py-10" style={{ color: 'var(--text-muted)' }}>
                No recent transactions or contact updates.
              </p>
            ) : (
              recentActivities.map((act) => (
                <TransactionItem
                  key={act.id}
                  transaction={{
                    id: act.id,
                    contactId: act.contactId,
                    amount: act.amount,
                    type: act.type,
                    reference: act.reference,
                    createdAt: act.createdAt,
                    contact: {
                      id: act.contactId,
                      name: act.contactName,
                    },
                  }}
                />
              ))
            )}
          </div>
        </GlassCard>

        {/* Tip Card & Quick links */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          <GlassCard className="p-5 flex flex-col gap-3" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shrink-0 animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                Pro Tip
              </h4>
            </div>
            <p className="text-xs leading-normal text-[var(--text-muted)]">
              Use the floating plus button <span className="font-bold text-[var(--accent-primary)]">+</span> at the bottom right corner of the screen from any page to quickly add contacts or log a payment.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
