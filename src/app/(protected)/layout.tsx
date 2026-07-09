// src/app/(protected)/layout.tsx
import { Metadata } from 'next'
import { ProtectedLayoutClient } from '@/components/dashboard/ProtectedLayoutClient'

export const metadata: Metadata = {
  title: 'Dashboard - Landing',
  description: 'Protected dashboard area',
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1f] to-[#0a0a0a]">
      {/* Server Component অংশ - Static */}
      <div className="sr-only">
        <h1>Dashboard</h1>
        <p>Protected area</p>
      </div>
      
      {/* Client Component - Interactive অংশ */}
      <ProtectedLayoutClient>
        {children}
      </ProtectedLayoutClient>
    </div>
  )
}