export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
  preferred_currency: string
  accounts?: Account[]
}

export interface Account {
  id: number
  user: number | User
  name: string
  institution: string
  balance: number
  currency: string
}

export interface Transaction {
  id: number
  account: number | Account
  date: string
  amount: number
  description: string
  category?: string | null
  transaction_type: 'credit' | 'debit'
  esg_score?: ESGScore
}

export interface ESGScore {
  id: number
  transaction: number | Transaction
  co2_impact: number
  sustainability_rating: number
}

export interface Notification {
  id: number
  user: number | User
  message: string
  created_at: string
  is_read: boolean
}