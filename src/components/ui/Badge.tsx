import { cn } from '@/lib/utils'
import { formatINRAbs } from '@/lib/format'

type BadgeVariant = 'positive' | 'negative' | 'neutral'

interface BadgeProps {
  balance: number
  className?: string
}

export function BalanceBadge({ balance, className }: BadgeProps) {
  const variant: BadgeVariant =
    balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral'

  const config: Record<BadgeVariant, { label: string; bg: string; text: string }> = {
    positive: {
      label: `Owes you ${formatINRAbs(balance)}`,
      bg: 'var(--accent-emerald-soft)',
      text: 'var(--accent-emerald)',
    },
    negative: {
      label: `You owe ${formatINRAbs(balance)}`,
      bg: 'var(--accent-rose-soft)',
      text: 'var(--accent-rose)',
    },
    neutral: {
      label: 'Settled',
      bg: 'var(--border-subtle)',
      text: 'var(--text-muted)',
    },
  }

  const { label, bg, text } = config[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}
