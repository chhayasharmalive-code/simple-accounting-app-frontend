import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  rightElement?: ReactNode
}

export function Input({ label, error, id, className, rightElement, ...props }: InputProps) {
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
      <div className="relative flex items-center w-full">
        <input
          id={inputId}
          className={cn(
            'glass-input h-10 pl-3 text-sm w-full',
            rightElement ? 'pr-11' : 'pr-3',
            error && 'border-[var(--accent-rose)]',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-1 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--accent-rose)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
