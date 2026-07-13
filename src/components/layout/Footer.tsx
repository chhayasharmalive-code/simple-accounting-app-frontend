export function Footer() {
  return (
    <footer
      className="py-6 px-4 text-center text-xs mt-auto"
      style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}
    >
      <p>&copy; {new Date().getFullYear()} HisaabKitaab &middot; Track every rupee, lent or borrowed.</p>
    </footer>
  )
}
