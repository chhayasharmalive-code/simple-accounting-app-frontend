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

// ─── Dashboard API Data Shapes ──────────────────────────────────────────────

export interface DashboardData {
  kpis: {
    netBalance: number
    totalReceivable: number
    totalPayable: number
    activeDebtors: number
    activeCreditors: number
    totalContacts: number
    totalTransactionsCount: number
  }
  charts: {
    dailyTrends: Array<{ date: string; lent: number; borrowed: number }>
    monthlyTrends: Array<{ month: string; lent: number; borrowed: number }>
    distribution: {
      totalLentEver: number
      totalBorrowedEver: number
    }
  }
  insights: {
    topDebtors: Array<{
      contactId: string
      contactName: string
      contactAvatar: string | null
      balance: number
    }>
    topCreditors: Array<{
      contactId: string
      contactName: string
      contactAvatar: string | null
      balance: number
    }>
    peakLendingMonth: { month: string; amount: number } | null
    peakBorrowingMonth: { month: string; amount: number } | null
    peakLendingDay: { date: string; amount: number } | null
    peakBorrowingDay: { date: string; amount: number } | null
  }
  recentActivities: Array<{
    id: string
    contactId: string
    contactName: string
    contactAvatar: string | null
    amount: number | string
    type: 'GIVEN' | 'TAKEN'
    reference: string | null
    createdAt: string
  }>
}
