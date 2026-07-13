import { useState, useEffect } from 'react'
import type { PaymentApp } from '@/lib/upi'

const STORAGE_KEY = 'hisaab_preferred_payment_app'

export function usePaymentPreference() {
  const [preferred, setPreferred] = useState<PaymentApp | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return (stored as PaymentApp) ?? null
    } catch {
      return null
    }
  })

  const savePreference = (app: PaymentApp) => {
    try {
      localStorage.setItem(STORAGE_KEY, app)
    } catch {
      // ignore storage errors
    }
    setPreferred(app)
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setPreferred(stored as PaymentApp)
    } catch {
      // ignore
    }
  }, [])

  return { preferred, savePreference }
}
