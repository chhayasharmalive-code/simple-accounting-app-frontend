import { useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { ContactItem } from './ContactItem'
import { Search, UserPlus, Users } from 'lucide-react'
import type { Contact } from '@/types'

interface ContactListProps {
  contacts: Contact[]
  contactBalances: Record<string, number>
  selectedContactId: string | null
  onSelectContact: (id: string | null) => void
  onOpenAddContact: () => void
  onEditContact: (contact: Contact) => void
  onDeleteContact: (contact: Contact) => void
}

export function ContactList({
  contacts,
  contactBalances,
  selectedContactId,
  onSelectContact,
  onOpenAddContact,
  onEditContact,
  onDeleteContact,
}: ContactListProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts
    const q = search.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.upiId?.toLowerCase().includes(q)
    )
  }, [contacts, search])

  const handleSelect = (id: string) => {
    onSelectContact(selectedContactId === id ? null : id)
  }

  return (
    <GlassCard className="p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Contacts
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--accent-primary-soft)',
              color: 'var(--accent-primary)',
            }}
          >
            {contacts.length}
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={onOpenAddContact}>
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full h-9 pl-9 pr-3 text-sm"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-0.5 max-h-[400px] overflow-y-auto -mx-1 px-1">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {contacts.length === 0
                ? 'No contacts yet. Add your first one!'
                : 'No contacts match your search.'}
            </p>
          </div>
        ) : (
          filtered.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              balance={contactBalances[contact.id] ?? contact.balance ?? 0}
              isSelected={selectedContactId === contact.id}
              onSelect={handleSelect}
              onEdit={onEditContact}
              onDelete={onDeleteContact}
            />
          ))
        )}
      </div>
    </GlassCard>
  )
}
