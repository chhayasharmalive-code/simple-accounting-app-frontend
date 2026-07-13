import { useState, useRef, useEffect } from 'react'
import { Plus, UserPlus, FilePlus, X } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'

export function FAB() {
  const [open, setOpen] = useState(false)
  const { setAddContactOpen, setAddTransactionOpen } = useData()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on clicking outside
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={menuRef} className="fixed bottom-20 sm:bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Sub-buttons list */}
      <div
        className={cn(
          'flex flex-col gap-2.5 transition-all duration-300 transform origin-bottom',
          open
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        )}
      >
        {/* Add Transaction Button */}
        <button
          onClick={() => {
            setAddTransactionOpen(true)
            setOpen(false)
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border-glass)] shadow-lg hover:bg-[var(--bg-glass-hover)] active:scale-95 transition-all text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="text-xs uppercase tracking-wide opacity-80">Add Transaction</span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-emerald-soft)] text-[var(--accent-emerald)]">
            <FilePlus className="w-4 h-4" />
          </div>
        </button>

        {/* Add Contact Button */}
        <button
          onClick={() => {
            setAddContactOpen(true)
            setOpen(false)
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border-glass)] shadow-lg hover:bg-[var(--bg-glass-hover)] active:scale-95 transition-all text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="text-xs uppercase tracking-wide opacity-80">Add Contact</span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]">
            <UserPlus className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border border-[var(--border-glass)] active:scale-95',
          open
            ? 'bg-[var(--accent-rose-soft)] text-[var(--accent-rose)] rotate-95 hover:bg-[var(--accent-rose-soft)]/80'
            : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]'
        )}
        style={{
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        }}
        aria-label="Quick Actions"
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  )
}
