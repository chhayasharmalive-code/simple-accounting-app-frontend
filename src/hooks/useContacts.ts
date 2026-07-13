import { useState, useCallback } from 'react'
import type { ApiClient } from '../services/api-client'
import type { Contact, CreateContactParams, UpdateContactParams } from '../types'

export function useContacts(apiClient: ApiClient | null) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!apiClient) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.getContacts()
      setContacts(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts.')
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const createContact = useCallback(
    async (params: CreateContactParams): Promise<boolean> => {
      if (!apiClient) return false
      setLoading(true)
      setError(null)
      try {
        await apiClient.createContact(params)
        await fetchContacts()
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to create contact.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [apiClient, fetchContacts]
  )

  const updateContact = useCallback(
    async (id: string, params: UpdateContactParams): Promise<boolean> => {
      if (!apiClient) return false
      setLoading(true)
      setError(null)
      try {
        await apiClient.updateContact(id, params)
        await fetchContacts()
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to update contact.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [apiClient, fetchContacts]
  )

  const deleteContact = useCallback(
    async (id: string): Promise<boolean> => {
      if (!apiClient) return false
      setLoading(true)
      setError(null)
      try {
        await apiClient.deleteContact(id)
        await fetchContacts()
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to delete contact.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [apiClient, fetchContacts]
  )

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    clearError: () => setError(null),
  }
}

