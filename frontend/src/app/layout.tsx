import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex flex-1 flex-col">
              {/* Navbar */}
              <Navbar />

              {/* Main content */}
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}