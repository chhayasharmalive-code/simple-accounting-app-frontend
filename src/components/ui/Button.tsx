import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-primary)] text-white hover:opacity-90 active:scale-[0.98]',
  secondary:
    'glass glass-hover text-[var(--text-primary)] border-[var(--border-glass)]',
  ghost:
    'bg-transparent hover:bg-[var(--bg-glass)] active:scale-[0.98]',
  danger:
    'bg-[var(--accent-rose-soft)] text-[var(--accent-rose)] hover:opacity-90 active:scale-[0.98]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 select-none whitespace-nowrap',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
