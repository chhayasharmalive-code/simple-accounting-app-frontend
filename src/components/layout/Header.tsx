import { useTheme } from '@/context/ThemeContext'
import { useUser, useClerk } from '@clerk/clerk-react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

import { NavLink } from 'react-router-dom'

// Colorful Google Logo brand icon
function GoogleLogo({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        fill="#EA4335"
        d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.97 11.97 0 0012 0C7.305 0 3.284 2.56 1.145 6.327l4.12 3.438z"
      />
      <path
        fill="#34A853"
        d="M16.04 15.35c-1.07.72-2.43 1.15-4.04 1.15a7.09 7.09 0 01-6.73-4.85l-4.12 3.44C3.28 19.38 7.3 22 12 22c3.21 0 6.13-1.12 8.35-3l-4.31-3.65z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.6-.21-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.56l4.31 3.65c2.52-2.31 3.99-5.71 3.99-9.45z"
      />
      <path
        fill="#FBBC05"
        d="M5.266 14.235A7.09 7.09 0 014.91 12c0-.79.13-1.56.36-2.24L1.14 6.33A11.97 11.97 0 000 12c0 2.05.52 4 1.43 5.7l3.83-3.46z"
      />
    </svg>
  )
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--border-glass)] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h1
              className="text-base font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              HisaabKitaab
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
                    `px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive
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

          {/* User Menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-glass-hover)] shadow-sm flex items-center justify-center"
                aria-label="User menu"
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {user.firstName?.[0] || 'U'}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div
                  className="glass absolute right-0 top-12 w-56 p-2 animate-fade-in z-50"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <div className="px-3 py-2 mb-1 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-glass)] flex items-center justify-center shrink-0">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || 'User'}
                          className="w-full h-full object-cover"
                        />
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
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--accent-rose-soft)]"
                    style={{ color: 'var(--accent-rose)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
