import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Prevent the native <dialog> close-on-Escape default from bypassing our state —
  // intercept it and route through onClose so state stays in sync.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  // ⚠️ Intentionally NO backdrop click handler — user must press the X button.

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Swallow all clicks on the backdrop (the <dialog> element itself)
      // without triggering close. Only the X button calls onClose.
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'fixed inset-0 m-auto w-[92vw] max-w-md p-0 rounded-2xl border-0 bg-transparent outline-none',
        'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        className
      )}
    >
      {/* Inner panel — clicks here must NOT bubble up to <dialog> backdrop handler */}
      <div
        className="glass p-6"
        style={{ borderRadius: 'var(--radius)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-[var(--bg-glass-hover)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </dialog>
  )
}
