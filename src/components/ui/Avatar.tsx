import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

/** Deterministic warm color from a string */
function nameToColor(name: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#2563eb',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

import { useState } from 'react'

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  // Use custom uploaded image if available. Otherwise, fetch initials avatar from DiceBear.
  // We use clean modern background colors matching our theme palette.
  const dicebearUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name || 'U'
  )}&chars=2&fontFamily=Arial,sans-serif&backgroundColor=6366f1,8b5cf6,a855f7,d946ef,ec4899,f43f5e,ef4444,f97316,22c55e,14b8a6,3b82f6`

  const avatarSrc = src || dicebearUrl

  if (imgError) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white shrink-0',
          sizes[size],
          className
        )}
        style={{ backgroundColor: nameToColor(name || 'U') }}
        aria-label={name}
      >
        {getInitials(name || 'U')}
      </div>
    )
  }

  return (
    <img
      src={avatarSrc}
      alt={name}
      className={cn('rounded-full object-cover shrink-0 bg-[var(--bg-glass-hover)] border border-[var(--border-glass)]', sizes[size], className)}
      onError={() => setImgError(true)}
    />
  )
}
