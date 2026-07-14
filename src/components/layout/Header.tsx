import { useTheme } from '@/context/ThemeContext'
import { useUser, useClerk } from '@clerk/clerk-react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import logoImg from '@/assets/qr_image.png'

// ─── Portal Dropdown ──────────────────────────────────────────────────────────
// Renders outside the <header> stacking context so backdrop-filter works in
// every browser (sticky/fixed ancestors break nested backdrop-filter).
interface UserMenuDropdownProps {
  anchor: DOMRect
  user: { firstName?: string | null; username?: string | null; fullName?: string | null; imageUrl?: string; primaryEmailAddress?: { emailAddress: string } | null }
  onClose: () => void
  onSignOut: () => void
}

function UserMenuDropdown({ anchor, user, onClose, onSignOut }: UserMenuDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Slight delay so the button's own toggle click doesn't immediately close
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 10)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Position: align right edge of dropdown with right edge of anchor button
  const top = anchor.bottom + 8
  const right = window.innerWidth - anchor.right

  return createPortal(
    <div
      ref={ref}
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top,
        right,
        width: 224,
        zIndex: 9999,
        // Full glassmorphism — NOT inside any stacking context ancestor
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem',
      }}
    >
      {/* User info */}
      <div
        className="px-3 py-2 mb-1 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-glass)] flex items-center justify-center shrink-0">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {user.firstName?.[0] || 'U'}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {user.firstName || user.username || 'User'}
          </p>
          <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--accent-rose-soft)]"
        style={{ color: 'var(--accent-rose)' }}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>,
    document.body
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  const handleAvatarClick = () => {
    if (!menuOpen && avatarRef.current) {
      setAnchorRect(avatarRef.current.getBoundingClientRect())
    }
    setMenuOpen(prev => !prev)
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--border-glass)] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Brand & Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="unbox Pay Logo" className="w-6 h-6 object-contain rounded-md" />
            <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              unbox Pay
            </h1>
          </div>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1.5">
              {[
                { name: 'Dashboard', to: '/' },
                { name: 'Contacts', to: '/contacts' },
                { name: 'Transactions', to: '/transactions' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${isActive
                      ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--bg-glass-hover)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {/* User Avatar Button */}
          {user && (
            <button
              ref={avatarRef}
              onClick={handleAvatarClick}
              className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-secondary)] hover:ring-2 hover:ring-[var(--accent-primary)] shadow-sm flex items-center justify-center transition-all"
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user.firstName?.[0] || 'U'}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown rendered as portal to escape sticky stacking context */}
      {menuOpen && anchorRect && user && (
        <UserMenuDropdown
          anchor={anchorRect}
          user={user}
          onClose={() => setMenuOpen(false)}
          onSignOut={() => { signOut(); setMenuOpen(false) }}
        />
      )}
    </header>
  )
}
