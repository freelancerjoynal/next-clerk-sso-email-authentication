// src/components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { toggleSidebar } from '@/lib/redux/features/sidebarSlice'
import { menuItems } from '@/lib/menuData'
import { SidebarItem } from './SidebarItem'
import { Icons } from '@/components/ui/icons'

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  
  // সব হুক একসাথে উপরে রাখুন - কোনো conditional return এর আগে
  const userRole = useAppSelector((state) => state.user?.role || 'user')
  const sidebar = useAppSelector((state) => state.sidebar)
  const isOpen = sidebar?.isOpen ?? true
  const userName = useAppSelector((state) => state.user?.name || 'Guest')

  // Role based filter
  const filteredMenu = menuItems.filter((item) => {
    if (item.divider) return true
    if (!item.roles) return true
    return item.roles.includes(userRole || 'user')
  })

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch(toggleSidebar())}
      />

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen 
          bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]
          border-r border-purple-500/20
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72' : 'w-20'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-2xl shadow-purple-500/10
        `}
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-pink-500/10 pointer-events-none" />
        
        {/* Logo Section */}
        <div className="relative flex items-center h-20 px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">L</span>
              </div>
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Landing
                </span>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">
                  Dashboard
                </span>
              </div>
            )}
          </Link>
          
          {/* Close Button - Mobile */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden ml-auto p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Icons.close className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="relative h-[calc(100vh-5rem)] overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            {filteredMenu.map((item) => (
              <SidebarItem 
                key={item.id} 
                item={item} 
                isOpen={isOpen}
                pathname={pathname}
              />
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
          <div className={`
            flex items-center gap-3 p-3 rounded-xl
            ${isOpen ? 'justify-start' : 'justify-center'}
            bg-white/5 hover:bg-white/10 transition-all duration-300
          `}>
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userName?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1a2e]"></div>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  {userRole}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}