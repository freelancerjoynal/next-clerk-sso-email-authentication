// src/components/dashboard/Header.tsx
'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { toggleSidebar } from '@/lib/redux/features/sidebarSlice'
import { Icons } from '@/components/ui/icons'
import { SignOutButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const pathname = usePathname()
  
  const userRole = useAppSelector((state) => state.user?.role || 'user')
  const sidebar = useAppSelector((state) => state.sidebar)
  const isOpen = sidebar?.isOpen ?? true
  const userName = useAppSelector((state) => state.user?.name || 'User')

  // Get user full name
  const userFullName = user?.fullName || user?.firstName || userName || 'User'

  // Get current page name from pathname
  const getCurrentPageName = () => {
    const path = pathname?.split('/').filter(Boolean) || []
    
    if (path.length === 0) return 'Dashboard'
    
    const pageNames: Record<string, string> = {
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'users': 'Users',
      'customers': 'Customers',
      'orders': 'Orders',
      'settings': 'Settings',
      'profile': 'Profile',
    }
    
    return pageNames[path[0]] || path[0].charAt(0).toUpperCase() + path[0].slice(1)
  }

  // Get breadcrumb (for sub-pages like users/list)
  const getBreadcrumb = () => {
    const path = pathname?.split('/').filter(Boolean) || []
    
    if (path.length <= 1) return ''
    
    const subPages = path.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1))
    return ` | ${subPages.join(' / ')}`
  }

  const currentPage = getCurrentPageName()
  const breadcrumb = getBreadcrumb()

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] border-b border-purple-500/20">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Side - Hamburger + Page Name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white group flex-shrink-0"
          >
            <Icons.menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          {/* Page Name with Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg font-semibold text-white truncate">
              {currentPage}
            </span>
            {breadcrumb && (
              <>
                <span className="text-gray-500 flex-shrink-0">|</span>
                <span className="text-sm text-purple-400 truncate">
                  {breadcrumb}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search */}
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5">
            <Icons.search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
            <span className="text-xs text-gray-500">⌘K</span>
          </button>

          {/* Role Badge */}
          <div className={`
            hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            ${userRole === 'admin' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
              : userRole === 'customer'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }
          `}>
            {userRole === 'admin' && <Icons.shield className="w-3 h-3" />}
            {userRole === 'customer' && <Icons.userCheck className="w-3 h-3" />}
            {userRole === 'user' && <Icons.user className="w-3 h-3" />}
            <span className="uppercase">{userRole || 'Guest'}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300 overflow-hidden" />
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="w-12 h-12 relative rounded-full ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all"
                />
              ) : (
                <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all">
                  {userFullName?.[0] || 'U'}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a2e]"></div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{userFullName}</p>
              <p className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress || ''}</p>
            </div>
            <SignOutButton>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-red-400 group">
                <Icons.logout className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </header>
  )
}