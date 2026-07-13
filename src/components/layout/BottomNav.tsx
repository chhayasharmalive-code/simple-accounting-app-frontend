import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const location = useLocation()
  const path = location.pathname

  const navItems = [
    { label: 'Overview', path: '/', icon: Home },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Ledger', path: '/transactions', icon: Receipt },
  ]

  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around h-16 px-4 shadow-lg border-t border-[var(--border-glass)]"
      style={{
        borderRadius: '20px 20px 0 0',
        backdropFilter: 'blur(20px)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = path === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all"
            style={{
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
            }}
          >
            <div
              className={cn(
                'p-1.5 rounded-xl transition-all duration-300',
                isActive ? 'bg-[var(--accent-primary-soft)] scale-110' : 'bg-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
