export function Spinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className || ''}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: 'var(--accent-primary)',
            animation: `pulse-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
