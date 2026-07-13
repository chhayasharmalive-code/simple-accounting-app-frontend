// ─── Domain Models ──────────────────────────────────────────────────────────
// Single source of truth for all data shapes returned by the API.
// Every hook, component, and service imports from here — never inline `any`.

export interface Contact {
  id: string
  name: string
  phone: string | null
  avatar: string | null
  upiId: string | null
  balance: number
}

export interface Transaction {
  id: string
  contactId: string
  amount: number | string
  type: 'GIVEN' | 'TAKEN'
  reference: string | null
  createdAt: string
  contact?: {
    id: string
    name: string
  }
}

export interface DashboardStats {
  totalLent: number
  totalBorrowed: number
  netBalance: number
}

// ─── API Request Params ─────────────────────────────────────────────────────

export interface CreateContactParams {
  name: string
  phone?: string
  upiId?: string
  avatar?: string
}

export interface UpdateContactParams {
  name?: string
  phone?: string
  upiId?: string
  avatar?: string
}

export interface CreateTransactionParams {
  contactId: string
  amount: number
  type: 'GIVEN' | 'TAKEN'
  reference?: string
}
