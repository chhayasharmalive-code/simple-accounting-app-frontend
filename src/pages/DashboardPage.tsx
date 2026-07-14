import { useData } from '@/context/DataContext'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { ContactItem } from '@/components/dashboard/ContactItem'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Users, Receipt, ArrowRight, Sparkles } from 'lucide-react'

export function DashboardPage() {
  const {
    contacts,
    contactBalances,
    transactions,
    stats,
    setSelectedContactId,
    setAddTransactionOpen,
    setAddContactOpen,
    setEditContact,
    setDeleteTarget,
  } = useData()

  // Last 3 recently updated/added contacts
  const recentContacts = contacts.slice(0, 3)

  // Last 5 transactions
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Financial Overview
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time balance check and transaction logs.
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

      {/* Primary stats */}
      <SummaryCards stats={stats} />

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Contacts Column */}
        <GlassCard className="p-4 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Contacts</h3>
              </div>
              <Link to="/contacts" className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:opacity-85" style={{ color: 'var(--accent-primary)' }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              {recentContacts.length === 0 ? (
                <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No contacts found.
                </div>
              ) : (
                recentContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    balance={contactBalances[contact.id] ?? contact.balance ?? 0}
                    isSelected={false}
                    onSelect={(id) => setSelectedContactId(id)}
                    onEdit={setEditContact}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </div>
          </div>
        </GlassCard>

        {/* Recent Transactions Column */}
        <GlassCard className="p-4 flex flex-col justify-between relative z-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
              </div>
              <Link to="/transactions" className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:opacity-85" style={{ color: 'var(--accent-primary)' }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {recentTransactions.length === 0 ? (
                <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No transactions logged yet.
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tip Card */}
      <GlassCard className="p-4 flex items-center gap-3" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Pro Tip</p>
          <p className="mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Use the floating plus button <span className="font-bold text-[var(--accent-primary)]">+</span> at the bottom right corner of the screen from any page to quickly add contacts or log a payment.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
