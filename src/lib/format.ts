// ─── Formatting Utilities ───────────────────────────────────────────────────
// DRY: every component that displays currency or dates imports from here.

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** Format a number as Indian Rupees: ₹1,25,000 */
export function formatINR(amount: number): string {
  return inrFormatter.format(amount)
}

/** Format a number as absolute Indian Rupees (no negative sign) */
export function formatINRAbs(amount: number): string {
  return inrFormatter.format(Math.abs(amount))
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
]

/** Format a date string as "2 hours ago", "yesterday", etc. */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return date.toLocaleDateString('en-IN')
}

/** Format a date string as "14 Jul 2026" */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
