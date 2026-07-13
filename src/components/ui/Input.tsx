import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium tracking-wide uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'glass-input h-10 px-3 text-sm w-full',
          error && 'border-[var(--accent-rose)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs" style={{ color: 'var(--accent-rose)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
