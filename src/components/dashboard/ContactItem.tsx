import { Avatar } from '@/components/ui/Avatar'
import { BalanceBadge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import type { Contact } from '@/types'

interface ContactItemProps {
  contact: Contact
  balance: number
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export function ContactItem({
  contact,
  balance,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ContactItemProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150',
        isSelected
          ? 'bg-[var(--accent-primary-soft)] border border-[var(--accent-primary)]/20'
          : 'hover:bg-[var(--bg-glass-hover)] border border-transparent'
      )}
    >
      {/* Main clickable area */}
      <button
        onClick={() => onSelect(contact.id)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
        aria-label={`Select ${contact.name}`}
      >
        <Avatar name={contact.name} src={contact.avatar} size="md" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {contact.name}
          </p>
          {contact.phone && (
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {contact.phone}
            </p>
          )}
        </div>
      </button>

      {/*
        Right side: badge + action buttons always in the DOM.
        - Balance badge fades OUT on hover/selected (group-hover, isSelected)
        - Action buttons fade IN on hover/selected
        Both use CSS opacity+pointer-events so no layout reflow ever occurs.
      */}
      <div className="relative flex items-center shrink-0 w-[72px] justify-end">
        {/* Balance badge */}
        <div
          className={cn(
            'absolute right-0 transition-opacity duration-150',
            isSelected ? 'opacity-0 pointer-events-none' : 'opacity-100 group-hover:opacity-0 group-hover:pointer-events-none'
          )}
        >
          <BalanceBadge balance={balance} />
        </div>

        {/* Action buttons */}
        <div
          className={cn(
            'flex items-center gap-1 transition-opacity duration-150',
            isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
          )}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(contact) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--accent-primary-soft)]"
            style={{ color: 'var(--accent-primary)' }}
            aria-label={`Edit ${contact.name}`}
            title="Edit contact"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(contact) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--accent-rose-soft)]"
            style={{ color: 'var(--accent-rose)' }}
            aria-label={`Delete ${contact.name}`}
            title="Delete contact"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
