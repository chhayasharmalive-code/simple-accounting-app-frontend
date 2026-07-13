import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PaymentSheet } from '@/components/ui/PaymentSheet'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { Wallet, CreditCard } from 'lucide-react'
import type { Contact, CreateTransactionParams } from '@/types'
import type { UpiPaymentParams } from '@/lib/upi'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  contacts: Contact[]
  selectedContactId: string | null
  onAdd: (params: CreateTransactionParams) => Promise<boolean>
}

export function AddTransactionModal({
  open,
  onClose,
  contacts,
  selectedContactId,
  onAdd,
}: AddTransactionModalProps) {
  const [contactId, setContactId] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'GIVEN' | 'TAKEN'>('GIVEN')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentParams, setPaymentParams] = useState<UpiPaymentParams | null>(null)

  // Pre-select contact when modal opens
  useEffect(() => {
    if (open && selectedContactId) {
      setContactId(selectedContactId)
    }
  }, [open, selectedContactId])

  // Derive selected contact object
  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === contactId) ?? null,
    [contacts, contactId]
  )

  // Show "Save & Pay" only when GIVEN + contact has UPI ID
  const canPay = type === 'GIVEN' && !!selectedContact?.upiId && !!amount && parseFloat(amount) > 0

  const resetForm = () => {
    setAmount('')
    setReference('')
    setContactId(selectedContactId ?? '')
    setType('GIVEN')
  }

  const saveTransaction = async (): Promise<boolean> => {
    if (!contactId || !amount) return false
    setLoading(true)
    const success = await onAdd({
      contactId,
      amount: parseFloat(amount),
      type,
      reference: reference.trim() || undefined,
    })
    setLoading(false)
    return success
  }

  // Record only — no payment
  const handleRecordOnly = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await saveTransaction()
    if (success) {
      toast('Transaction recorded!', 'success')
      resetForm()
      onClose()
    } else {
      toast('Failed to record transaction.', 'error')
    }
  }

  // Record and open payment sheet
  const handleSaveAndPay = async () => {
    const success = await saveTransaction()
    if (!success) {
      toast('Failed to record transaction.', 'error')
      return
    }
    toast('Transaction recorded!', 'success')

    // Open payment sheet
    setPaymentParams({
      upiId: selectedContact!.upiId!,
      payeeName: selectedContact!.name,
      amount: parseFloat(amount),
      note: reference.trim() || undefined,
    })
    resetForm()
    onClose()
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Record Transaction">
        <form onSubmit={handleRecordOnly} className="flex flex-col gap-4">
          {/* Contact Select */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium tracking-wide uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Contact
            </label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
              className="glass-input h-10 px-3 text-sm w-full appearance-none cursor-pointer"
            >
              <option value="">Select a contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.upiId ? ' ·  UPI' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Type Toggle */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium tracking-wide uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['GIVEN', 'TAKEN'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border',
                    type === t
                      ? t === 'GIVEN'
                        ? 'bg-[var(--accent-emerald-soft)] text-[var(--accent-emerald)] border-[var(--accent-emerald)]/20'
                        : 'bg-[var(--accent-rose-soft)] text-[var(--accent-rose)] border-[var(--accent-rose)]/20'
                      : 'bg-transparent border-[var(--border-glass)] hover:bg-[var(--bg-glass-hover)]'
                  )}
                  style={type !== t ? { color: 'var(--text-muted)' } : undefined}
                >
                  {t === 'GIVEN' ? '↑ I Gave' : '↓ I Took'}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />

          <Input
            label="Note (optional)"
            type="text"
            placeholder="e.g., Dinner share, Cab fare"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          {/* Action Buttons */}
          <div className={cn('grid gap-2 mt-2', canPay ? 'grid-cols-2' : 'grid-cols-1')}>
            <Button
              type="submit"
              variant="secondary"
              loading={loading}
              className="w-full gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              {canPay ? 'Record Only' : 'Record'}
            </Button>

            {canPay && (
              <Button
                type="button"
                loading={loading}
                onClick={handleSaveAndPay}
                className="w-full gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                Save & Pay
              </Button>
            )}
          </div>

          {/* UPI hint */}
          {type === 'GIVEN' && selectedContact && !selectedContact.upiId && (
            <p className="text-[11px] text-center -mt-1" style={{ color: 'var(--text-muted)' }}>
              Add a UPI ID to this contact to enable "Save & Pay"
            </p>
          )}
        </form>
      </Modal>

      {/* Payment Sheet — opens after saving */}
      {paymentParams && (
        <PaymentSheet
          open={paymentParams !== null}
          onClose={() => setPaymentParams(null)}
          params={paymentParams}
          contactName={selectedContact?.name ?? paymentParams.payeeName}
        />
      )}
    </>
  )
}
