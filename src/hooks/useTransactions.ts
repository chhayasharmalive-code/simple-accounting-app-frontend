import { useState, useCallback, useMemo } from 'react'
import type { ApiClient } from '../services/api-client'
import type { Transaction, DashboardStats, CreateTransactionParams } from '../types'

export function useTransactions(apiClient: ApiClient | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!apiClient) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.getTransactions()
      setTransactions(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions.')
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const createTransaction = useCallback(
    async (params: CreateTransactionParams): Promise<boolean> => {
      if (!apiClient) return false
      setLoading(true)
      setError(null)
      try {
        await apiClient.createTransaction(params)
        await fetchTransactions()
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to record transaction.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [apiClient, fetchTransactions]
  )

  // ── Derived Stats (DRY — computed once, consumed by many) ───────────────

  const parseAmount = (amt: number | string): number =>
    parseFloat(typeof amt === 'string' ? amt : amt.toString()) || 0

  const stats: DashboardStats = useMemo(() => {
    let totalLent = 0
    let totalBorrowed = 0

    for (const tx of transactions) {
      const amount = parseAmount(tx.amount)
      if (tx.type === 'GIVEN') totalLent += amount
      else if (tx.type === 'TAKEN') totalBorrowed += amount
    }

    return { totalLent, totalBorrowed, netBalance: totalLent - totalBorrowed }
  }, [transactions])

  const contactBalances = useMemo(() => {
    const balances: Record<string, number> = {}

    for (const tx of transactions) {
      const amount = parseAmount(tx.amount)
      if (!balances[tx.contactId]) balances[tx.contactId] = 0
      balances[tx.contactId] += tx.type === 'GIVEN' ? amount : -amount
    }

    return balances
  }, [transactions])

  return {
    transactions,
    loading,
    error,
    stats,
    contactBalances,
    fetchTransactions,
    createTransaction,
    clearError: () => setError(null),
  }
}
