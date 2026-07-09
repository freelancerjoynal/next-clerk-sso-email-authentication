// src/components/dashboard/DashboardClient.tsx
'use client'

import { useUser } from "@clerk/nextjs"
import { useAppSelector } from '@/lib/redux/hooks'
import { Icons } from '@/components/ui/icons'
import Link from "next/link"
import Image from "next/image"

export function DashboardClient() {
  const { user } = useUser()
  const userRole = useAppSelector((state) => state.user?.role || 'user')
  const userName = useAppSelector((state) => state.user?.name || 'User')

  const stats = [
    { id: 1, label: 'Total Users', value: '1,234', icon: Icons.users, color: 'blue', change: '+12%' },
    { id: 2, label: 'Revenue', value: '$12,345', icon: Icons.chart, color: 'green', change: '+8%' },
    { id: 3, label: 'Orders', value: '567', icon: Icons.shopping, color: 'purple', change: '+5%' },
    { id: 4, label: 'Active Users', value: '89', icon: Icons.userCheck, color: 'orange', change: '-2%' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {user?.imageUrl ? (
              <Image src={user.imageUrl} alt="Profile" width={56} height={56} className="rounded-full ring-4 ring-white/30" />
            ) : (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white/30">
                {userName?.[0] || 'U'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  {userRole || 'User'}
                </span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colors = {
            blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
          }

          return (
            <div key={stat.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}