import { useData } from '@/context/DataContext'
import { AddContactModal } from './AddContactModal'
import { EditContactModal } from './EditContactModal'
import { AddTransactionModal } from './AddTransactionModal'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function GlobalModals() {
  const {
    contacts,
    selectedContactId,
    setSelectedContactId,
    addContactOpen,
    setAddContactOpen,
    addTransactionOpen,
    setAddTransactionOpen,
    editContact,
    setEditContact,
    deleteTarget,
    setDeleteTarget,
    createContact,
    updateContact,
    deleteContact,
    createTransaction,
    fetchContacts,
  } = useData()

  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleAddContact = async (params: any) => {
    return createContact(params)
  }

  const handleUpdateContact = async (id: string, params: any) => {
    return updateContact(id, params)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const success = await deleteContact(deleteTarget.id)
    setDeleteLoading(false)

    if (success) {
      toast(`${deleteTarget.name} deleted.`, 'success')
      if (selectedContactId === deleteTarget.id) setSelectedContactId(null)
    } else {
      toast('Failed to delete contact.', 'error')
    }
    setDeleteTarget(null)
  }

  const handleAddTransaction = async (params: any) => {
    const success = await createTransaction(params)
    if (success) {
      // also refresh contacts balance
      fetchContacts()
    }
    return success
  }

  return (
    <>
      <AddContactModal
        open={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onAdd={handleAddContact}
      />

      <EditContactModal
        open={editContact !== null}
        contact={editContact}
        onClose={() => setEditContact(null)}
        onSave={handleUpdateContact}
      />

      <AddTransactionModal
        open={addTransactionOpen}
        onClose={() => setAddTransactionOpen(false)}
        contacts={contacts}
        selectedContactId={selectedContactId}
        onAdd={handleAddTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Contact"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--accent-rose-soft)' }}>
              <Trash2 className="w-5 h-5" style={{ color: 'var(--accent-rose)' }} />
            </div>
            <p className="text-center text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget?.name}</strong>?
              <br />
              <span style={{ color: 'var(--text-muted)' }}>
                This will also delete all their transactions.
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              loading={deleteLoading}
              className="flex-1"
              style={{ backgroundColor: 'var(--accent-rose)', color: '#fff' }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
