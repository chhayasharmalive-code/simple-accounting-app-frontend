import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { ApiClient } from '@/services/api-client'
import { useContacts } from '@/hooks/useContacts'
import { useTransactions } from '@/hooks/useTransactions'
import type { Contact, Transaction, DashboardStats, CreateContactParams, UpdateContactParams, CreateTransactionParams } from '@/types'

interface DataContextType {
  apiClient: ApiClient | null
  contacts: Contact[]
  contactsLoading: boolean
  fetchContacts: () => Promise<void>
  createContact: (params: CreateContactParams) => Promise<boolean>
  updateContact: (id: string, params: UpdateContactParams) => Promise<boolean>
  deleteContact: (id: string) => Promise<boolean>

  transactions: Transaction[]
  txLoading: boolean
  fetchTransactions: () => Promise<void>
  createTransaction: (params: CreateTransactionParams) => Promise<boolean>
  stats: DashboardStats
  contactBalances: Record<string, number>

  // Shared modal states for global trigger
  addContactOpen: boolean
  setAddContactOpen: (open: boolean) => void
  addTransactionOpen: boolean
  setAddTransactionOpen: (open: boolean) => void
  editContact: Contact | null
  setEditContact: (contact: Contact | null) => void
  deleteTarget: Contact | null
  setDeleteTarget: (contact: Contact | null) => void
  selectedContactId: string | null
  setSelectedContactId: (id: string | null) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()
  const { user } = useUser()

  // Modal / Selection states
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)

  // API Client instantiation
  const apiClient = useMemo(
    () =>
      new ApiClient(async () => {
        try {
          return await getToken()
        } catch {
          return null
        }
      }),
    [getToken]
  )

  const {
    contacts,
    loading: contactsLoading,
    fetchContacts,
    createContact: apiCreateContact,
    updateContact: apiUpdateContact,
    deleteContact: apiDeleteContact,
  } = useContacts(apiClient)

  const {
    transactions,
    loading: txLoading,
    stats,
    contactBalances,
    fetchTransactions,
    createTransaction: apiCreateTransaction,
  } = useTransactions(apiClient)

  // Trigger initial fetches when user is loaded
  useEffect(() => {
    if (user) {
      fetchContacts()
      fetchTransactions()
    }
  }, [user, fetchContacts, fetchTransactions])

  const createContact = useCallback(async (params: CreateContactParams) => {
    return apiCreateContact(params)
  }, [apiCreateContact])

  const updateContact = useCallback(async (id: string, params: UpdateContactParams) => {
    return apiUpdateContact(id, params)
  }, [apiUpdateContact])

  const deleteContact = useCallback(async (id: string) => {
    return apiDeleteContact(id)
  }, [apiDeleteContact])

  const createTransaction = useCallback(async (params: CreateTransactionParams) => {
    const success = await apiCreateTransaction(params)
    if (success) {
      // Refresh contacts to update balances immediately
      fetchContacts()
    }
    return success
  }, [apiCreateTransaction, fetchContacts])

  const value = useMemo(() => ({
    apiClient,
    contacts,
    contactsLoading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    transactions,
    txLoading,
    fetchTransactions,
    createTransaction,
    stats,
    contactBalances,

    // Modal triggers
    addContactOpen,
    setAddContactOpen,
    addTransactionOpen,
    setAddTransactionOpen,
    editContact,
    setEditContact,
    deleteTarget,
    setDeleteTarget,
    selectedContactId,
    setSelectedContactId,
  }), [
    apiClient,
    contacts,
    contactsLoading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    transactions,
    txLoading,
    fetchTransactions,
    createTransaction,
    stats,
    contactBalances,
    addContactOpen,
    addTransactionOpen,
    editContact,
    deleteTarget,
    selectedContactId,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
