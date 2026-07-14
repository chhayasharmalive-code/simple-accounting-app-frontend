import { Avatar } from '@/components/ui/Avatar'
import { BalanceBadge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import type { Contact } from '@/types'
import { useState, useRef, useEffect } from 'react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close mobile overflow menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileMenuOpen])

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

      {/* ── Desktop: hover-reveal balance + icon buttons ── */}
      <div className="hidden md:flex relative items-center shrink-0 w-[72px] justify-end">
        {/* Balance badge fades on hover */}
        <div
          className={cn(
            'absolute right-0 transition-opacity duration-150',
            isSelected
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 group-hover:opacity-0 group-hover:pointer-events-none'
          )}
        >
          <BalanceBadge balance={balance} />
        </div>

        {/* Edit / Delete buttons revealed on hover */}
        <div
          className={cn(
            'flex items-center gap-1 transition-opacity duration-150',
            isSelected
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
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

      {/* ── Mobile: always-visible ⋮ overflow menu ── */}
      <div className="flex md:hidden items-center gap-1 shrink-0" ref={menuRef}>
        <BalanceBadge balance={balance} />

        <button
          onClick={(e) => { e.stopPropagation(); setMobileMenuOpen((v) => !v) }}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-glass-hover)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Overflow dropdown */}
        {mobileMenuOpen && (
          <div
            className="absolute right-2 top-full mt-1 z-50 min-w-[130px] py-1 flex flex-col rounded-xl border border-[var(--border-glass)] shadow-xl"
            style={{
              background: 'var(--bg-secondary)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(false)
                onEdit(contact)
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--accent-primary-soft)]"
              style={{ color: 'var(--accent-primary)' }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(false)
                onDelete(contact)
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--accent-rose-soft)]"
              style={{ color: 'var(--accent-rose)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
