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
  title?: string
  message: string
  notification_type?: string
  link?: string | null
  created_at: string
  is_read: boolean
}

export interface PerformanceDataPoint {
  date: string
  value: number
}

export interface PerformanceResponse {
  currency: string
  series: PerformanceDataPoint[]
}

export interface ESGDataPoint {
  date: string
  co2_kg: number
  rating: number
}

export interface ESGResponse {
  series: ESGDataPoint[]
  total_co2_kg: number
  avg_rating: number
}

export interface RiskMetrics {
  risk_score: number
  expected_return: number
  sharpe_ratio: number
  volatility: number
}