import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error'

interface ToastData {
  id: number
  message: string
  type: ToastType
  exiting?: boolean
}

let toastId = 0
let addToastFn: ((message: string, type: ToastType) => void) | null = null

/** Imperative toast trigger — call from anywhere */
export function toast(message: string, type: ToastType = 'success') {
  addToastFn?.(message, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismissToast(id), 4000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`glass flex items-start gap-3 p-4 pointer-events-auto ${
            t.exiting ? 'animate-toast-out' : 'animate-toast-in'
          }`}
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {t.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-emerald)' }} />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-rose)' }} />
          )}
          <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
            {t.message}
          </p>
          <button
            onClick={() => dismissToast(t.id)}
            className="shrink-0"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
