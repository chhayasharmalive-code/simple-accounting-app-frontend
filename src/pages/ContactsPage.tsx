import { useData } from '@/context/DataContext'
import { ContactList } from '@/components/dashboard/ContactList'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { GlassCard } from '@/components/ui/GlassCard'
import { X, ArrowLeft, MessageCircle } from 'lucide-react'
import { formatINR } from '@/lib/format'

export function ContactsPage() {
  const {
    contacts,
    contactBalances,
    transactions,
    selectedContactId,
    setSelectedContactId,
    setAddContactOpen,
    setEditContact,
    setDeleteTarget,
  } = useData()

  const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null

  // Filter transactions for selected contact
  const contactTransactions = transactions.filter((t) => t.contactId === selectedContactId)

  // Calculate sum lent and borrowed for this contact
  const contactStats = contactTransactions.reduce(
    (acc, tx) => {
      const amt = parseFloat(tx.amount.toString()) || 0
      if (tx.type === 'GIVEN') acc.lent += amt
      else acc.borrowed += amt
      return acc
    },
    { lent: 0, borrowed: 0 }
  )

  const netBalance = contactStats.lent - contactStats.borrowed

  const getWhatsAppLink = (name: string, phone: string, amount: number, upiId?: string) => {
    let cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone
    }

    const upiTextEn = upiId ? ` to UPI ID: ${upiId}` : ''
    const upiTextHi = upiId ? ` (UPI ID: ${upiId} पर)` : ''

    const messageEn = `Hi ${name}, hope you are doing well. This is a gentle reminder regarding the pending balance of ₹${amount} on unbox Pay. You can settle it${upiTextEn}. Thank you!`
    const messageHi = `नमस्ते ${name}, आशा है आप ठीक होंगे। unbox Pay पर ₹${amount} के लंबित भुगतान के संबंध में यह एक विनम्र अनुस्मारक (reminder) है। आप इसे चुकाने के लिए इस लिंक या UPI का उपयोग कर सकते हैं${upiTextHi}। धन्यवाद!`

    const fullMessage = `${messageEn}\n\n${messageHi}`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Manage Contacts
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Edit, delete, and view individual contact ledger statements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Contact List */}
        <div className={selectedContact ? 'lg:col-span-5 hidden lg:block' : 'lg:col-span-12'}>
          <ContactList
            contacts={contacts}
            contactBalances={contactBalances}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
            onOpenAddContact={() => setAddContactOpen(true)}
            onEditContact={setEditContact}
            onDeleteContact={setDeleteTarget}
          />
        </div>

        {/* If a contact is selected, show details / statements */}
        {selectedContact && (
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Contact Detail Card */}
            <GlassCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedContactId(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-lg hover:bg-[var(--bg-glass-hover)] transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={() => setSelectedContactId(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-glass-hover)] text-[var(--text-muted)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile details */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white bg-[var(--accent-primary)] shadow-sm">
                  {selectedContact.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {selectedContact.name}
                  </h3>
                  {selectedContact.phone && (
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Phone: {selectedContact.phone}
                    </p>
                  )}
                  {selectedContact.upiId && (
                    <p className="text-xs truncate font-mono mt-0.5 text-[var(--accent-primary)]">
                      {selectedContact.upiId}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />

              {/* Contact balance summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col p-2 rounded-xl" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Gave</span>
                  <span className="text-sm font-bold mt-1 text-[var(--accent-emerald)]">
                    {formatINR(contactStats.lent)}
                  </span>
                </div>
                <div className="flex flex-col p-2 rounded-xl" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Took</span>
                  <span className="text-sm font-bold mt-1 text-[var(--accent-rose)]">
                    {formatINR(contactStats.borrowed)}
                  </span>
                </div>
                <div
                  className="flex flex-col p-2 rounded-xl"
                  style={{
                    backgroundColor: netBalance >= 0 ? 'var(--accent-emerald-soft)' : 'var(--accent-rose-soft)',
                  }}
                >
                  <span className="text-[10px] uppercase font-semibold" style={{ color: netBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {netBalance >= 0 ? 'You Get' : 'You Give'}
                  </span>
                  <span className="text-sm font-bold mt-1" style={{ color: netBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {formatINR(Math.abs(netBalance))}
                  </span>
                </div>
              </div>

              {/* WhatsApp reminder button if they owe you money and have a phone number */}
              {netBalance > 0 && selectedContact.phone && (
                <a
                  href={getWhatsAppLink(selectedContact.name, selectedContact.phone, Math.abs(netBalance), selectedContact.upiId || undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all bg-[#25D366] text-white hover:opacity-90 active:scale-[0.98] shadow-sm mt-1"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  Send WhatsApp Reminder
                </a>
              )}
            </GlassCard>

            {/* Transaction Ledger */}
            <GlassCard className="p-4 flex flex-col gap-3">
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Transaction History
              </h4>

              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {contactTransactions.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>
                    No transactions recorded for this contact.
                  </p>
                ) : (
                  contactTransactions.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  )
}
