// src/app/(protected)/dashboard/page.tsx
import { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard - Landing',
  description: 'User dashboard with analytics',
}

export default function DashboardPage() {
  return (
    <div>
      {/* Server Component Static Content */}
      <div className="sr-only">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard</p>
      </div>
      
      {/* Client Component - Dynamic Content */}
      <DashboardClient />
    </div>
  )
}