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

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismissToast(id), 4000)
  }, [dismissToast])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-[320px] w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 ${
            t.exiting ? 'animate-toast-out' : 'animate-toast-in'
          }`}
          style={{
            borderRadius: 'var(--radius-sm)',
            // Solid opaque background — no transparency so it's always readable
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {t.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent-emerald)' }} />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent-rose)' }} />
          )}
          <p className="text-sm flex-1 font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
            {t.message}
          </p>
          <button
            onClick={() => dismissToast(t.id)}
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-[var(--bg-glass-hover)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
