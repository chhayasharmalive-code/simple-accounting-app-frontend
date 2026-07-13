import { useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { TransactionItem } from './TransactionItem'
import { ArrowLeftRight, X } from 'lucide-react'
import type { Transaction, Contact } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  contacts: Contact[]
  selectedContactId: string | null
  onClearFilter: () => void
  onOpenAddTransaction: () => void
}

export function TransactionList({
  transactions,
  contacts,
  selectedContactId,
  onClearFilter,
  onOpenAddTransaction,
}: TransactionListProps) {
  const contactMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of contacts) map[c.id] = c.name
    return map
  }, [contacts])

  const filtered = useMemo(() => {
    const list = selectedContactId
      ? transactions.filter((tx) => tx.contactId === selectedContactId)
      : transactions
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [transactions, selectedContactId])

  const selectedName = selectedContactId ? contactMap[selectedContactId] : null

  return (
    <GlassCard className="p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <ArrowLeftRight className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Transactions
          </h3>

          {selectedName && (
            <button
              onClick={onClearFilter}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'var(--accent-primary-soft)',
                color: 'var(--accent-primary)',
              }}
            >
              {selectedName}
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <Button variant="secondary" size="sm" onClick={onOpenAddTransaction}>
          <ArrowLeftRight className="w-4 h-4" />
          <span className="hidden sm:inline">Record</span>
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col max-h-[500px] overflow-y-auto -mx-1 px-1">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <ArrowLeftRight className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {selectedContactId
                ? 'No transactions with this contact yet.'
                : 'No transactions yet. Record your first one!'}
            </p>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              contactName={
                !selectedContactId
                  ? contactMap[tx.contactId] || tx.contact?.name
                  : undefined
              }
            />
          ))
        )}
      </div>
    </GlassCard>
  )
}
