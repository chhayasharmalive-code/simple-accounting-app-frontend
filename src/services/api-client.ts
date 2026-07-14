import type {
  Contact,
  Transaction,
  CreateContactParams,
  UpdateContactParams,
  CreateTransactionParams,
  DashboardData,
} from '../types'

// ─── API Client ─────────────────────────────────────────────────────────────
// Single Responsibility: handles HTTP transport, auth headers, response unwrapping.
// Dependency Inversion: accepts a tokenResolver function, not a Clerk dependency.

export class ApiClient {
  private readonly apiBase: string
  private readonly tokenResolver: () => Promise<string | null>

  constructor(tokenResolver: () => Promise<string | null>, apiBase?: string) {
    this.apiBase = apiBase || import.meta.env.VITE_API_URL || 'http://localhost:3000'
    this.tokenResolver = tokenResolver
  }

  private async headers(): Promise<HeadersInit> {
    const token = await this.tokenResolver()
    if (!token) throw new Error('Unauthorized: No session token available.')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  private async unwrap<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `Request failed (${res.status})`)
    }
    if (res.status === 204) return null as unknown as T
    const json = await res.json()
    return json.data as T
  }

  // ── Contacts ────────────────────────────────────────────────────────────

  async getContacts(): Promise<Contact[]> {
    const h = await this.headers()
    return this.unwrap<Contact[]>(await fetch(`${this.apiBase}/api/contacts`, { headers: h }))
  }

  async getContact(id: string): Promise<Contact> {
    const h = await this.headers()
    return this.unwrap<Contact>(await fetch(`${this.apiBase}/api/contacts/${id}`, { headers: h }))
  }

  async createContact(params: CreateContactParams): Promise<Contact> {
    const h = await this.headers()
    return this.unwrap<Contact>(
      await fetch(`${this.apiBase}/api/contacts`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(params),
      })
    )
  }

  async updateContact(id: string, params: UpdateContactParams): Promise<Contact> {
    const h = await this.headers()
    return this.unwrap<Contact>(
      await fetch(`${this.apiBase}/api/contacts/${id}`, {
        method: 'PATCH',
        headers: h,
        body: JSON.stringify(params),
      })
    )
  }

  async deleteContact(id: string): Promise<void> {
    const h = await this.headers()
    await this.unwrap<void>(
      await fetch(`${this.apiBase}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: h,
      })
    )
  }

  // ── Transactions ────────────────────────────────────────────────────────

  async getTransactions(): Promise<Transaction[]> {
    const h = await this.headers()
    return this.unwrap<Transaction[]>(
      await fetch(`${this.apiBase}/api/transactions`, { headers: h })
    )
  }

  async getContactTransactions(contactId: string): Promise<Transaction[]> {
    const h = await this.headers()
    return this.unwrap<Transaction[]>(
      await fetch(`${this.apiBase}/api/transactions/contact/${contactId}`, { headers: h })
    )
  }

  async createTransaction(params: CreateTransactionParams): Promise<Transaction> {
    const h = await this.headers()
    return this.unwrap<Transaction>(
      await fetch(`${this.apiBase}/api/transactions`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(params),
      })
    )
  }

  async getDashboard(): Promise<DashboardData> {
    const h = await this.headers()
    return this.unwrap<DashboardData>(
      await fetch(`${this.apiBase}/api/dashboard`, { headers: h })
    )
  }
}
