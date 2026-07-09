// src/app/(protected)/dashboard/page.tsx
'use client'

import { useUser, SignOutButton } from "@clerk/nextjs"
import { useAppSelector } from '@/lib/redux/hooks'
import { Icons } from '@/components/ui/icons'
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const { user } = useUser()
  const userRole = useAppSelector((state) => state.user?.role || 'user')
  const userName = useAppSelector((state) => state.user?.name || 'User')

  // Stats data
  const stats = [
    { 
      id: 1, 
      label: 'Total Users', 
      value: '1,234', 
      icon: Icons.users, 
      color: 'blue',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      id: 2, 
      label: 'Revenue', 
      value: '$12,345', 
      icon: Icons.chart, 
      color: 'green',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      id: 3, 
      label: 'Orders', 
      value: '567', 
      icon: Icons.shopping, 
      color: 'purple',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      id: 4, 
      label: 'Active Users', 
      value: '89', 
      icon: Icons.userCheck, 
      color: 'orange',
      change: '-2%',
      changeType: 'decrease'
    },
  ]

  // Recent activity
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'purchased Product X', time: '2 min ago' },
    { id: 2, user: 'Jane Smith', action: 'created an account', time: '15 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'upgraded to Pro', time: '1 hour ago' },
    { id: 4, user: 'Sarah Wilson', action: 'submitted feedback', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section - Modern Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full ring-4 ring-white/30"
              />
            ) : (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white/30">
                {userName?.[0] || 'U'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {userRole || 'User'}
                </span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
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
          const changeColors = {
            increase: 'text-green-600 dark:text-green-400',
            decrease: 'text-red-600 dark:text-red-400',
          }

          return (
            <div 
              key={stat.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${changeColors[stat.changeType as keyof typeof changeColors]}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link 
              href="/activity" 
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {activity.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {activity.action}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Quick Actions / Profile */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/profile"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
              >
                <Icons.user className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
              >
                <Icons.settings className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Settings</span>
              </Link>
              <Link
                href="/orders"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
              >
                <Icons.shopping className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Orders</span>
              </Link>
              <button
                onClick={() => alert('Test action triggered!')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
              >
                <Icons.plus className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">New</span>
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-gray-900 dark:text-white font-medium truncate ml-4">
                  {user?.primaryEmailAddress?.emailAddress || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                <span className="text-gray-500 dark:text-gray-400">Role</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                  {userRole || 'User'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Content */}
      {userRole === 'admin' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Icons.shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Access
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You have full administrative privileges. Manage users, settings, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      {userRole === 'customer' && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Icons.userCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome to your customer portal. Track orders, manage profile, and more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}