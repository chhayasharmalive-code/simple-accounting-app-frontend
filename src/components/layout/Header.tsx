import { useTheme } from '@/context/ThemeContext'
import { useUser, useClerk } from '@clerk/clerk-react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import logoImg from '@/assets/qr_image.png'



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
            <img src={logoImg} alt="unbox Pay Logo" className="w-6 h-6 object-contain rounded-md" />
            <h1
              className="text-base font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
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
