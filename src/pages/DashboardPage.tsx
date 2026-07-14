import { useData } from '@/context/DataContext'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardInsights } from '@/components/dashboard/DashboardInsights'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import { Receipt, ArrowRight, Sparkles, Loader2 } from 'lucide-react'

export function DashboardPage() {
  const {
    dashboardData,
    dashboardLoading,
    dashboardRefreshing,
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
    const skel = 'rounded-2xl' // shared radius
    const bar = (w: string, h = 'h-3') =>
      `${h} ${w} rounded-md`

    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6 animate-pulse select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className={bar('w-44', 'h-7')} style={{ backgroundColor: 'var(--border-glass)' }} />
            <div className={bar('w-64', 'h-3.5')} style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-xl" style={{ backgroundColor: 'var(--border-glass)' }} />
            <div className="h-10 w-24 rounded-xl" style={{ backgroundColor: 'var(--border-glass)' }} />
          </div>
        </div>

        {/* Summary Cards — 2-col mobile (net full-width), 3-col sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`col-span-2 sm:col-span-1 h-[76px] ${skel} p-4 flex items-center gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
            <div className="w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: 'var(--border-glass)' }} />
            <div className="flex flex-col gap-2 flex-1">
              <div className={bar('w-20')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-28', 'h-5')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className={`h-[76px] ${skel} p-4 flex items-center gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
              <div className="w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className="flex flex-col gap-2 flex-1">
                <div className={bar('w-16')} style={{ backgroundColor: 'var(--border-glass)' }} />
                <div className={bar('w-20', 'h-5')} style={{ backgroundColor: 'var(--border-subtle)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* KPI Ribbon */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 ${skel}`} style={{ backgroundColor: 'var(--bg-glass)' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={bar('w-16', 'h-2')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-8', 'h-4')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
          ))}
        </div>

        {/* Charts — 1-col mobile, 3-col lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${skel} p-5 flex flex-col gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1.5">
                <div className={bar('w-32')} style={{ backgroundColor: 'var(--border-glass)' }} />
                <div className={bar('w-48', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
              </div>
              <div className="h-7 w-28 rounded-lg" style={{ backgroundColor: 'var(--border-glass)' }} />
            </div>
            <div className="flex items-end gap-3 h-[160px] pt-4">
              {[65, 40, 80, 30, 55, 70, 45].map((h, i) => (
                <div key={i} className="flex-1 flex items-end justify-center gap-1">
                  <div className="w-2 rounded-t-full" style={{ height: `${h}%`, backgroundColor: 'var(--border-glass)' }} />
                  <div className="w-2 rounded-t-full" style={{ height: `${h * 0.6}%`, backgroundColor: 'var(--border-subtle)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className={`${skel} p-5 flex flex-col gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
            <div className="flex flex-col gap-1.5">
              <div className={bar('w-24')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-40', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className={bar('w-full', 'h-3')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-full', 'h-3')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
            <div className="flex flex-col gap-2 mt-auto border-t pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className={bar('w-full', 'h-2.5')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-full', 'h-2.5')} style={{ backgroundColor: 'var(--border-glass)' }} />
            </div>
          </div>
        </div>

        {/* Insights — 1-col mobile, 2-col md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className={`${skel} p-5 flex flex-col gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
              <div className="flex flex-col gap-1.5">
                <div className={bar('w-28')} style={{ backgroundColor: 'var(--border-glass)' }} />
                <div className={bar('w-44', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
              </div>
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: 'var(--border-glass)' }} />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className={bar('w-24')} style={{ backgroundColor: 'var(--border-glass)' }} />
                      <div className={bar('w-16', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities — 1-col mobile, 12-col lg */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-8 ${skel} p-5 flex flex-col gap-4`} style={{ backgroundColor: 'var(--bg-glass)' }}>
            <div className="flex justify-between items-center">
              <div className={bar('w-32')} style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-16', 'h-2.5')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: 'var(--border-glass)' }} />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className={bar('w-28')} style={{ backgroundColor: 'var(--border-glass)' }} />
                  <div className={bar('w-40', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
                </div>
                <div className={bar('w-16', 'h-4')} style={{ backgroundColor: 'var(--border-glass)' }} />
              </div>
            ))}
          </div>
          <div className={`lg:col-span-4 ${skel} p-5 flex flex-col gap-3`} style={{ backgroundColor: 'var(--bg-glass)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: 'var(--border-glass)' }} />
              <div className={bar('w-16')} style={{ backgroundColor: 'var(--border-glass)' }} />
            </div>
            <div className={bar('w-full', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
            <div className={bar('w-4/5', 'h-2')} style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>
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
      <div className="relative">
        {dashboardRefreshing && <RefreshOverlay />}
        <SummaryCards stats={kpis} />
      </div>

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
      <div className="relative">
        {dashboardRefreshing && <RefreshOverlay />}
        <DashboardCharts
          dailyTrends={charts.dailyTrends}
          monthlyTrends={charts.monthlyTrends}
          distribution={charts.distribution}
        />
      </div>

      {/* Debt Standings & Peak Insights */}
      <div className="relative">
        {dashboardRefreshing && <RefreshOverlay />}
        <DashboardInsights
          topDebtors={insights.topDebtors}
          topCreditors={insights.topCreditors}
          peakLendingDay={insights.peakLendingDay}
          peakBorrowingDay={insights.peakBorrowingDay}
          peakLendingMonth={insights.peakLendingMonth}
          peakBorrowingMonth={insights.peakBorrowingMonth}
          onSelectContact={handleSelectContact}
        />
      </div>

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

/** Lightweight overlay shown on sections while dashboard data refreshes in the background */
function RefreshOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)]/40 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200">
      <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" />
    </div>
  )
}
