// src/components/dashboard/ProtectedLayoutClient.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setUser } from '@/lib/redux/store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const sidebar = useAppSelector((state) => state.sidebar)
  const isOpen = sidebar?.isOpen ?? true

  // Authentication check - Client side
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.replace('/sign-in')
        return
      }

      if (user) {
        const role = user.publicMetadata?.role as 'admin' | 'customer' | 'user' || 'user'
        dispatch(setUser({
          name: user.firstName || user.username || 'User',
          email: user.primaryEmailAddress?.emailAddress || '',
          role: role,
        }))
      }
    }
  }, [isLoaded, isSignedIn, user, router, dispatch])

  // Loading state - Client
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div>
      <Sidebar />
      <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}