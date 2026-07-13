import { formatINR } from '@/lib/format'
import { formatRelativeDate } from '@/lib/format'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Transaction } from '@/types'

interface TransactionItemProps {
  transaction: Transaction
  contactName?: string
}

export function TransactionItem({ transaction, contactName }: TransactionItemProps) {
  const amount =
    typeof transaction.amount === 'string'
      ? parseFloat(transaction.amount)
      : transaction.amount
  const isGiven = transaction.type === 'GIVEN'

  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-[var(--bg-glass-hover)]"
    >
      {/* Direction Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: isGiven ? 'var(--accent-emerald-soft)' : 'var(--accent-rose-soft)',
        }}
      >
        {isGiven ? (
          <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
        ) : (
          <ArrowDownLeft className="w-4 h-4" style={{ color: 'var(--accent-rose)' }} />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {isGiven ? 'Gave' : 'Took'}
          {contactName ? ` — ${contactName}` : ''}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          {transaction.reference || (isGiven ? 'Money given' : 'Money taken')}
          {' · '}
          {formatRelativeDate(transaction.createdAt)}
        </p>
      </div>

      {/* Amount */}
      <span
        className="text-sm font-bold whitespace-nowrap"
        style={{ color: isGiven ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}
      >
        {isGiven ? '+' : '-'}{formatINR(amount)}
      </span>
    </div>
  )
}
