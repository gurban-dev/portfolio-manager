import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FinTrack | Sustainable Finance Dashboard',
  description: 'Monitor your accounts, transactions, and ESG performance in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
