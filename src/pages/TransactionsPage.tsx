import { useData } from '@/context/DataContext'
import { TransactionList } from '@/components/dashboard/TransactionList'

export function TransactionsPage() {
  const {
    contacts,
    transactions,
    selectedContactId,
    setSelectedContactId,
    setAddTransactionOpen,
  } = useData()

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Transaction Ledger
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Filter, search, and audit all recorded financial ledger items.
        </p>
      </div>

      {/* Transaction list container */}
      <div className="w-full">
        <TransactionList
          transactions={transactions}
          contacts={contacts}
          selectedContactId={selectedContactId}
          onClearFilter={() => setSelectedContactId(null)}
          onOpenAddTransaction={() => setAddTransactionOpen(true)}
        />
      </div>
    </div>
  )
}
